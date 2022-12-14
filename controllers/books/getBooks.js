const { bookServices } = require('../../services');

const getBooks = async (req, res) => {
  const user = req.user;

  const books = await bookServices.getUserBooks(user._id);

  res.json(books);
};

module.exports = getBooks;
