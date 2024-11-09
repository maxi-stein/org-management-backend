import { Router } from 'express';
import bcrypt from 'bcrypt';

export const userRouter = new Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);
userRouter.put('/:id', updateUser);

function toDate(input) {
  const [day, month, year] = input.split('/');
  return new Date(year, month, day);
}

async function getAllUsers(req, res, next) {
  req.logger.info('getAllUsers');

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized');
  }

  try {
    const users = await req.model('User').find({ isActive: true });
    res.send(users);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  req.logger.info('getUserById with id: ', req.params.id);

  if (!req.params.id) {
    return res.status(404).send('Parameter Id not found');
  }

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized');
  }

  try {
    const user = await req
      .model('User')
      .findById(req.params.id)
      .populate('role');

    if (!user) {
      req.logger.error('User not found');
      return res.status(404).send('User not found');
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  req.logger.info('createUser: ', req.body);

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized');
  }

  const user = req.body;

  try {
    const role = await req.model('Role').findOne({ name: user.role });
    if (!role) {
      req.logger.error('Role not found');
      return res.status(404).send('Role not found');
    }

    const passEncrypted = await bcrypt.hash(user.password, 10);

    const userCreated = await req.model('User').create({
      ...user,
      bornDate: toDate(user.bornDate),
      password: passEncrypted,
      role: role._id,
    });

    res.send(userCreated);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  req.logger.info('updateUser with id: ', req.params.id);

  if (!req.params.id) {
    return res.status(404).send('Parameter id not found');
  }

  if (!req.isAdmin() && req.params.id != req.user._id) {
    return res.status(403).send('Unauthorized');
  }

  // The email can't be updated
  delete req.body.email;

  try {
    const userToUpdate = await req.model('User').findById(req.params.id);

    if (!userToUpdate) {
      req.logger.error('User not found');
      return res.status(404).send('User not found');
    }

    if (req.body.role) {
      const newRole = await req.model('Role').findById(req.body.role);

      if (!newRole) {
        req.logger.verbose('New role not found. Sending 400 to client');
        return res.status(400).end();
      }
      req.body.role = newRole._id;
    }

    if (req.body.password) {
      const passEncrypted = await bcrypt.hash(req.body.password, 10);
      req.body.password = passEncrypted;
    }

    await userToUpdate.updateOne(req.body);

    res.send(userToUpdate);
  } catch (err) {
    next(err);
  }
}
