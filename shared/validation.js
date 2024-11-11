export const requiredMsg = (label) => ({
  'any.required': `${label} is required`,
  'string.pattern.base':
    label === 'password'
      ? 'Password must have one lowercase, one uppercase, one number and at least 8 characters.'
      : `${label} is invalid`,
});
