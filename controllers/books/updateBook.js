const { bookService: services } = require('../../services');
const { httpCode } = require('../../helpers/constants');

const updateBook = async (req, res, next) => {
  const { bookId: id } = req.params;
  const { rating, resume } = req.body;

  try {
    const book = await services.updateBook(id, rating, resume);

    if (book.readPages !== book.totalPages && book.status !== 'done') {
      return res.status(httpCode.FORBIDDEN).json({
        status: 'error',
        code: httpCode.FORBIDDEN,
        message: 'The book has not been read yet',
      });
    }

    if (!book || !id) {
      return res.status(httpCode.NOT_FOUND).json({
        status: 'error',
        code: httpCode.NOT_FOUND,
        message: 'Not Found',
      });
    }

    res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      message: 'Successful operation',

      data: {
        book,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateBook;