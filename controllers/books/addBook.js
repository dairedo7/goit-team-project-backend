const { Book } = require("../../models/book");

const addBook = async (req, res) => {
  const { _id: user } = req.user;
  const result = await Book.create({ ...req.body, user });
  res.status(201).json(result);
};

module.exports = addBook;
