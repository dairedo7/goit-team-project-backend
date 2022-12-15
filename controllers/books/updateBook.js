const { bookServices } = require('../../services');
const { requestError } = require('../../helpers/requestError');

const updateBook = async (req, res) => {
  const { bookId } = req.body;

  const result = await bookServices.updateBook(bookId, req.body);

  if (!result) {
    throw requestError(404, 'Not found');
  }
  res.json(result);
};

module.exports = updateBook;
