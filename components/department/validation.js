import Joi from 'joi';
import { requiredMsg, validateSchema } from '../../utils/helpers.js';

export const postDepartmentSchema = Joi.object({
  name: Joi.string().required().messages(requiredMsg('name')),
  description: Joi.string()
    .min(10)
    .max(200)
    .required()
    .messages(requiredMsg('Description')),
  head: Joi.string().length(24).hex().required().messages(requiredMsg('head')),
});

export const putDepartmentSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().min(10).max(200),
  head: Joi.string().length(24).hex(),
});

export const validatePost = (req, res, next) =>
  validateSchema(req, res, next, postDepartmentSchema);
export const validatePut = (req, res, next) =>
  validateSchema(req, res, next, putDepartmentSchema);
