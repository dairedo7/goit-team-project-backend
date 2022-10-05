const { Planning, Book } = require('../../models');
const { DateTime } = require('luxon');
// const { bookStatus } = require('../../helpers/constants');

const startPlan = async (req, res, next) => {
  try {
    const { startDate, endDate, books } = req.body;
    const user = req.user;

    console.log(books);

    const startTime = startDate.split('-');
    const endTime = endDate.split('-');
    const startDateObjArr = DateTime.local(Number(startTime[0]), Number(startTime[1]), Number(startTime[2]));
    const endDateObjArr = DateTime.local(Number(endTime[0]), Number(endTime[1]), Number(endTime[2]));
    const duration = endDateObjArr.diff(startDateObjArr, 'days').toObject().days;

    if (!duration || duration < 1) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'wrong dates, use YYYY-MM-DD format or select current date',
      });
    }

    const selectedBooks = [];
    let numberOfPages = 0;

    for (let i = 0; i < books.length; i++) {
      const book = await Book.findOne({ _id: books[i] });
      console.log(book);
      if (!book || !user?.books.includes(book?._id)) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'wrong book id',
        });
      }

      if (book.readPages !== 0) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: "you can't add book that you've already read",
        });
      }

      numberOfPages += book.totalPages;

      const { _id, title, author, year, totalPages, readPages, review, rating } = book;

      const validateBook = {
        _id,
        title,
        author,
        year,
        totalPages,
        readPages,
        review,
        rating,
      };

      selectedBooks.push(validateBook);
    }

    const pagesPerDay = Math.ceil(numberOfPages / duration);

    const training = await Planning.findOne({ _id: user?.training });

    if (training) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'you have active training',
      });
    }

    const createTraining = await Planning.create({
      startDate,
      endDate,
      duration,
      books,
      pagesPerDay,
      totalPages: numberOfPages,
    });

    user.training = createTraining._id;
    user.planning.push(createTraining);

    await user.save();
    await createTraining.save();

    return res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        _id: createTraining._id,
        startDate: createTraining.startDate,
        endDate: createTraining.endDate,
        duration: createTraining.duration,
        books: selectedBooks,
        pagesPerDay: createTraining.pagesPerDay,
        totalPages: createTraining.totalPages,
        readPages: createTraining.readPages,
        results: createTraining.results,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = startPlan;
