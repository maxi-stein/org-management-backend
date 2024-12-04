import { Router } from 'express';

import { generateUserAndToken } from '../../utils/generate-user-and-token.js';
import { throwError } from '../../utils/helpers.js';

export const authenticationRouter = new Router();

authenticationRouter.post('/', createUserToken);

async function createUserToken(req, res, next) {
  req.logger.info(`Creating user token for ${req.body.email}`);

  try {
    if (!req.body.email) {
      req.logger.verbose('Missing email parameter. Sending 400 to client');
      throwError('Missing email parameter', 400);
    }

    if (!req.body.password) {
      req.logger.info('Missing password parameter. Sending 400 to client');
      throwError('Missing password parameter', 400);
    }

    const user = await req
      .model('User')
      .findOne({ email: req.body.email }, '+password');

    if (!user) {
      req.logger.verbose('User or password is invalid. Sending 401 to client');
      throwError('User or password is invalid', 401);
    }

    req.logger.verbose('Checking user password');
    const result = await user.checkPassword(req.body.password);

    if (result.isLocked) {
      req.logger.verbose('User is locked. Sending 400 (Locked) to client');
      throwError('User is locked. Try again later', 400);
    }

    if (!result.isOk) {
      req.logger.verbose('User or password is invalid. Sending 401 to client');
      throwError('User or password is invalid', 401);
    }

    const response = await generateUserAndToken(req, user);

    res.status(201).json(response);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}
