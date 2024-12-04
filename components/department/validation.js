import Joi from 'joi';
import { requiredMsg, validateSchema } from '../../utils/helpers.js';

export const postDepartmentSchema = Joi.object({
  name: Joi.string().required().messages(requiredMsg('name')),
  description: Joi.string()
    .min(10)
    .required()
    .messages(requiredMsg('Description')),
  head: Joi.string().length(24).hex().allow(null),
});

export const putDepartmentSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().min(10),
  head: Joi.string().length(24).hex().allow(null),
});

export const validatePost = (req, res, next) =>
  validateSchema(req, res, next, postDepartmentSchema);
export const validatePut = (req, res, next) =>
  validateSchema(req, res, next, putDepartmentSchema);
