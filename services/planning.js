const { Planning, Book } = require('../models');

const getPlanningBooks = async (planning) => {
  const { books } = await Planning.findOne({ _id: planning });
  return books;
};

const getActiveBooks = async (planning) => {
  const { books } = await Planning.findOne({ _id: planning }).populate('books');
  return books;
};

const getCurrentBook = async (book) => {
  const currentBook = await Book.findOne({ _id: book });
  return currentBook;
};

const getActivePlanning = async (planning) => {
  const training = await Planning.findOne({
    _id: planning,
  }).populate('books');
  return training;
};

const removeById = async (id) => {
  return await Planning.findByIdAndRemove(id);
};

module.exports = {
  getPlanningBooks,
  getActiveBooks,
  getCurrentBook,
  getActivePlanning,
  removeById,
};
