import { Router } from 'express';
import { validatePost, validatePut } from './validation.js';
import {
  formatString,
  validateDepartment,
  paginateModel,
  throwError,
} from '../../utils/helpers.js';
import { mongoose } from 'mongoose';

export const areaRouter = new Router();
areaRouter.get('/:id', getArea);
areaRouter.get('/', getAreas);
areaRouter.post('/', validatePost, createArea);
areaRouter.put('/:id', validatePut, updateArea);
areaRouter.delete('/:id', deleteArea);

async function getArea(req, res, next) {
  req.logger.info('getArea with id: ' + req.params.id);

  try {
    const area = await paginateModel(
      req.model('Area'),
      { _id: req.params.id },
      {
        populate: {
          path: 'departments',
          select: '_id name description head',
          populate: { path: 'head', select: '_id firstName lastName' },
        },
      },
    );

    if (!area) {
      req.logger.error('Area not found');
      throwError('Area not found', 404);
    }

    req.logger.info('Area found');

    res.send(area);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function getAreas(req, res, next) {
  req.logger.info('getAreas');

  const { page, limit } = req;

  try {
    const areas = await paginateModel(
      req.model('Area'),
      {},
      {
        page,
        limit,
        sort: 'name',
        populate: {
          path: 'departments',
          select: '_id name description head',
          populate: {
            path: 'head',
            select: '_id firstName lastName',
          },
        },
      },
    );

    req.logger.info('Areas found');

    res.send(areas);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function createArea(req, res, next) {
  if (!req.isAdmin()) {
    throwError('Unauthorized role', 403);
  }
  //Format name
  req.body.name = formatString(req.body.name);

  req.logger.info(`createArea ${req.body.name}`);

  try {
    req.logger.verbose('Validating if area does not exist first.');

    const areaFound = await req.model('Area').findOne({ name: req.body.name });

    if (areaFound) {
      req.logger.error('Area already exists');
      throwError('Area already exists', 400);
    }

    req.logger.info('Area name available for creation.');

    await Promise.all(
      req.body.departments.map((department) =>
        validateDepartment(req, department),
      ),
    );

    req.body.departments = filterDepartments(req.body.departments);

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
  try {
    if (!req.params.id) {
      throwError('Parameter id not found', 404);
    }

    if (!req.isAdmin()) {
      throwError('Unauthorized role', 403);
    }

    req.logger.info('updateArea with id: ' + req.params.id);
    req.logger.verbose('Validating if area exists.');

    const areaFound = await req.model('Area').findById(req.params.id);

    if (!areaFound) {
      req.logger.error('Area not found');
      throwError('Area not found', 404);
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
          validateDepartment(req, department),
        ),
      );
      req.body.departments = filterDepartments(req.body.departments);
    }

    await areaFound.updateOne(req.body);

    req.logger.info('Area updated');

    res.send({ message: `Area with id ${req.params.id} updated.` });
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function deleteArea(req, res, next) {
  try {
    if (!req.params.id) {
      throwError('Parameter id not found', 404);
    }

    if (!req.isAdmin()) {
      throwError('Unauthorized role', 403);
    }

    req.logger.info('deleteArea with id: ' + req.params.id);
    req.logger.verbose('Validating if area exists.');

    const areaFound = await req.model('Area').findById(req.params.id);

    if (!areaFound) {
      req.logger.error('Area not found');
      throwError('Area not found', 404);
    }

    req.logger.verbose('Area found. Deleting area.');

    await areaFound.deleteOne();
    res.send({ message: `Area with id ${req.params.id} deleted.` });
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

const filterDepartments = (departments) => {
  //filter duplicates ids
  let filteredIds = Array.from(new Set(departments));

  if (filteredIds.length === 0) {
    return [];
  }

  //casting all ids to objectId
  return filteredIds.map((id) => new mongoose.Types.ObjectId(id));
};
