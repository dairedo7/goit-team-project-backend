const { Book } = require('../../models/book');

const { requestError } = require('../../helpers/requestError');

const removeBook = async (req, res) => {
  const { bookId: id } = req.params;
  const result = await Book.findByIdAndRemove(id);

  if (!result) {
    throw requestError(404, 'Not found');
  }

  res.json({
    message: 'Book deleted',
  });
};

module.exports = removeBook;
