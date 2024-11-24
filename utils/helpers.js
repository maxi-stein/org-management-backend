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

export const validateDepartment = async (req, departmentId) => {
  req.logger.verbose(`Validating if the department ${departmentId} exists.`);

  const departmentFound = await req.model('Department').findById(departmentId);

  if (!departmentFound) {
    req.logger.error('Department not found');
    throw new Error(`Department with id ${departmentId} not found.`);
  }

  req.logger.info('Department found.');
};

export const validateHeadOfDepartment = async (req, headId) => {
  req.logger.verbose('Validating if the head exists');
  const foundHead = await req.model('User').findById(req.body.head);

  if (!foundHead) {
    req.logger.error('Head of Department not found');
    throw new Error('Head of Department not found.');
  }

  req.logger.info('Head of Department found.');

  req.logger.verbose(
    `Validating if the head ${headId} does not belong to another department.`,
  );

  const department = await req.model('Department').findOne({ head: headId });
  if (department) {
    throw new Error(
      `Head with id ${headId} already belongs to another department.`,
    );
  }

  req.logger.info('Head does not belong to another department.');
};

export const paginateModel = async (Model, query = {}, options = {}) => {
  const { offset = 1, limit = 10, populate = [], sort = '_id' } = options;

  const pageNumber = parseInt(offset);
  const pageSize = parseInt(limit);
  const skip = (pageNumber - 1) * pageSize;

  const data = await Model.find(query) // query filters
    .skip(skip)
    .limit(pageSize)
    .sort(sort)
    .populate(populate)
    .exec();

  // Contamos el total de documentos sin la paginación
  const total = await Model.countDocuments(query);

  return {
    data,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};
