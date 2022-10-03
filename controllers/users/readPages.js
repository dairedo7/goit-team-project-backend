const { Planning, Book, User } = require('../../models');
const { DateTime } = require('luxon');

const addReadPages = async (req, res) => {
  const user = req.user;
  const { pages } = req.body;
  const { planning } = await User.findOne({ _id: user });
  // console.log(planning);

  const { books } = await User.findOne({
    _id: user._id,
  }).populate('books');
  // console.log(books);

  if (!planning) {
    return res.status(403).send({ message: 'You must start a planning first' });
  }

  let book = null;
  let diff = 0;
  let currentIteration = 0;
  console.log(books.length);
  for (let i = 0; i < books.length; i++) {
    currentIteration = i;

    book = await Book.findOne({ _id: planning.books[i] });
    if (book?.pagesTotal === book?.readPages) {
      continue;
    }
    book.readPages += pages;
    if (book.readPages > book.pagesTotal) {
      diff = book.readPages - book.pagesTotal;
      book.readPages = book.pagesTotal;
      while (diff !== 0) {
        currentIteration++;
        const nextBook = await Book.findOne({
          _id: planning.books[currentIteration],
        });
        nextBook.readPages += diff;
        if (nextBook.readPages > nextBook.pagesTotal) {
          diff = nextBook.readPages - nextBook.pagesTotal;
          nextBook.readPages = nextBook.pagesTotal;
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
  const date = DateTime.now().setZone('Europe/Odessa').toObject();
  let minute = date.minute?.toString();
  if (date.minute.toString().length === 1) {
    minute = '0' + date.minute;
  }
  const time = `${date.year}-${date.month}-${date.day} ${date.hour}:${minute}`;
  planning.stats.push({ time, pagesCount: pages });
  await planning.save();
  return res.status(200).send({ book, planning });
};
module.exports = addReadPages;
