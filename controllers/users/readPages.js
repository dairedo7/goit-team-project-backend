const { Planning, Book } = require('../../models');
const {DateTime} = require('luxon');

const addReadPages = async (req, res) => {
    const user = req.user;
    const { pages } = req.body;
    const planning = await Planning.findOne({ _id: user?.planning });
    if (!planning) {
      return res.status(403).send({ message: "You must start a planning first" });
    }
    let book = null;
    let diff = 0;
    let currentIteration = 0;
    for (let i = 0; i < planning.books.length; i++) {
      currentIteration = i;
      book = await Book.findOne({ _id: planning.books[i] });
      if (book?.pagesTotal === book?.pagesFinished) {
        continue;
      }
      book.pagesFinished += pages;
      if (book.pagesFinished > book.pagesTotal) {
        diff = book.pagesFinished - book.pagesTotal;
        book.pagesFinished = book.pagesTotal;
        while (diff !== 0) {
          currentIteration++;
          const nextBook = await Book.findOne({
            _id: planning.books[currentIteration],
          });
          nextBook.pagesFinished += diff;
          if (
            nextBook.pagesFinished > nextBook.pagesTotal
          ) {
            diff =
              nextBook.pagesFinished - nextBook.pagesTotal;
            nextBook.pagesFinished = nextBook.pagesTotal;
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
        message: "You have already read all the books from this planning",
      });
    }
    const date = DateTime.now().setZone("Europe/Odessa").toObject();
    let minute = date.minute?.toString();
    if (date.minute.toString().length === 1) {
      minute = "0" + date.minute;
    }
    const time = `${date.year}-${date.month}-${date.day} ${date.hour}:${minute}`;
    planning.stats.push({ time, pagesCount: pages });
    await planning.save();
    return res.status(200).send({ book, planning });
  };
   module.exports = addReadPages;