import { Router } from 'express';
import { formatString, validateHeadOfDepartment } from '../../utils/helpers.js';
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
    const department = await req.model('Department').findById(req.params.id);

    if (!department) {
      req.logger.error('Department not found');
      return res.status(404).send('Department not found.');
    }

    req.logger.info('Department found');

    res.send(department);
  } catch (err) {
    next(err);
  }
}

async function getDepartments(req, res, next) {
  try {
    req.logger.info('getDepartments');

    const departments = await req
      .model('Department')
      .find()
      .populate('head', '_id firstName lastName');

    req.logger.info('Departments found');

    res.send(departments);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function createDepartment(req, res, next) {
  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized role');
  }
  //Format name
  req.body.name = formatString(req.body.name);

  req.logger.info(`createDepartment ${req.body.name}`);

  try {
    req.logger.verbose('Validating if department does not exist first.');

    const departmentFound = await req
      .model('Department')
      .findOne({ name: req.body.name });

    if (departmentFound) {
      req.logger.error('Department already exists');
      return res.status(400).send('Department already exists');
    }

    req.logger.info('Department name available for creation.');

    validateHeadOfDepartment(req, res, next, req.body.head);

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
  if (!req.params.id) {
    return res.status(404).send('Parameter id not found');
  }

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized role');
  }

  req.logger.info('updateDepartment with id: ' + req.params.id);
  req.logger.verbose('Validating if department exists.');

  try {
    const departmentFound = await req
      .model('Department')
      .findById(req.params.id);

    if (!departmentFound) {
      req.logger.error('Department not found');
      return res.status(404).send('Department not found.');
    }

    req.logger.verbose('Department found.');

    if (req.body.name) {
      //Format name
      req.body.name = formatString(req.body.name);
    }

    if (req.body.head) {
      req.logger.verbose(
        'Validating if the head of department does not belong to another department.',
      );
      await validateHeadOfDepartment(req, res, next, req.body.head);
    }

    await departmentFound.updateOne(req.body);

    req.logger.info('Department updated');

    res.status(200).send(`Department with id ${req.params.id} updated.`);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function deleteDepartment(req, res, next) {
  if (!req.params.id) {
    return res.status(404).send('Parameter id not found');
  }

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized role');
  }

  req.logger.info('deleteDepartment with id: ' + req.params.id);
  req.logger.verbose('Validating if department exists.');

  try {
    const departmentFound = await req
      .model('Department')
      .findById(req.params.id);

    if (!departmentFound) {
      req.logger.error('Department not found');
      return res.status(404).send('Department not found.');
    }

    req.logger.verbose('Department found. Deleting department.');

    await departmentFound.deleteOne();
    res.status(200).send(`Department with id ${req.params.id} deleted.`);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}
