import Joi from 'joi';

import { requiredMsg, validateSchema } from '../../utils/helpers.js';

const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

const postUserSchema = Joi.object({
  firstName: Joi.string().required().messages(requiredMsg('firstName')),
  lastName: Joi.string().required().messages(requiredMsg('lastName')),
  email: Joi.string().email().required().messages(requiredMsg('email')),
  password: Joi.string()
    .pattern(pattern)
    .required()
    .messages(requiredMsg('password')),
  role: Joi.string().length(24).hex().required().messages(requiredMsg('role')),
  supervisedEmployees: Joi.array().items(
    Joi.string().length(24).hex().required(),
  ),
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
  position: Joi.string().length(24).hex(),
});

const putUserSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().pattern(pattern),
  role: Joi.string().length(24).hex(),
  supervisedEmployees: Joi.array().items(
    Joi.string().length(24).hex().required(),
  ),
  phone: Joi.string(),
  bornDate: Joi.string()
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
  position: Joi.string().length(24).hex(),
});

export const validatePost = validateSchema(req, res, next, postUserSchema);
export const validatePut = validateSchema(req, res, next, putUserSchema);
