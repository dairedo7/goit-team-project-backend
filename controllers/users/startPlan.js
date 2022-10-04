const { Planning, Book, User } = require("../../models");
const { DateTime } = require("luxon");

const startPlan = async (req, res) => {
  const { startDate, endDate, bookId } = req.body;
  // 633b49b86fd19583db53b1ac
  let totalPages = 0;
  const booksPopulated = [];

  const book = await Book.findOne({ _id: bookId });

  console.log(book);
  const user = req.user;

  if (!book || !user?.books.includes(book?._id)) {
    return res.status(400).send({ message: "Invalid 'bookId'" });
  }
  if (book.readPages !== 0) {
    return res.status(400).send({
      message:
        "Invalid 'bookId', you can't add books that you've already read/reading",
    });
  }

  totalPages += book.totalPages;
  booksPopulated.push(book);

  // const theBook = Book.findOne({
  //   _id: _bookId,
  // });

  // Populate give us access to fields of books in User's model
  const { books } = await User.findOne({
    _id: user._id,
  }).populate("books");

  // console.log(startDate, 'startDate');
  // console.log(endDate, 'endDate');
  const startDateArr = startDate.split("-");
  const endDateArr = endDate.split("-");
  const startDateObj = DateTime.local(
    Number(startDateArr[0]),
    Number(startDateArr[1]),
    Number(startDateArr[2])
  );
  const endDateObj = DateTime.local(
    Number(endDateArr[0]),
    Number(endDateArr[1]),
    Number(endDateArr[2])
  );
  const duration = endDateObj.diff(startDateObj, "days").toObject().days;

  if (!duration || duration < 1) {
    return res.status(404).send({ message: "Invalid dates" });
  }

  // for (let i = 0; i < books.length; i++) {
  //   const book = await Book.findOne({ _id: books[i] });
  //   // console.log(book);
  //   if (!book || !user?.books.includes(book?._id)) {
  //     return res.status(400).send({ message: "Invalid 'bookId'" });
  //   }
  //   if (book.readPages !== 0) {
  //     return res.status(400).send({
  //       message: "Invalid 'bookId', you can't add books that you've already read/reading",
  //     });
  //   }
  //   totalPages += book.totalPages;
  //   booksPopulated.push(book);
  // }

  const pagesPerDay = Math.ceil(totalPages / duration);
  const newPlanning = await Planning.create({
    startDate,
    endDate,
    books,
    duration,
    pagesPerDay,
  });

  user.planning.push(newPlanning);

  await user.save();

  // console.log(newPlanning);

  await newPlanning.save();
  console.log(newPlanning._id);
  return res.status(201).send({
    data: {
      startDate: newPlanning.startDate,
      endDate: newPlanning.endDate,
      books: booksPopulated,
      duration: newPlanning.duration,
      pagesPerDay: newPlanning.pagesPerDay,
      results: newPlanning.results,
      _id: newPlanning._id,
    },
  });
};

module.exports = startPlan;
