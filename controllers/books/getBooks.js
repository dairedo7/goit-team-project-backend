const { bookService: services } = require('../../services');
const { httpCode } = require('../../helpers/constants');

const getBooks = async (req, res, next) => {
  const { _id: userId } = req.user;

  try {
    const books = await services.getBooks(userId);

    if (!books) {
      return res.status(httpCode.NOT_FOUND).json({
        status: 'fail',
        code: httpCode.NOT_FOUND,
        message: 'Not found',
      });
    }

    res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      message: 'Successful operation',
      data: {
        books,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getBooks;