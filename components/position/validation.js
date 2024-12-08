import Joi from 'joi';
import { requiredMsg, validateSchema } from '../../utils/helpers.js';

const postPositionSchema = Joi.object().keys({
  title: Joi.string().required().messages(requiredMsg('title')),
  level: Joi.string().allow(null),
});
const putPositionSchema = Joi.object().keys({
  title: Joi.string(),
  level: Joi.string().allow(null),
});

export const validatePost = (req, res, next) =>
  validateSchema(req, res, next, postPositionSchema);
export const validatePut = (req, res, next) =>
  validateSchema(req, res, next, putPositionSchema);
