const { DateTime } = require('luxon');
const { bookStatus } = require('../../helpers/constants');
const { planningServices } = require('../../services');

const addReadPages = async (req, res, next) => {
  try {
    const user = req.user;

    let { date, pages } = req.body;
    const { DONE } = bookStatus;

    const training = await planningServices.getActivePlanning(user.planning);

    if (!training) {
      return res.status(403).json({
        status: 'error',
        code: 403,
        message: 'no active planning',
      });
    }

    if (!pages) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'invalid pages value',
      });
    }

    let book = null;
    let diff = 0;
    let currentIteration = 0;

    for (let i = 0; i < training.books.length; i++) {
      currentIteration = i;

      const currentBook = await planningServices.getCurrentBook(training.books[i]);

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

        while (diff !== 0 && currentIteration < training.books.length) {
          currentIteration++;
          if (currentIteration < training.books.length) {
            const nextBook = await planningServices.getCurrentBook(training.books[currentIteration]);
            nextBook.readPages += diff;
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

      break;
    }

    const currentTime = date.split('-');
    const currentDate = DateTime.local(Number(currentTime[0]), Number(currentTime[1]), Number(currentTime[2]));
    date = currentDate.toFormat('yyyy-LL-dd');

    training.results.push({ date, pagesCount: pages });
    await training.save();

    const currentTraining = await planningServices.getActivePlanning(user.planning);
    if (training.totalReadPages >= currentTraining.totalPages) {
      await planningServices.removeById(training._id);
      user.planning = [];

      await user.save();
      getTrainingResp(res, 'Plan finished', book, currentTraining);
    } else if (book.readPages === book.totalPages) {
      getTrainingResp(res, 'Book finished', book, currentTraining);
    } else if (training.totalReadPages !== training.totalPages) {
      console.log(currentTraining.books);
      getTrainingResp(res, 'Pages added', book, currentTraining);
    }
  } catch (err) {
    next(err);
  }
};

const getTrainingResp = (res, message, book, trainingStage) => {
  return res.status(200).json({
    status: 'success',
    message: `${message}`,
    code: 200,
    data: {
      book,
      planning: {
        _id: trainingStage._id,
        start: trainingStage.startDate,
        end: trainingStage.endDate,
        duration: trainingStage.duration,
        pagesPerDay: trainingStage.pagesPerDay,
        totalPages: trainingStage.totalPages,
        status: trainingStage.books.status,
        totalReadPages: trainingStage.totalReadPages,
        books: trainingStage.books,
        results: trainingStage.results,
      },
    },
  });
};

module.exports = addReadPages;
