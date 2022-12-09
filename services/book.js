import { Book, User } from '../models/index.js';

const addBook = async (book) => {
  const books = await Book.create({ ...book });
  return books;
};

const getUserBooks = async (_id) => {
  const { books } = await User.findOne({ _id: _id }).populate('books');
  return books;
};

const updateBook = async (bookId, reqBody) => {
  const updatedBook = await Book.findByIdAndUpdate(bookId, reqBody, { new: true });
  return updatedBook;
};

const removeBook = async (id) => {
  const removedBook = await Book.findByIdAndRemove(id);
  return removedBook;
};

export const bookServices = {
  addBook,
  getUserBooks,
  removeBook,
  updateBook,
};
