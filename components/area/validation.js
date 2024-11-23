import Joi from 'joi';
import { requiredMsg, validateSchema } from '../../utils/helpers.js';

const postAreaSchema = Joi.object().keys({
  name: Joi.string().required().messages(requiredMsg('name')),
  departments: Joi.array()
    .items(Joi.string().length(24).hex().required())
    .min(1)
    .required()
    .messages(requiredMsg('departments')),
});
const putAreaSchema = Joi.object().keys({
  name: Joi.string(),
  departments: Joi.array().items(Joi.string().length(24).hex().required()),
});

export const validatePost = (req, res, next) =>
  validateSchema(req, res, next, postAreaSchema);
export const validatePut = (req, res, next) =>
  validateSchema(req, res, next, putAreaSchema);
