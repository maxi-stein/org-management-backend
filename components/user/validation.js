import Joi from 'joi';

import { requiredMsg } from '../../shared/validation.js';

const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

const schema = Joi.object({
  firstName: Joi.string().required().messages(requiredMsg('firstName')),
  lastName: Joi.string().required().messages(requiredMsg('lastName')),
  email: Joi.string().email().required().messages(requiredMsg('email')),
  password: Joi.string()
    .pattern(pattern)
    .required()
    .messages(requiredMsg('password')),
  role: Joi.object()
    .keys({
      _id: Joi.string().required().messages(requiredMsg('_id')),
      name: Joi.string().required().messages(requiredMsg('name')),
    })
    .required()
    .messages(requiredMsg('role')),
  supervisor: Joi.string(),
  phone: Joi.string().required().messages(requiredMsg('phone')),
  bornDate: Joi.date().required().messages(requiredMsg('bornDate')),
  isActive: Joi.boolean().default(true),
  position: Joi.string(),
});

export const validatePost = (req, res, next) => {
  req.logger.verbose('Validating user fields');
  const { error } = schema.validate(req.body);
  if (error) {
    req.logger.error(error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
