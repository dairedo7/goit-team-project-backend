const { bookService: services } = require('../../services');
const { httpCode } = require('../../helpers/constants');

const addBook = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { title, author, year, totalPages } = req.body;

  try {
    if (!title || !author || !year || !totalPages) {
      return res.status(httpCode.BAD_REQUEST).json({
        status: 'error',
        code: httpCode.BAD_REQUEST,
        message: 'Invalid request body / Token not provided',
      });
    }

    const book = await services.addBook(userId, {
      user: userId,
      title,
      author,
      year,
      totalPages,
    });

    res.status(httpCode.CREATED).json({
      status: 'success',
      code: httpCode.CREATED,
      message: 'Successful operation',
      data: {
        user: userId,
        _id: book._id,
        title: book.title,
        author: book.author,
        year: book.year,
        totalPages: book.totalPages,
        status: book.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = addBook;