const { User } = require('../../models/book');
const { bookStatus } = require('../../helpers/constants');

const getCurrent = async (req, res, next) => {
  const user = req.user;

  const { PLAN, READ, DONE } = bookStatus;

  console.log(user.books);

  try {
    // const { email, name, books, planning } = req.user;

    await User.findOne({ _id: user._id })
      .populate('books')
      .exec(async (err, data) => {
        if (err) {
          next(err);
        }
        if (!data) {
          return res.status(403).json({
            status: 'error',
            code: 403,
            message: 'You have not added a single book yet!',
          });
        }

        if (user.books === PLAN) {
          const planningToRead = data.books.filter((book) => book.readPages === 0);
          return res.status(200).json({
            status: 'success',
            code: 200,
            data: {
              planningToRead,
            },
          });
        }

        if (user.books === READ) {
          const readingNow = data.books.filter((book) => book.readPages !== 0 && book.readPages !== book.totalPages);
          return res.status(200).json({
            status: 'success',
            code: 200,
            data: {
              readingNow,
            },
          });
        }

        if (user.books === DONE) {
          const planningToRead = data.books.filter((book) => book.readPages === 0);
          return res.status(200).json({
            status: 'success',
            code: 200,
            data: {
              planningToRead,
            },
          });
        }
      });
  } catch (err) {
    next(err);
  }
};

module.exports = getCurrent;
