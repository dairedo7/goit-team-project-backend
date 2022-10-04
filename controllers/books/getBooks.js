const { User } = require("../../models");

const getBooks = async (req, res) => {
  const user = req.user;

  const { books } = await User.findOne({ _id: user }).populate("books");

  res.json(books);
};

module.exports = getBooks;
