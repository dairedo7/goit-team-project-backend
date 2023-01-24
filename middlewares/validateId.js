const { isValidObjectId } = require('mongoose');
const { NotFound } = require('http-errors');

const validateId = (req, res, next) => {
  const { bookId } = req.params;
  const isValid = isValidObjectId(bookId);
  if (!isValid) {
    next(NotFound(`Book with id (${bookId}) does not exist`));
    return;
  }
  next();
};

module.exports = validateId;
