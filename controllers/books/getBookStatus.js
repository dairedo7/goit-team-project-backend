const { User } = require('../../models');
const { bookStatus } = require('../../helpers/constants');

const getCurrent = async (req, res, next) => {
  const { PLAN, READ, DONE } = bookStatus;

  const user = req.user;
  const { books } = await User.findOne({ _id: user._id }).populate('books');

  console.log(books);

  const plannedBooks = [];
  const currentlyReading = [];
  const readBooks = [];

  books.forEach((book) => {
    if (books.status === PLAN) {
      return plannedBooks.push(book);
    }
    if (books.status === READ) {
      return currentlyReading.push(book);
    }
    if (books.status === DONE) {
      return readBooks.push(book);
    }
  });

  // if (books.status === PLAN) {
  //   // const planningToRead = data.books.filter((book) => book.readPages === 0);
  //   res.status(200).json({
  //     status: 'success',
  //     code: 200,
  //     data: {
  //       planningToRead: {
  //         books.status === PLAN
  //       }
  //     },
  //   });
  // }

  // try {
  //   // const { email, name, books, planning } = req.user;

  //   await User.findOne({ _id: user._id })
  //     .populate('books')
  //     .exec(async (err, data) => {
  //       if (err) {
  //         next(err);
  //       }
  //       if (!data) {
  //         return res.status(403).json({
  //           status: 'error',
  //           code: 403,
  //           message: 'You have not added a single book yet!',
  //         });
  //       }

  //       if (book.status === PLAN) {
  //         const planningToRead = data.books.filter((book) => book.readPages === 0);
  //         res.status(200).json({
  //           status: 'success',
  //           code: 200,
  //           data: {
  //             planningToRead,
  //           },
  //         });
  //       }

  //       if (book.status === READ) {
  //         const readingNow = data.books.filter((book) => book.readPages !== 0 && book.readPages !== book.totalPages);
  //         res.status(200).json({
  //           status: 'success',
  //           code: 200,
  //           data: {
  //             readingNow,
  //           },
  //         });
  //       }

  //       if (book.status === DONE) {
  //         const finishedReading = data.books.filter((book) => book.readPages === 0);
  //         res.status(200).json({
  //           status: 'success',
  //           code: 200,
  //           data: {
  //             finishedReading,
  //           },
  //         });
  //       }
  //     });
  // } catch (err) {
  //   next(err);
  // }
  return res.status(201).send(books);
};

// const readingStatus = (bookStatus) => {
//   return res.status(200).json({
//     status: 'success',
//     code: 200,
//     data: {
//       bookStatus,
//     },
//   });
// };

module.exports = getCurrent;
