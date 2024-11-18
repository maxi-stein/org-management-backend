import Joi from 'joi';
import { requiredMsg, validateSchema } from '../../utils/helpers.js';

const postAreaSchema = Joi.object().keys({
  name: Joi.string().required().messages(requiredMsg('name')),
  departments: Joi.array().items(Joi.string().length(24).hex().required()),
});
const putAreaSchema = Joi.object().keys({
  name: Joi.string(),
  departments: Joi.array().items(Joi.string().length(24).hex().required()),
});

export const validatePost = validateSchema(req, res, next, postAreaSchema);
export const validatePut = validateSchema(req, res, next, putAreaSchema);
