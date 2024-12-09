import { Router } from 'express';
import bcrypt from 'bcrypt';
import { validatePost, validatePut } from './validation.js';
import { mongoose } from 'mongoose';
import { paginateModel, throwError } from '../../utils/helpers.js';

export const userRouter = new Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', validatePost, createUser);
userRouter.put('/:id', validatePut, updateUser);

function toDate(input) {
  const [day, month, year] = input.split('/');
  return new Date(year, month, day);
}

async function getAllUsers(req, res, next) {
  req.logger.info('getAllUsers');

  try {
    if (!req.isAdmin()) {
      throwError('Unauthorized role', 403);
    }

    const { page, limit } = req;

    req.logger.verbose('Finding all users');
    const users = await paginateModel(
      req.model('User'),
      {},
      {
        page,
        limit,
        sort: 'lastName',
        populate: [
          { path: 'role', select: '_id name' },
          { path: 'supervisedEmployees', select: '_id firstName lastName' },
          { path: 'position', select: '_id title level' },
        ],
      },
    );

    req.logger.info('Found ' + users.data.length + ' users');
    res.send(users);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function getUserById(req, res, next) {
  req.logger.info('getUserById with id: ' + req.params.id);

  try {
    if (!req.params.id) {
      throwError('Parameter Id not found', 404);
    }

    if (!req.isAdmin()) {
      throwError('Unauthorized role', 403);
    }

    req.logger.verbose('Finding user');
    const user = await paginateModel(
      req.model('User'),
      { _id: req.params.id },
      {
        populate: [
          { path: 'role', select: '_id name' },
          { path: 'supervisedEmployees', select: '_id firstName lastName' },
          { path: 'position', select: '_id title level' },
        ],
      },
    );

    if (!user.data) {
      req.logger.error('User not found');
      throwError('User not found', 404);
    }

    user.data[0].supervisedEmployees = await populateSupervisedEmployees(
      req,
      user.data[0].supervisedEmployees,
    );

    req.logger.info('User found');
    res.send(user);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function createUser(req, res, next) {
  req.logger.info('createUser: ' + JSON.stringify(req.body));

  try {
    if (!req.isAdmin()) {
      throwError('Unauthorized', 403);
    }

    const { email, password, role, bornDate } = req.body;

    const userExists = await paginateModel(req.model('User'), { email });
    if (userExists.data.length > 0) {
      req.logger.error('User already exists');
      throwError('User already exists', 400);
    }

    req.logger.verbose('Checking role');

    const roleFound = await req.model('Role').findById(role);
    if (!roleFound) {
      req.logger.error('Role not found');
      throwError('Role not found', 404);
    }

    req.logger.info('Role found');

    const passEncrypted = await bcrypt.hash(password, 10);

    const supervisedEmployees = filterSupervisedEmployees(
      req,
      req.body.supervisedEmployees,
    );

    await checkSupervisedEmployees(req, supervisedEmployees);

    const userCreated = await req.model('User').create({
      ...req.body,
      bornDate: new Date(bornDate),
      password: passEncrypted,
      supervisedEmployees: supervisedEmployees,
    });

    req.logger.info('User created');

    //does not work
    //delete userCreated.password;

    const userWithoutPassword = await req
      .model('User')
      .findById(userCreated._id);

    res.send(userWithoutPassword);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function updateUser(req, res, next) {
  req.logger.info('updateUser with id: ' + req.params.id);

  try {
    if (!req.params.id) {
      throwError('Parameter id not found', 404);
    }

    if (!req.isAdmin() && req.params.id != req.user._id) {
      throwError('Unauthorized role', 403);
    }

    // The email and _id can't be updated
    delete req.body.email;
    delete req.body._id;

    req.logger.verbose('Finding user to update');
    const userToUpdate = await req.model('User').findById(req.params.id);

    if (!userToUpdate) {
      req.logger.error('User not found');
      throwError('User not found', 404);
    }

    const supervisedEmployees = filterSupervisedEmployees(
      req,
      req.body.supervisedEmployees,
    );

    if (supervisedEmployees.length > 0) {
      await checkSupervisedEmployees(req, supervisedEmployees);
      req.body.supervisedEmployees = supervisedEmployees;
    }

    if (req.body.role) {
      req.logger.verbose('Checking role');
      const newRole = await req.model('Role').findById(req.body.role);

      if (!newRole) {
        req.logger.verbose('New role not found. Sending 400 to client');
        throwError('New role not found', 400);
      }

      req.logger.info('Role found');
      req.body.role = newRole._id;
    }

    if (req.body.password) {
      const passEncrypted = await bcrypt.hash(req.body.password, 10);
      req.body.password = passEncrypted;
    }

    await userToUpdate.updateOne(req.body);
    req.logger.info('User updated');

    delete userToUpdate.password;
    res.send({ message: `Position with id ${req.params.id} updated.` });
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

const filterSupervisedEmployees = (req, supervisedEmployees) => {
  //filter duplicates ids
  let filteredIds = Array.from(new Set(supervisedEmployees));

  //eliminate self id (buisness rule)
  filteredIds = filteredIds.filter((id) => id !== req.user._id);

  if (filteredIds.length === 0) {
    return [];
  }

  //casting all ids to objectId
  return filteredIds.map((id) => new mongoose.Types.ObjectId(id));
};

const checkSupervisedEmployees = async (req, supervisedEmployees) => {
  if (supervisedEmployees.length > 0) {
    req.logger.verbose('Checking if all employees in charge exist');

    //Getting all the employees
    const employees = await req
      .model('User')
      .find({
        _id: { $in: supervisedEmployees },
      })
      .select('_id');

    //Checking if all the employees exist
    if (employees.length !== supervisedEmployees.length) {
      const missingIds = supervisedEmployees.filter(
        (id) => !employees.some((employee) => employee._id.equals(id)),
      );
      throwError(
        `The following employees in charge don't exist: ${missingIds}`,
        400,
      );
    }
  }
};

async function populateSupervisedEmployees(req, supervisedEmployees) {
  // If there are no supervised employees, return the empty array
  if (!supervisedEmployees || supervisedEmployees.length === 0) {
    return [];
  }

  // Get the supervised employees
  const employees = await req
    .model('User')
    .find({ _id: { $in: supervisedEmployees } })
    .populate([
      { path: 'role', select: '_id name' },
      { path: 'position', select: '_id title level' },
      { path: 'supervisedEmployees', select: '_id firstName lastName' },
    ]);
  // Populate the supervised employees recursively
  await Promise.all(
    employees.map(async (employee) => {
      if (
        employee.supervisedEmployees &&
        employee.supervisedEmployees.length > 0
      ) {
        employee.supervisedEmployees = await populateSupervisedEmployees(
          req,
          employee.supervisedEmployees,
        );
      }
    }),
  );

  return employees;
}
