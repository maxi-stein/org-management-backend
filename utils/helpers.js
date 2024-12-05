export const formatStringFirstLetterUppercase = (str) => {
  if (str) {
    const newString = str.toLowerCase();
    return newString.charAt(0).toUpperCase() + newString.slice(1);
  }
  return '';
};

export const formatStringCamelCase = (str) => {
  if (str) {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  return '';
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
    throwError(error.details[0].message, 400);
  }
  next();
};

export const validateDepartment = async (req, departmentId) => {
  req.logger.verbose(`Validating if the department ${departmentId} exists.`);

  const departmentFound = await req.model('Department').findById(departmentId);

  if (!departmentFound) {
    req.logger.error('Department not found');
    throwError(`Department with id ${departmentId} not found.`, 404);
  }

  req.logger.info('Department found.');
};

export const validateHeadOfDepartment = async (req, headId) => {
  req.logger.verbose('Validating if the head exists');
  const foundHead = await req.model('User').findById(req.body.head);

  if (!foundHead) {
    req.logger.error('Head of Department not found');
    throwError('Head of Department not found', 404);
  }

  req.logger.info('Head of Department found.');

  req.logger.verbose(
    `Validating if the head ${headId} does not belong to another department.`,
  );

  const department = await req.model('Department').findOne({ head: headId });
  if (department) {
    throwError(
      `Head with id ${headId} already belongs to another department.`,
      400,
    );
  }

  req.logger.info('Head does not belong to another department.');
};

export const paginateModel = async (Model, query = {}, options = {}) => {
  const { offset = 1, limit = 100, populate = [], sort = '_id' } = options;

  const pageNumber = parseInt(offset);
  const pageSize = parseInt(limit);
  const skip = (pageNumber - 1) * pageSize;

  const data = await Model.find(query) // query filters
    .skip(skip)
    .limit(pageSize)
    .sort(sort)
    .populate(populate)
    .exec();

  // Total number of documents
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

export const throwError = (message, status) => {
  const error = new Error(message);
  error.statusCode = status;
  throw error;
};
