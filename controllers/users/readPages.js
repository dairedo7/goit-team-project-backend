const { Planning, Book } = require('../../models');
const { DateTime } = require('luxon');
const { bookStatus } = require('../../helpers/constants');
// const { array } = require('joi');

const addReadPages = async (req, res, next) => {
  try {
    const user = req.user;
    let { date, pages } = req.body;
    const { READ, DONE } = bookStatus;

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
    let diff = 0;
    let currentIteration = 0;

    for (let i = 0; i < training.booksToRead.length; i++) {
      currentIteration = i;
      const arrayBook = await Book.findOne({ _id: training.booksToRead[i] });
      // console.log(arrayBook);
      if (arrayBook?.totalPages === arrayBook?.readPages) {
        arrayBook.status = DONE;
        arrayBook.save();
        continue;
      }

      arrayBook.readPages += pages;
      // arrayBook.readPages += training.rest;

      training.totalReadPages += pages;

      if (arrayBook.readPages >= arrayBook.totalPages) {
        console.log(arrayBook.readPages);
        diff = arrayBook.readPages - arrayBook.totalPages;
        console.log(diff);
        arrayBook.readPages = arrayBook.totalPages;
        arrayBook.status = DONE;
        arrayBook.save();
        while (diff !== 0) {
          currentIteration++;
          console.log(currentIteration);
          const nextBook = await Book.findOne({
            _id: training.booksToRead[currentIteration],
          });
          console.log(nextBook);
          nextBook.readPages += diff;
          if (nextBook.readPages > nextBook.totalPages) {
            diff = nextBook.readPages - nextBook.totalPages;
            nextBook.readPages = nextBook.totalPages;
            nextBook.status = DONE;
            await nextBook.save();
          } else {
            diff = 0;
          }
        }
      }

      // if (arrayBook.readPages <= arrayBook.totalPages) {

      // }

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
        status: READ,
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
      await Planning.deleteOne({ _id: user.planning });

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
            status: DONE,
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
          status: training.booksToRead.status,
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

module.exports = addReadPages;
