const { isValidObjectId } = require("mongoose");
const { NotFound } = require("http-errors");

const validateId = (req, res, next) => {
  const { id } = req.params;
  const isValid = isValidObjectId(id);
  if (!isValid) {
    next(NotFound(`User with id (${id}) does not exist`));
    return;
  }
  next();
};

module.exports = validateId;
