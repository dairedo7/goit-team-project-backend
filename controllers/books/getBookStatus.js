const { User } = require('../../models');
const { bookStatus } = require('../../helpers/constants');

const getCurrent = async (req, res, next) => {
  const { PLAN, READ, DONE } = bookStatus;

  const user = req.user;
  const { status } = req.params;

  const { books } = await User.findOne({ _id: user._id }).populate('books');

  const result = [];

  if (!books) {
    return res.status(200).json({
      status: 'error',
      code: 200,
      data: {
        books: [],
      },
    });
  }

  books.filter((book) => {
    if (status === PLAN && book.status === PLAN) {
      result.push(book);
    }
    if (status === READ && book.status === READ) {
      result.push(book);
    }
    if (status === DONE && book.status === DONE) {
      result.push(book);
    }

    return result;
  });

  res.json({
    status: 'success',
    code: 200,
    data: {
      result,
    },
  });
};

module.exports = getCurrent;
