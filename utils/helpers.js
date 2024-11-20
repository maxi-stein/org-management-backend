export const formatString = (str) => {
  const newString = str.toLowerCase();
  return newString.charAt(0).toUpperCase() + newString.slice(1);
};

export const requiredMsg = (label) => ({
  'any.required': `${label} is required`,
  'string.pattern.base':
    label === 'password'
      ? 'Password must have one lowercase, one uppercase, one number and at least 8 characters.'
      : `${label} is invalid`,
});

export const validateSchema = (req, res, next, schema) => {
  req.logger.verbose('Validating put position fields');
  const { error } = schema.validate(req.body);
  if (error) {
    req.logger.error(error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const validateDepartment = async (req, res, next, departmentId) => {
  req.logger.verbose(`Validating if the department ${departmentId} exists.`);

  try {
    const departmentFound = await req
      .model('Department')
      .findById(departmentId);

    if (!departmentFound) {
      req.logger.error('Department not found');
      return res
        .status(404)
        .send(`Department with id ${departmentId} not found.`);
    }

    req.logger.info('Department found.');
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
};

export const validateHeadOfDepartment = async (req, res, next, headId) => {
  req.logger.verbose(
    `Validating if the head ${headId} does not belong to another department.`,
  );

  try {
    const department = await req.model('Department').findOne({ head: headId });

    if (department) {
      req.logger.error('Head already belongs to another department');
      return res
        .status(400)
        .send(`Head with id ${headId} already belongs to another department.`);
    }

    req.logger.info('Head does not belong to another department.');
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
};
