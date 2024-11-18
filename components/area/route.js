import { Router } from 'express';
import { validatePost, validatePut } from './validation.js';
import { formatString, validateDepartment } from '../../utils/helpers.js';

export const areaRouter = new Router();
areaRouter.get('/:id', getArea);
areaRouter.get('/', getAreas);
areaRouter.post('/', validatePost, createArea);
areaRouter.put('/:id', validatePut, updateArea);
areaRouter.delete('/:id', deleteArea);

async function getArea(req, res, next) {
  try {
    req.logger.info('getArea with id: ' + req.params.id);

    const area = await req.model('Area').findById(req.params.id);

    if (!area) {
      req.logger.error('Area not found');
      return res.status(404).send('Area not found.');
    }

    req.logger.info('Area found');

    res.send(area);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function getAreas(req, res, next) {
  try {
    req.logger.info('getAreas');

    const areas = await req.model('Area').find();

    req.logger.info('Areas found');

    res.send(areas);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function createArea(req, res, next) {
  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized role');
  }
  //Format name
  req.body.name = formatString(req.body.name);

  req.logger.info(`createArea ${req.body.name}`);

  try {
    req.logger.verbose('Validating if area does not exist first.');

    const areaFound = await req.model('Area').findOne({ name: req.body.name });

    if (areaFound) {
      req.logger.error('Area already exists');
      return res.status(400).send('Area already exists');
    }

    await Promise.all(
      req.body.deparments.map((department) =>
        validateDepartment(req, res, next, department),
      ),
    );

    req.logger.verbose('Area does not exist. Creating new area.');

    const area = await req.model('Area').create(req.body);

    req.logger.info('Area created');

    res.status(201).send(area);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function updateArea(req, res, next) {
  if (!req.params.id) {
    return res.status(404).send('Parameter id not found');
  }

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized role');
  }

  req.logger.info('updateArea with id: ' + req.params.id);
  req.logger.verbose('Validating if area exists.');

  try {
    const areaFound = await req.model('Area').findById(req.params.id);

    if (!areaFound) {
      req.logger.error('Area not found');
      return res.status(404).send('Area not found.');
    }

    req.logger.verbose('Area found. Updating area.');

    //format title and level
    ['title', 'level'].forEach(
      (field) =>
        req.body[field] && (req.body[field] = formatString(req.body[field])),
    );

    if (req.body.departments) {
      await Promise.all(
        req.body.departments.map((department) =>
          validateDepartment(req, res, next, department),
        ),
      );
    }

    await areaFound.updateOne(req.body);

    req.logger.info('Area updated');

    res.status(200).send(`Area with id ${req.params.id} updated.`);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function deleteArea(req, res, next) {
  if (!req.params.id) {
    return res.status(404).send('Parameter id not found');
  }

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized role');
  }

  req.logger.info('deleteArea with id: ' + req.params.id);
  req.logger.verbose('Validating if area exists.');

  const areaFound = await req.model('Area').findById(req.params.id);

  if (!areaFound) {
    req.logger.error('Area not found');
    return res.status(404).send('Area not found.');
  }

  req.logger.verbose('Area found. Deleting area.');

  try {
    await areaFound.deleteOne();
    res.status(200).send(`Area with id ${req.params.id} deleted.`);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}
