const { Planning, Book } = require('../../models');
const { DateTime } = require('luxon');
const { bookStatus } = require('../../helpers/constants');

const addReadPages = async (req, res) => {
  const user = req.user;
  const { pages, bookId } = req.body;
  const { READ, DONE } = bookStatus;

  const book = await Book.findOne({ _id: bookId });

  if (book.totalPages < book.readPages + pages) {
    return res.status(403).send({ message: `Maximum allowed pages is: ${book.totalPages - book.readPages}` });
  }

  book.readPages += pages;

  if (book.readPages > 0) {
    book.status = READ;
  }

  if (book.totalPages === book.readPages) {
    book.status = DONE;
  }

  console.log(book.readPages);
  await book.save();

  const planning = await Planning.findOne({ _id: user?.planning }).populate('books');
  const books = planning.books;

  if (!books) {
    return res.status(403).send({ message: 'You must start a planning first' });
  }

  if (!book) {
    return res.status(403).send({
      message: 'You have already read all the books from this planning',
    });
  }
  const date = DateTime.now().setZone('Europe/Kiev').toObject();

  let minute = date.minute?.toString();

  if (date.minute.toString().length === 1) {
    minute = '0' + date.minute;
  }
  const time = `${date.year}-${date.month}-${date.day} ${date.hour}:${minute}`;
  planning.results.push({ time, pagesCount: pages });
  await planning.save();

  return res.status(200).send({ book, planning });
};
module.exports = addReadPages;
