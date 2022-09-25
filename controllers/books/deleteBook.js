const { httpCode } = require('../../helpers/constants');
const { bookService: services } = require('../../services');

const deleteBook = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { bookId } = req.params;

  try {
    const book = await services.getOne(bookId);

    if (!book) {
      return res.status(httpCode.BAD_REQUEST).json({
        status: 'fail',
        code: httpCode.BAD_REQUEST,
        message: 'Invalid request body / Token not provided',
      });
    }

    await services.deleteBook(userId, bookId);

    res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      message: 'Successful operation',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteBook;