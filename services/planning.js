import { Planning, Book } from '../models/index.js';

const getPlanningBooks = async (planning) => {
  const { books } = await Planning.findOne({ _id: planning });
  return books;
};

const getActiveBooks = async (planning) => {
  const { books } = await Planning.findOne({ _id: planning }).populate('books');
  return books;
};

const getPlanning = async (planning) => {
  const planningDets = await Planning.findOne({ _id: planning });
  return planningDets;
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

const getUpdatedTraning = async (planning) => {
  const upTraining = await Planning.findOne({
    _id: planning,
  }).populate('books');
  return upTraining;
};

export const planningServices = {
  getPlanningBooks,
  getActiveBooks,
  getPlanning,
  getCurrentBook,
  getActivePlanning,
  removeById,
  getUpdatedTraning,
};
