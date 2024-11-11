import Joi from 'joi';
import { requiredMsg } from '../../shared/validation';

const schema = Joi.object({
  name: Joi.string().required().messages(requiredMsg('name')),
});

export const validatePost = (req, res, next) => {
  req.logger.verbose('Validating role fields');
  const { error } = schema.validate(req.body);
  if (error) {
    req.logger.error(error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
