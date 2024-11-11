import { Router } from 'express';
import { validatePost } from './validation.js';

export const roleRouter = Router();

roleRouter.get('/', getAllRoles);
roleRouter.get('/:id', getRoleById);
roleRouter.post('/', validatePost, createRole);
roleRouter.put('/:id', updateRole);

async function getAllRoles(req, res, next) {
  req.logger.info('getAllRoles');

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized');
  }

  try {
    const roles = await req.model('Role').find();
    res.send(roles);
  } catch (err) {
    next(err);
  }
}

async function getRoleById(req, res, next) {
  const { _id } = req.params;
  req.logger.info('getRoleById with id: ' + _id);

  if (!_id) {
    return res.status(404).send('Parameter Id not found');
  }

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized');
  }

  try {
    const role = await req.model('Role').findById(_id);

    if (!role) {
      req.logger.error('Role not found');
      return res.status(404).send('Role not found');
    }

    res.send(role);
  } catch (err) {
    next(err);
  }
}

async function createRole(req, res, next) {
  req.logger.info('createRole');

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized');
  }

  const { name } = req.body;
  const roleExists = await req.model('Role').findOne({ name });

  if (roleExists) {
    req.logger.error('Role already exists');
    return res.status(400).send('Role already exists');
  }

  try {
    const newRole = await req.model('Role').create(req.body);

    res.send(newRole);
  } catch (err) {
    next(err);
  }
}

async function updateRole(req, res, next) {
  const { _id } = req.params;
  req.logger.info('updateRole with id: ' + req.params._id);

  if (!_id) {
    return res.status(404).send('Parameter Id not found');
  }

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized');
  }

  try {
    const roleToUpdate = await req.model('Role').findById(_id);

    if (!roleToUpdate) {
      req.logger.error('Role not found');
      return res.status(404).send('Role not found');
    }

    await roleToUpdate.updateOne(req.body);

    res.send(roleToUpdate);
  } catch (err) {
    next(err);
  }
}
