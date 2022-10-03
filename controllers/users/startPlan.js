const { Planning, Book } = require('../../models');
const { DateTime } = require('luxon');

const startPlan = async (req, res) => {
  const { startDate, endDate, books = [] } = req.body;
  const user = req.user;
  const startDateArr = startDate.split("");
  const endDateArr = endDate.split("");
  const startDateObj = DateTime.local(
    Number(startDateArr[0]),
    Number(startDateArr[1]),
    Number(startDateArr[2]),
  );
  const endDateObj = DateTime.local(
    Number(endDateArr[0]),
    Number(endDateArr[1]),
    Number(endDateArr[2]),
  );
  const duration = endDateObj.diff(startDateObj, "days").toObject().days;
  if (!duration || duration < 1) {
    return res.status(404).send({ message: "Invalid dates" });
  }
  let totalPages = 0;
  const booksPopulated = [];
  for (let i = 0; i < books.length; i++) {
    const book = await Book.findOne({ _id: books[i] });
    if (!book || !user?.books.includes(book?._id)) {
      return res.status(400).send({ message: "Invalid 'bookId'" });
    }
    if (book.pagesFinished !== 0) {
      return res.status(400).send({
        message:
          "Invalid 'bookId', you can't add books that you've already read/reading",
      });
    }
    totalPages += book.pagesTotal;
    booksPopulated.push(book);
  }
  const pagesPerDay = Math.ceil(totalPages / duration);
  const newPlanning = await Planning.create({
    startDate,
    endDate,
    books,
    duration,
    pagesPerDay,
  });
  user.planning = newPlanning._id;
  await user.save();
  return res.status(201).send({
    startDate: newPlanning.startDate,
    endDate: newPlanning.endDate,
    books: booksPopulated,
    duration: newPlanning.duration,
    pagesPerDay: newPlanning.pagesPerDay,
    results: newPlanning.results,
    _id: newPlanning._id,
  });
}

module.exports = startPlan;
