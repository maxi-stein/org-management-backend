import { Router } from 'express';
import { validatePost, validatePut } from './validation.js';
import {
  formatStringCamelCase,
  paginateModel,
  throwError,
} from '../../utils/helpers.js';

export const positionRouter = new Router();
positionRouter.get('/:id', getPosition);
positionRouter.get('/', getPositions);
positionRouter.post('/', validatePost, createPosition);
positionRouter.put('/:id', validatePut, updatePosition);
positionRouter.delete('/:id', deletePosition);

async function getPosition(req, res, next) {
  req.logger.info('getPosition with id: ' + req.params.id);

  try {
    const position = await paginateModel(
      req.model('Position'),
      { _id: req.params.id },
      {},
    );

    if (!position.data.length > 0) {
      req.logger.error('Position not found');
      throwError('Position not found', 404);
    }

    req.logger.info('Position found');

    res.send(position);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function getPositions(req, res, next) {
  req.logger.info('getPositions');

  const { page, limit } = req;

  try {
    const positions = await paginateModel(
      req.model('Position'),
      {},
      { page, limit, sort: 'title' },
    );

    req.logger.info('Positions found');

    res.send(positions);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function createPosition(req, res, next) {
  if (!req.isAdmin()) {
    throwError('Unauthorized role', 403);
  }

  //Format title and level
  ['title', 'level'].forEach(
    (field) =>
      req.body[field] &&
      (req.body[field] = formatStringCamelCase(req.body[field])),
  );

  if (req.body.level) {
    req.logger.info(`createPosition: ${req.body.level} ${req.body.title} `);
  } else {
    req.logger.info(`createPosition: ${req.body.title}`);
  }

  try {
    req.logger.verbose('Validating if position does not exist first.');

    const positionFound = await req
      .model('Position')
      .findOne({ title: req.body.title, level: req.body.level });

    if (positionFound) {
      req.logger.error('Position already exists');
      throwError('Position already exists', 400);
    }

    req.logger.verbose('Position does not exist. Creating new position.');

    const position = await req.model('Position').create(req.body);

    req.logger.info('Position created');

    res.status(201).send(position);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function updatePosition(req, res, next) {
  if (!req.params.id) {
    throwError('Parameter id not found', 404);
  }

  if (!req.isAdmin()) {
    throwError('Unauthorized role', 403);
  }

  req.logger.info('updatePosition with id: ' + req.params.id);
  req.logger.verbose('Validating if position exists.');

  try {
    const positionFound = await req.model('Position').findById(req.params.id);

    if (!positionFound) {
      req.logger.error('Position not found');
      throwError('Position not found', 404);
    }

    //deny edit of Head of Department and CEO (critical positions)
    if (
      positionFound.title === 'CEO' ||
      positionFound.title === 'Head of Department'
    ) {
      req.logger.error('Position cannot be edited');
      throwError('Position cannot be edited', 403);
    }

    req.logger.verbose('Position found. Updating position.');

    //format title and level
    ['title', 'level'].forEach(
      (field) =>
        req.body[field] &&
        (req.body[field] = formatStringCamelCase(req.body[field])),
    );

    await positionFound.updateOne(req.body);

    req.logger.info('Position updated');

    res.send({ message: `Position with id ${req.params.id} updated.` });
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function deletePosition(req, res, next) {
  if (!req.params.id) {
    throwError('Parameter id not found', 404);
  }

  if (!req.isAdmin()) {
    throwError('Unauthorized role', 403);
  }

  req.logger.info('deletePosition with id: ' + req.params.id);
  req.logger.verbose('Validating if position exists.');

  const positionFound = await req.model('Position').findById(req.params.id);

  if (!positionFound) {
    req.logger.error('Position not found');
    throwError('Position not found', 404);
  }

  //deny delete of Head of Department and CEO (critical positions)
  if (
    positionFound.title === 'CEO' ||
    positionFound.title === 'Head Of Department'
  ) {
    req.logger.error('Position cannot be edited');
    throwError('Position cannot be edited', 403);
  }

  req.logger.verbose('Position found. Deleting position.');

  try {
    await positionFound.deleteOne();
    res.send({ message: `Position with id ${req.params.id} deleted.` });
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}
