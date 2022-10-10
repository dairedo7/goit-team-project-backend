const { Planning, Book } = require('../../models');
const { DateTime } = require('luxon');
const { bookStatus } = require('../../helpers/constants');

const addReadPages = async (req, res, next) => {
  try {
    const user = req.user;

    let { date, pages } = req.body;
    const { READ, DONE } = bookStatus;

    const training = await Planning.findOne({
      _id: user?.planning,
    }).populate('books');

    if (!training) {
      return res.status(403).json({
        status: 'error',
        code: 403,
        message: 'no active training',
      });
    }

    let book = null;
    // let numberOfPages = 0;
    let diff = 0;
    let currentIteration = 0;

    for (let i = 0; i < training.books.length; i++) {
      currentIteration = i;

      const currentBook = await Book.findOne({ _id: training.books[i] });

      book = currentBook;
      if (currentBook?.totalPages <= currentBook?.readPages) {
        currentBook.status = DONE;
        book = await currentBook.save();
        continue;
      }

      currentBook.readPages += pages;
      book = await currentBook.save();
      training.totalReadPages += pages;
      await training.save();

      if (currentBook.readPages >= currentBook.totalPages) {
        diff = currentBook.readPages - currentBook.totalPages;
        currentBook.readPages = currentBook.totalPages;
        currentBook.status = DONE;
        book = await currentBook.save();
        // res json response object

        while (diff !== 0 && currentIteration < training.books.length) {
          currentIteration++;
          if (currentIteration < training.books.length) {
            const nextBook = await Book.findOne({
              _id: training.books[currentIteration],
            });
            nextBook.readPages += diff;
            // console.log(nextBook.readPages);
            book = await nextBook.save();

            if (nextBook.readPages > nextBook.totalPages) {
              diff = nextBook.readPages - nextBook.totalPages;
              nextBook.readPages = nextBook.totalPages;
              nextBook.status = DONE;
              book = await nextBook.save();
            } else {
              diff = 0;
            }
          }
        }
      }

      // if (training.totalReadPages > training.totalPages) {
      //   training.totalReadPages = training.totalPages;
      // }

      // const currentBook = await Planning.findOne({ _id: training.books[i] });

      // const { _id, title, author, year, totalPages, readPages, resume, rating } = currentBook;

      // const validateBook = {
      //   _id,
      //   title,
      //   author,
      //   year,
      //   totalPages,
      //   readPages,
      //   resume,
      //   rating,
      // };

      // await currentBook.save();

      // book = validateBook;

      break;
    }

    // training.books.forEach(function (item, index) {
    //   if (item._id.equals(book._id)) {
    //     this[index] = book;
    //   }
    // }, training.books);

    const currentTraining = await Planning.findOne({
      _id: user?.planning,
    }).populate('books');

    console.log('TotalReadPages', training.totalReadPages);
    console.log('ReadPages', currentTraining.totalPages);
    if (training.totalReadPages >= currentTraining.totalPages) {
      // await Planning.deleteOne({ _id: user.planning });
      await Planning.findByIdAndRemove(training._id);
      user.planning = [];

      await user.save();

      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Plan finished',
        data: {
          book,
          planning: {
            _id: currentTraining._id,
            start: currentTraining.startDate,
            end: currentTraining.endDate,
            duration: currentTraining.duration,
            pagesReadPerDay: currentTraining.pagesPerDay,
            totalPages: currentTraining.totalPages,
            status: DONE,
            totalReadPages: currentTraining.totalReadPages,
            books: currentTraining.books,
            results: currentTraining.results,
          },
        },
      });
    }

    const currentTime = date.split('-');
    const currentDate = DateTime.local(Number(currentTime[0]), Number(currentTime[1]), Number(currentTime[2]));

    date = currentDate.toFormat('yyyy-LL-dd');
    // pages = numberOfPages;

    training.results.push({ date, pagesCount: pages });

    await training.save();
    const upTraining = await Planning.findOne({
      _id: user?.planning,
    }).populate('books');
    console.log(upTraining);

    if (book.readPages === book.totalPages) {
      return res.status(200).json({
        status: 'success',
        message: 'Book finished',
        code: 200,
        data: {
          book,
          planning: {
            _id: upTraining._id,
            start: upTraining.startDate,
            end: upTraining.endDate,
            duration: upTraining.duration,
            pagesPerDay: upTraining.pagesPerDay,
            totalPages: upTraining.totalPages,
            status: upTraining.books.status,
            totalReadPages: upTraining.totalReadPages,
            books: upTraining.books,
            results: upTraining.results,
          },
        },
      });
    }

    if (training.totalReadPages !== training.totalPages) {
      return res.status(200).json({
        status: 'success',
        message: 'Pages added',
        code: 200,
        data: {
          book,
          planning: {
            _id: upTraining._id,
            start: upTraining.startDate,
            end: upTraining.endDate,
            duration: upTraining.duration,
            pagesPerDay: upTraining.pagesPerDay,
            totalPages: upTraining.totalPages,
            status: upTraining.books.status,
            totalReadPages: upTraining.totalReadPages,
            books: upTraining.books,
            results: upTraining.results,
          },
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = addReadPages;
