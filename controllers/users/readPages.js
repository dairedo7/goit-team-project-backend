const { Planning, Book, User } = require('../../models');
const { DateTime } = require('luxon');

const addReadPages = async (req, res) => {
  const user = req.user;
  const { pages } = req.body;
  // console.log(pages);
  // const { planning } = await User.findOne({ _id: user });
  // console.log(planning);

  const planning = await Planning.findOne({ _id: user?.planning }).populate('books');
  const books = planning.books;
  // console.log(planning.books);
  // const { books } = await Planning.findOne({
  //   _id: user._id,
  // }).populate('books');
  // console.log(books);

  if (!books) {
    return res.status(403).send({ message: 'You must start a planning first' });
  }

  let book = null;
  let diff = 0;
  let currentIteration = 0;
  console.log(books.length);
  for (let i = 0; i < books.length; i++) {
    currentIteration = i;
    // console.log(currentIteration);

    book = await Book.findOne({ _id: books[i] });
    if (book?.totalPages === book?.readPages) {
      continue;
    }
    book.readPages += pages;
    if (book.readPages > book.totalPages) {
      diff = book.readPages - book.totalPages;
      book.readPages = book.totalPages;
      while (diff !== 0) {
        currentIteration++;
        const nextBook = await Book.findOne({
          _id: books[currentIteration],
        });
        nextBook.readPages += diff;
        if (nextBook.readPages > nextBook.totalPages) {
          diff = nextBook.readPages - nextBook.totalPages;
          nextBook.readPages = nextBook.totalPages;
          await nextBook.save();
        } else {
          diff = 0;
        }
      }
    }
    await book.save();
    break;
  }
  if (!book) {
    return res.status(403).send({
      message: 'You have already read all the books from this planning',
    });
  }
  const date = DateTime.now().setZone('Europe/Kiev').toObject();
  // console.log(date);

  let minute = date.minute?.toString();
  console.log(minute);
  if (date.minute.toString().length === 1) {
    minute = '0' + date.minute;
  }
  const time = `${date.year}-${date.month}-${date.day} ${date.hour}:${minute}`;
  planning.results.push({ time, pagesCount: pages });
  await planning.save();
  console.log(book);
  return res.status(200).send({ book, planning });
};
module.exports = addReadPages;
