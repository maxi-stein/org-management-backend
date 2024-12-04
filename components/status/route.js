import { Router } from 'express';
import pkg from '../../package.json' with { type: 'json' };

export const statusRouter = new Router();

statusRouter.get('/', getRoot);
statusRouter.get('/status', getStatus);

function getRoot(req, res) {
  req.logger.verbose('Responding to root request');
  req.logger.verbose('Sending response to client');

  /* eslint-disable no-undef */
  res.send({
    name: pkg.name,
    version: pkg.version,
    environment: process.env.NODE_ENV,
  });
}

async function getStatus(req, res, next) {
  req.logger.verbose('Responding to status request');

  try {
    const result = await req.pingDatabase();

    if (!result || !result.ok) {
      return res.sendStatus(503);
    }

    res.send({ status: 'The API is up and running' });
  } catch (err) {
    next(err);
  }
}
