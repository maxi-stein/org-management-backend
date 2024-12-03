import { Router } from 'express';
import { formatString, paginateModel } from '../../utils/helpers.js';

export const roleRouter = new Router();
roleRouter.get('/', getRoles);

async function getRoles(req, res, next) {
  req.logger.info('getRoles');

  const { page, limit } = req;

  try {
    const roles = await paginateModel(req.model('Role'), {}, { page, limit });

    req.logger.info('Roles found');

    res.send(roles);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}
