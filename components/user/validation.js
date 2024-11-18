import Joi from 'joi';

import { requiredMsg } from '../../shared/validation.js';

const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

const userSchemaValidation = Joi.object({
  firstName: Joi.string().required().messages(requiredMsg('firstName')),
  lastName: Joi.string().required().messages(requiredMsg('lastName')),
  email: Joi.string().email().required().messages(requiredMsg('email')),
  password: Joi.string()
    .pattern(pattern)
    .required()
    .messages(requiredMsg('password')),
  role: Joi.string().length(24).hex().required().messages(requiredMsg('role')),
  supervisedEmployees: Joi.array()
    .items(Joi.string().length(24).hex().required())
    .default([]),
  phone: Joi.string().required().messages(requiredMsg('phone')),
  bornDate: Joi.string()
    .required()
    .custom((value, helpers) => {
      const [day, month, year] = value.split('/');
      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() !== parseInt(year, 10) ||
        date.getMonth() !== parseInt(month, 10) - 1 ||
        date.getDate() !== parseInt(day, 10)
      ) {
        return helpers.error('any.invalid');
      }
      return date;
    })
    .messages(requiredMsg('bornDate')),
  isActive: Joi.boolean().default(true),
  position: Joi.string(),
});

export const validatePost = (req, res, next) => {
  req.logger.verbose('Validating create user fields');
  const { error } = userSchemaValidation.validate(req.body);
  if (error) {
    req.logger.error(error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
