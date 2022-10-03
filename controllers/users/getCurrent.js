const { User } = require('../../models');

const getCurrent = async (req, res, next) => {
  const user = req.user;

  try {
    const { email, name, books, planning } = req.user;

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

        const planningToRead = data.books.filter((book) => book.readPages === 0);
        const readingNow = data.books.filter((book) => book.readPages !== 0 && book.readPages !== book.totalPages);
        const finishedReading = data.books.filter((book) => book.readPages === book.totalPages);

        return res.status(200).json({
          status: 'success',
          code: 200,
          data: {
            email,
            name,
            books,
            planning,
            planningToRead,
            readingNow,
            finishedReading,
          },
        });
      });
  } catch (err) {
    next(err);
  }
};
module.exports = getCurrent;
