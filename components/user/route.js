import { Router } from 'express';
import bcrypt from 'bcrypt';
import { validatePost } from './validation.js';
import { mongoose } from 'mongoose';

export const userRouter = new Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', validatePost, createUser);
userRouter.put('/:id', updateUser);

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
    const users = await req.model('User').find({ isActive: true });
    req.logger.info('Found ' + users.length + ' users');
    res.send(users);
  } catch (err) {
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

    await checkSupervisedEmployees(req, res);

    const userCreated = await req.model('User').create({
      ...req.body,
      bornDate: toDate(bornDate),
      password: passEncrypted,
    });

    req.logger.info('User created');

    delete userCreated.password;
    res.send(userCreated);
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

  try {
    req.logger.verbose('Finding user to update');
    const userToUpdate = await req.model('User').findById(req.params.id);

    if (!userToUpdate) {
      req.logger.error('User not found');
      return res.status(404).send('User not found');
    }

    req.logger.info('User found');

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
    res.send(userToUpdate);
  } catch (err) {
    next(err);
  }
}

const checkSupervisedEmployees = async (req, res) => {
  //check if all employees in charge exists
  req.logger.verbose('Checking if all employees in charge exist');
  if (req.body.supervisedEmployees?.length > 0) {
    //filter duplicates ids
    req.body.supervisedEmployees = Array.from(
      new Set(req.body.supervisedEmployees),
    );
    //eliminate self id (buisness rule)
    req.body.supervisedEmployees = req.body.supervisedEmployees.filter(
      (id) => id !== req.user._id,
    );

    const supervisedEmployeesIds = req.body.supervisedEmployees.map(
      (id) => new mongoose.Types.ObjectId(id),
    );
    const employees = await req
      .model('User')
      .find({
        _id: { $in: supervisedEmployeesIds },
      })
      .select('_id');

    if (employees.length !== supervisedEmployeesIds.length) {
      console.log('entro error');
      const missingIds = supervisedEmployeesIds.filter(
        (id) => !employees.some((employee) => employee._id.equals(id)),
      );
      throw new Error(
        `The following employees in charge don't exist: ${missingIds}`,
      );
    }
  }
};
