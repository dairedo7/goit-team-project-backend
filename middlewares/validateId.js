const { isValidObjectId } = require("mongoose");
const { NotFound } = require("http-errors");

const validateId = (req, res, next) => {
  const { id } = req.params; // or _id
  const isValid = isValidObjectId(id); // or _id
  if (!isValid) {
    next(NotFound(`User with id (${id}) does not exist`));
    return;
  }
  next();
};

module.exports = validateId;
