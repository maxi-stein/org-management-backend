import Joi from 'joi';
import { requiredMsg } from '../../shared/validation.js';

const postPositionSchema = Joi.object().keys({
  title: Joi.string().required().messages(requiredMsg('title')),
  level: Joi.string().allow(null),
  department: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages(requiredMsg('department')),
});
const putPositionSchema = Joi.object().keys({
  title: Joi.string(),
  level: Joi.string(),
  department: Joi.string().length(24).hex(),
});

export const validatePost = (req, res, next) => {
  req.logger.verbose('Validating create position fields');
  const { error } = postPositionSchema.validate(req.body);
  if (error) {
    req.logger.error(error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
export const validatePut = (req, res, next) => {
  req.logger.verbose('Validating put position fields');
  const { error } = putPositionSchema.validate(req.body);
  if (error) {
    req.logger.error(error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
