import Joi from 'joi';
import { requiredMsg, validateSchema } from '../../utils/helpers.js';
import dayjs from 'dayjs';
import { LevelEnum } from '../position/schema.js';

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
      const date = dayjs(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true);

      if (!date.isValid()) {
        return helpers.error('any.invalid');
      }

      new Date(date.toISOString());
    })
    .messages(requiredMsg('bornDate')),
  isActive: Joi.boolean().default(true),
  position: Joi.string().length(24).hex(),
  positionLevel: Joi.string()
    .valid(...Object.keys(LevelEnum))
    .required()
    .allow(null),
});

const putUserSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().pattern(pattern),
  role: Joi.string().length(24).hex(),
  supervisedEmployees: Joi.array().items(Joi.string().length(24).hex()),
  phone: Joi.string(),
  bornDate: Joi.string()
    .custom((value, helpers) => {
      const date = dayjs(value, 'DD-MM-YYYY[T]HHmmss', true);

      if (!date.isValid()) {
        return helpers.error('any.invalid');
      }

      return date.toDate();
    })
    .messages(requiredMsg('bornDate')),
  isActive: Joi.boolean().default(true),
  position: Joi.string().length(24).hex(),
  positionLevel: Joi.string()
    .valid(...Object.keys(LevelEnum))
    .allow(null),
});

export const validatePost = (req, res, next) =>
  validateSchema(req, res, next, postUserSchema);
export const validatePut = (req, res, next) =>
  validateSchema(req, res, next, putUserSchema);
