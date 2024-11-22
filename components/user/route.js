import { Router } from 'express';
import bcrypt from 'bcrypt';
import { validatePost, validatePut } from './validation.js';
import { mongoose } from 'mongoose';

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

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized role');
  }

  req.logger.verbose('Finding all users');
  try {
    const users = await req
      .model('User')
      .find({ isActive: true })
      .populate([
        { path: 'role', select: '_id name' },
        { path: 'supervisedEmployees', select: '_id firstName lastName' },
      ]);
    req.logger.info('Found ' + users.length + ' users');
    res.send(users);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function getUserById(req, res, next) {
  req.logger.info('getUserById with id: ' + req.params.id);

  if (!req.params.id) {
    return res.status(404).send('Parameter Id not found');
  }

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized role');
  }

  try {
    req.logger.verbose('Finding user');
    const user = await req
      .model('User')
      .findById(req.params.id)
      .populate('role');

    if (!user) {
      req.logger.error('User not found');
      return res.status(404).send('User not found');
    }

    req.logger.info('User found');
    res.send(user);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function createUser(req, res, next) {
  req.logger.info('createUser: ' + JSON.stringify(req.body));

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized');
  }

  const { email, password, role, bornDate } = req.body;

  try {
    const userExists = await req.model('User').findOne({ email });
    if (userExists) {
      req.logger.error('User already exists');
      return res.status(400).send('User already exists');
    }

    req.logger.verbose('Checking role');

    const roleFound = await req.model('Role').findById(role);
    if (!roleFound) {
      req.logger.error('Role not found');
      return res.status(404).send('Role not found');
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
      bornDate: toDate(bornDate),
      password: passEncrypted,
      supervisedEmployees: supervisedEmployees,
    });

    req.logger.info('User created');

    delete userCreated.password;

    res.status(200).send(userCreated);
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

async function updateUser(req, res, next) {
  req.logger.info('updateUser with id: ' + req.params.id);

  if (!req.params.id) {
    return res.status(404).send('Parameter id not found');
  }

  if (!req.isAdmin() && req.params.id != req.user._id) {
    return res.status(403).send('Unauthorized role');
  }

  // The email and _id can't be updated
  delete req.body.email;
  delete req.body._id;

  try {
    req.logger.verbose('Finding user to update');
    const userToUpdate = await req.model('User').findById(req.params.id);

    if (!userToUpdate) {
      req.logger.error('User not found');
      return res.status(404).send('User not found');
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
        return res.status(400).end();
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
    res.status(200).send(`Position with id ${req.params.id} updated.`);
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
      throw new Error(
        `The following employees in charge don't exist: ${missingIds}`,
      );
    }
  }
};
