const httpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const bookStatus = {
  PLAN: 'plan',
  READ: 'read',
  DONE: 'done',
};

module.exports = {
  httpCode,
  bookStatus,
};