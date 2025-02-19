import http from 'http';
import express from 'express';
import expressBodyParser from 'body-parser';
import onFinished from 'on-finished';
import cors from 'cors';
import Mongoose from 'mongoose';
import {
  authentication,
  authorization,
} from '../components/authentication/middleware.js';
import { userRouter } from '../components/user/route.js';
import { positionRouter } from '../components/position/route.js';
import { departmentRouter } from '../components/department/route.js';
import { areaRouter } from '../components/area/route.js';
import { statusRouter } from '../components/status/route.js';
import { roleRouter } from '../components/role/route.js';
import { authenticationRouter } from '../components/authentication/route.js';
import { statsRouter } from '../components/statistics/route.js';

export class Server {
  constructor(config, logger, database) {
    this.config = config;
    this.logger = logger.child({ context: 'Server' });
    this.database = database;

    this.logger.verbose('Creating express app and HTTP server instance');
    this.app = express();
    this._httpServer = http.createServer(this.app);
    this.logger.verbose('Express app and HTTP server instance created');

    // Enable if we're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx,
    // etc) see https://expressjs.com/en/guide/behind-proxies.html
    this.app.set('trust proxy', 1);

    this._setupExpressMiddleware();
    this._setupExpressRoutes();
    this._setupErrorHandler();
  }

  async listen() {
    this.logger.verbose(
      `Attempting to bind HTTP server to ${this.config.server.url}`,
    );
    this._httpServer.listen(this.config.server.port || 3000, (err) => {
      if (err) {
        return Promise.reject(err);
      }

      this.logger.verbose('HTTP server bound');
      return Promise.resolve();
    });
  }

  async close() {
    this._httpServer.close((err) => {
      if (err) {
        return Promise.reject(err);
      }
      return Promise.resolve();
    });
  }

  _setupExpressMiddleware() {
    this.app.request.config = this.config;
    this.app.request.model = (...args) => this.database.model(...args);
    this.app.request.pingDatabase = (...args) => this.database.ping(...args);

    const requestLogger = () => (req, res, next) => {
      req._startTime = Date.now();
      req.logger = this.logger.child({});
      const {
        host,
        'content-type': contentType,
        'user-agent': userAgent,
        accept,
        'content-length': contentLength,
      } = req.headers;
      // delete headers.authorization;

      req.logger.info(
        `Incoming request: body=${JSON.stringify(req.body)} httpVersion=${req.httpVersion} method=${req.method} url=${req.url}} trailers=${JSON.stringify(req.trailers)} headers={"host"=${host}, "contentType"=${contentType}, "userAgent"=${userAgent}, "accept"=${accept}, "contentLength"=${contentLength}}`,
      );

      onFinished(res, () => {
        req.logger.info(
          `Outgoing response: httpVersion=${req.httpVersion} method=${req.method} url=${req.url} statusCode=${res.statusCode} ip=${
            req.headers['x-forwarded-for'] || req.connection.remoteAddress
          } requestId=${req.id} duration=${Date.now() - req._startTime} user=${
            req.user ? req.user._id : 'unauthenticated'
          }`,
        );
      });

      next(null);
    };

    const requestQuery = () => (req, res, next) => {
      req.select = req.query.select;
      req.sort = req.query.sort;
      req.populate = req.query.populate;
      req.offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
      req.limit = req.query.limit;

      delete req.query.sort;
      delete req.query.offset;
      delete req.query.limit;
      delete req.query.select;
      delete req.query.populate;

      next(null);
    };

    const successWrapper = () => (req, res, next) => {
      const originalJson = res.json.bind(res);

      res.json = (data) => {
        if (typeof data === 'string') {
          return originalJson({ success: true, data });
        } else if (typeof data === 'object' && data !== null) {
          return originalJson({ success: true, ...data });
        }
        return originalJson(data); // Por si acaso, manejo de casos inusuales.
      };

      next();
    };

    this.logger.verbose('Attaching middleware to express app');
    this.app.use(authorization);
    this.app.use(cors());
    this.app.use(expressBodyParser.raw());
    this.app.use(expressBodyParser.json({ limit: '50mb' }));
    this.app.use(expressBodyParser.urlencoded({ extended: true }));
    this.app.use(requestQuery());
    this.app.use(requestLogger());
    this.app.use(successWrapper());
    this.logger.verbose('Middleware attached');
  }

  _setupExpressRoutes() {
    this.logger.verbose('Attaching resource routers to express app');

    this.app.use('/', statusRouter);
    this.app.use('/auth', authenticationRouter);
    this.app.use('/users', authentication, userRouter);
    this.app.use('/positions', authentication, positionRouter);
    this.app.use('/departments', authentication, departmentRouter);
    this.app.use('/areas', authentication, areaRouter);
    this.app.use('/roles', authentication, roleRouter);
    this.app.use('/stats', authentication, statsRouter);

    this.logger.verbose('Resource routers attached');
  }

  _setupErrorHandler() {
    this.logger.verbose('Attaching error handler');

    this.app.use((err, req, res, next) => {
      if (!err.statusCode) {
        err.statusCode = Server.statusCodeByErrorName[err.name] || 500;
      }

      const errorResponse = {
        success: false,
        error: {
          message: err.message || 'Internal server error',
          code: err.statusCode || 500,
        },
      };

      if (err instanceof Mongoose.Error.ValidationError) {
        this.logger.debug('Mongoose validation error: ' + JSON.stringify(err));
        errorResponse.error.details = Object.keys(err.errors).map((field) => ({
          field,
          message: err.errors[field].message,
        }));
        res.status(err.statusCode).json(errorResponse);
      } else {
        this.logger.verbose('Responding to client: ' + err.toString());
        res.status(err.statusCode).json(errorResponse);
      }
    });

    this.logger.verbose('Error handler attached');
  }
}

Server.statusCodeByErrorName = {
  ValidationError: 400,
  CastError: 400,
  UnauthorizedError: 401,
};
