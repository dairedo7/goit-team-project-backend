const { Planning, Book } = require('../../models');
const { DateTime } = require('luxon');
const { bookStatus } = require('../../helpers/constants');
// const { array } = require('joi');

const addReadPages = async (req, res, next) => {
  try {
    const user = req.user;
    let { date, pages } = req.body;
    const { DONE } = bookStatus;

    const training = await Planning.findOne({
      _id: user?.planning,
    }).populate('booksToRead');

    if (!training) {
      return res.status(403).json({
        status: 'error',
        code: 403,
        message: 'no active training',
      });
    }

    let book = null;
    let numberOfPages = 0;

    for (let i = 0; i < training.booksToRead.length; i++) {
      const arrayBook = await Book.findOne({ _id: training.booksToRead[i] });

      if (arrayBook?.totalPages === arrayBook?.readPages) {
        arrayBook.status = DONE;
        continue;
      }

      arrayBook.readPages += pages;
      arrayBook.readPages += training.rest;
      training.totalReadPages += pages;

      training.rest = 0;

      if (arrayBook.readPages >= arrayBook.totalPages) {
        training.rest = arrayBook.readPages - arrayBook.totalPages;
        // for (let n = 0; n < arrayBook.length; n++) {
        //   arrayBook[n].readPages += training.rest;
        // }
        arrayBook.readPages = arrayBook.totalPages;
      }

      if (training.totalReadPages > training.totalPages) {
        training.totalReadPages = training.totalPages;
      }

      await training.save();

      const { _id, title, author, year, totalPages, readPages, resume, rating } = arrayBook;
      const validateBook = {
        _id,
        title,
        author,
        year,
        totalPages,
        readPages,
        resume,
        rating,
      };

      await arrayBook.save();

      book = validateBook;
      numberOfPages = pages;

      break;
    }

    training.booksToRead.forEach(function (item, index) {
      if (item._id.equals(book._id)) {
        this[index] = book;
      }
    }, training.booksToRead);

    if (training.totalReadPages === training.totalPages) {
      await Planning.deleteOne({ _id: user.training });

      user.training = null;

      await user.save();

      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Congratz! You have managed to read all the books',
        data: {
          book,
          planning: {
            _id: training._id,
            start: training.startDate,
            end: training.endDate,
            duration: training.duration,
            pagesReadPerDay: training.pagesPerDay,
            totalPages: training.totalPages,
            totalReadPages: training.totalReadPages,
            booksToRead: training.booksToRead,
            results: training.results,
          },
        },
      });
    }

    const currentTime = date.split('-');
    const currentDate = DateTime.local(Number(currentTime[0]), Number(currentTime[1]), Number(currentTime[2]));

    date = currentDate.toFormat('yyyy-LL-dd');
    pages = numberOfPages;

    training.results.push({ date, pagesCount: pages });

    await training.save();

    return res.status(200).json({
      status: 'success',
      code: 200,
      data: {
        book,
        planning: {
          _id: training._id,
          start: training.startDate,
          end: training.endDate,
          duration: training.duration,
          pagesPerDay: training.pagesPerDay,
          totalPages: training.totalPages,
          totalReadPages: training.totalReadPages,
          booksToRead: training.booksToRead,
          results: training.results,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// const addReadPages = async (req, res) => {
//   const user = req.user;
//   const { pages } = req.body;
//   const { READ, DONE } = bookStatus;

//   const book = await Planning.findOne({ _id: user.planning });
//   const booksToRead = book.booksToRead;
//   console.log(booksToRead);

//   // if (book.totalPages < book.readPages + pages) {
//   //   return res.status(403).send({ message: `Maximum allowed pages is: ${book.totalPages - book.readPages}` });
//   // }

//   book.readPages += pages;

//   if (book.readPages > 0) {
//     book.status = READ;
//   }

//   if (book.totalPages === book.readPages) {
//     book.status = DONE;
//     return res.status(200).json({
//       status: 'success',
//       code: 200,
//       message: 'The book has been read',
//     });
//   }

//   console.log(book.readPages);
//   await book.save();

//   const planning = await Planning.findOne({ _id: user?.planning }).populate('books');
//   const books = planning.books;

//   if (!books) {
//     return res.status(403).send({ message: 'You must start a planning first' });
//   }

//   if (!book) {
//     return res.status(403).send({
//       message: 'You have already read all the books from this planning',
//     });
//   }
//   const date = DateTime.now().setZone('Europe/Kiev').toObject();

//   let minute = date.minute?.toString();

//   if (date.minute.toString().length === 1) {
//     minute = '0' + date.minute;
//   }
//   const time = `${date.year}-${date.month}-${date.day} ${date.hour}:${minute}`;
//   planning.results.push({ time, pagesCount: pages });
//   await planning.save();

//   return res.status(200).send({ book, planning });
// };

module.exports = addReadPages;
