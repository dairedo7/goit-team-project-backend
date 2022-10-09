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
    let numberOfPages = 0;
    let diff = 0;
    let currentIteration = 0;

    for (let i = 0; i < training.books.length; i++) {
      currentIteration = i;

      const currentBook = await Book.findOne({ _id: training.books[i] });

      if (currentBook?.totalPages <= currentBook?.readPages) {
        currentBook.status = DONE;
        await currentBook.save();
        continue;
      }

      currentBook.readPages += pages;
      training.totalReadPages += pages;

      if (currentBook.readPages >= currentBook.totalPages) {
        diff = currentBook.readPages - currentBook.totalPages;
        currentBook.readPages = currentBook.totalPages;
        currentBook.status = DONE;
        await currentBook.save();

        while (diff !== 0 && currentIteration < training.books.length) {
          currentIteration++;
          if (currentIteration < training.books.length) {
            const nextBook = await Book.findOne({
              _id: training.books[currentIteration],
            });
            nextBook.readPages += diff;
            console.log(nextBook.readPages);
            await nextBook.save();

            if (nextBook.readPages > nextBook.totalPages) {
              diff = nextBook.readPages - nextBook.totalPages;
              nextBook.readPages = nextBook.totalPages;
              nextBook.status = DONE;
              await nextBook.save();
            } else {
              diff = 0;
            }
          } else {
            continue;
          }
        }
      }

      if (training.totalReadPages > training.totalPages) {
        training.totalReadPages = training.totalPages;
      }

      await training.save();

      const { _id, title, author, year, totalPages, readPages, resume, rating } = currentBook;

      const validateBook = {
        _id,
        title,
        author,
        year,
        totalPages,
        readPages,
        status: READ,
        resume,
        rating,
      };

      await currentBook.save();

      book = validateBook;
      numberOfPages = pages;

      break;
    }

    training.books.forEach(function (item, index) {
      if (item._id.equals(book._id)) {
        this[index] = book;
      }
    }, training.books);

    if (training.totalReadPages === training.totalPages) {
      await Planning.deleteOne({ _id: user.planning });
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
            _id: training._id,
            start: training.startDate,
            end: training.endDate,
            duration: training.duration,
            pagesReadPerDay: training.pagesPerDay,
            totalPages: training.totalPages,
            status: DONE,
            totalReadPages: training.totalReadPages,
            books: training.books,
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
    const upTraining = await Planning.findOne({
      _id: user?.planning,
    }).populate('books');

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
  } catch (err) {
    next(err);
  }
};

module.exports = addReadPages;
