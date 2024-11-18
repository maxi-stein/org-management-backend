import { Router } from 'express';
import { validatePost, validatePut } from './validation.js';
import { formatString, validateDepartment } from '../../utils/helpers.js';

export const positionRouter = new Router();
positionRouter.get('/:id', getPosition);
positionRouter.get('/', getPositions);
positionRouter.post('/', validatePost, createPosition);
positionRouter.put('/:id', validatePut, updatePosition);
positionRouter.delete('/:id', deletePosition);

async function getPosition(req, res, next) {
  try {
    req.logger.info('getPosition with id: ' + req.params.id);

    const position = await req.model('Position').findById(req.params.id);

    if (!position) {
      req.logger.error('Position not found');
      return res.status(404).send('Position not found.');
    }

    req.logger.info('Position found');

    res.send(position);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function getPositions(req, res, next) {
  try {
    req.logger.info('getPositions');

    const positions = await req.model('Position').find();

    req.logger.info('Positions found');

    res.send(positions);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function createPosition(req, res, next) {
  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized role');
  }
  //Format title and level
  ['title', 'level'].forEach(
    (field) =>
      req.body[field] && (req.body[field] = formatString(req.body[field])),
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
      return res.status(400).send('Position already exists');
    }

    await validateDepartment(req, res, next, req.body.department);

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
    return res.status(404).send('Parameter id not found');
  }

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized role');
  }

  req.logger.info('updatePosition with id: ' + req.params.id);
  req.logger.verbose('Validating if position exists.');

  try {
    const positionFound = await req.model('Position').findById(req.params.id);

    if (!positionFound) {
      req.logger.error('Position not found');
      return res.status(404).send('Position not found.');
    }

    req.logger.verbose('Position found. Updating position.');

    //format title and level
    ['title', 'level'].forEach(
      (field) =>
        req.body[field] && (req.body[field] = formatString(req.body[field])),
    );

    if (req.body.department) {
      await validateDepartment(req, res, next, req.body.department);
    }

    await positionFound.updateOne(req.body);

    req.logger.info('Position updated');

    res.status(200).send(`Position with id ${req.params.id} updated.`);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function deletePosition(req, res, next) {
  if (!req.params.id) {
    return res.status(404).send('Parameter id not found');
  }

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized role');
  }

  req.logger.info('deletePosition with id: ' + req.params.id);
  req.logger.verbose('Validating if position exists.');

  const positionFound = await req.model('Position').findById(req.params.id);

  if (!positionFound) {
    req.logger.error('Position not found');
    return res.status(404).send('Position not found.');
  }

  req.logger.verbose('Position found. Deleting position.');

  try {
    await positionFound.deleteOne();
    res.status(200).send(`Position with id ${req.params.id} deleted.`);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}
