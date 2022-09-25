const { Book } = require("../models");
const { User } = require("../models");

const getBooks = (userId) => {
  return Book.find({ user: userId });
};

const getOne = (bookId) => {
  return Book.findById(bookId);
};

const addBook = async (userId, body) => {
  try {
    const book = await Book.create(body);
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          books: book._id,
        },
      },
      {
        new: true,
      }
    );
    return book;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteBook = async (userId, bookId) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          books: bookId,
        },
      },
      {
        new: true,
      }
    );

    return Book.findByIdAndDelete(bookId);
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateBook = async (bookId, rating, resume) => {
  try {
    const book = await Book.findByIdAndUpdate(
      bookId,

      { rating, resume },
      { new: true }
    );

    return book;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getBooks,
  getOne,
  addBook,
  deleteBook,
  updateBook,
};
