const { Book } = require('../../models');

const { requestError } = require('../../helpers/requestError');

const updateBook = async (req, res) => {
  const { bookId } = req.body;

  const result = await Book.findByIdAndUpdate(bookId, req.body, { new: true });

  if (!result) {
    throw requestError(404, 'Not found');
  }
  res.json(result);
};

module.exports = updateBook;
