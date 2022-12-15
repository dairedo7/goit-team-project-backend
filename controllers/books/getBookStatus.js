import { bookStatus } from '../../helpers/constants.js';
import { bookServices } from '../../services/index.js';

const getCurrentStatus = async (req, res, next) => {
  const { PLAN, READ, DONE } = bookStatus;

  const user = req.user;
  const { status } = req.params;

  const books = await bookServices.getUserBooks(user._id);

  const result = [];

  if (!books) {
    return res.status(200).json({
      status: 'error',
      code: 200,
      data: {
        books: [],
      },
    });
  }

  console.log(books);

  books.filter((book) => {
    if (status === PLAN && book.status === PLAN) {
      result.push(book);
    }
    if (status === READ && book.status === READ) {
      result.push(book);
    }
    if (status === DONE && book.status === DONE) {
      result.push(book);
    }

    return result;
  });

  res.json({
    status: 'success',
    code: 200,
    data: {
      result,
    },
  });
};

export { getCurrentStatus };
