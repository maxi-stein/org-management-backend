import { Router } from 'express';
import {
  formatString,
  validateHeadOfDepartment,
  paginateModel,
  throwError,
} from '../../utils/helpers.js';
import { validatePost, validatePut } from './validation.js';

export const departmentRouter = new Router();
departmentRouter.get('/:id', getDepartment);
departmentRouter.get('/', getDepartments);
departmentRouter.post('/', validatePost, createDepartment);
departmentRouter.put('/:id', validatePut, updateDepartment);
departmentRouter.delete('/:id', deleteDepartment);

async function getDepartment(req, res, next) {
  req.logger.info(`getDepartment with id: ${req.params.id}`);

  try {
    const department = await paginateModel(
      req.model('Department'),
      { _id: req.params.id },
      { populate: [{ path: 'head', select: '_id firstName lastName' }] },
    );

    if (!department) {
      req.logger.error('Department not found');
      throwError('Department not found', 404);
    }

    req.logger.info('Department found');

    res.send(department);
  } catch (err) {
    next(err);
  }
}

async function getDepartments(req, res, next) {
  req.logger.info('getDepartments');

  const { page, limit } = req;

  try {
    const departments = await paginateModel(
      req.model('Department'),
      {},
      {
        page,
        limit,
        sort: 'name',
        populate: [{ path: 'head', select: '_id firstName lastName' }],
      },
    );

    req.logger.info('Departments found');

    res.send(departments);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function createDepartment(req, res, next) {
  try {
    if (!req.isAdmin()) {
      throwError('Unauthorized role', 403);
    }
    //Format name
    req.body.name = formatString(req.body.name);

    req.logger.info(`createDepartment ${req.body.name}`);

    req.logger.verbose('Validating if department does not exist first.');

    const departmentFound = await req
      .model('Department')
      .findOne({ name: req.body.name });

    if (departmentFound) {
      req.logger.error('Department already exists');
      throwError('Department already exists', 400);
    }

    req.logger.info('Department name available for creation.');

    await validateHeadOfDepartment(req, req.body.head);

    req.logger.verbose(
      'Head of Department is available. Creating new department.',
    );

    const department = await req.model('Department').create(req.body);

    req.logger.info('Department created');

    res.status(201).send(department);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function updateDepartment(req, res, next) {
  try {
    if (!req.params.id) {
      throwError('Parameter id not found', 404);
    }

    if (!req.isAdmin()) {
      throwError('Unauthorized role', 403);
    }

    req.logger.info('updateDepartment with id: ' + req.params.id);
    req.logger.verbose('Validating if department exists.');

    const departmentFound = await req
      .model('Department')
      .findById(req.params.id);

    if (!departmentFound) {
      req.logger.error('Department not found');
      throwError('Department not found.', 404);
    }

    req.logger.verbose('Department found.');

    if (req.body.name) {
      //Format name
      req.body.name = formatString(req.body.name);
    }

    if (req.body.head && req.body.head != departmentFound.head._id) {
      req.logger.verbose(
        'Validating if the head of department does not belong to another department.',
      );
      await validateHeadOfDepartment(req, req.body.head);
    }

    await departmentFound.updateOne(req.body);

    req.logger.info('Department updated');

    res.send({ message: `Department with id ${req.params.id} updated.` });
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function deleteDepartment(req, res, next) {
  try {
    if (!req.params.id) {
      throwError('Parameter id not found', 404);
    }

    if (!req.isAdmin()) {
      throwError('Unauthorized role', 403);
    }

    req.logger.info('deleteDepartment with id: ' + req.params.id);
    req.logger.verbose('Validating if department exists.');

    const departmentFound = await req
      .model('Department')
      .findById(req.params.id);

    if (!departmentFound) {
      req.logger.error('Department not found');
      throwError('Department not found.', 404);
    }

    req.logger.verbose('Department found. Deleting department.');

    await departmentFound.deleteOne();
    res.send({ message: `Department with id ${req.params.id} deleted.` });
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}
