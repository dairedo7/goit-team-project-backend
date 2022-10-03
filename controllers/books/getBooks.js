const { Book } = require('../../models/book');

const getBooks = async (_, res) => {
  const result = await Book.find({}, '-createdAt -updatedAt');
  console.log(result);
  res.json(result);
};

module.exports = getBooks;
