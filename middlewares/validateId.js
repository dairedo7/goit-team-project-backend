import { isValidObjectId } from 'mongoose';
import NotFound from 'http-errors';

const validateId = (req, res, next) => {
  const { bookId: id } = req.params;
  const isValid = isValidObjectId(id);
  if (!isValid) {
    next(NotFound(`User with id (${id}) does not exist`));
    return;
  }
  next();
};

export { validateId };
