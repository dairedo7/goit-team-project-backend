const { bookServices } = require('../../services');
const { requestError } = require('../../helpers/requestError');

const removeBook = async (req, res) => {
  const { bookId: id } = req.params;
  const theUser = req.user;

  const result = await bookServices.removeBook(id);
  if (!result) {
    throw requestError(404, 'Not found');
  }
  theUser?.books.splice(id, 1);
  await theUser?.save();

  res.json({
    message: 'Book deleted',
  });
};

module.exports = removeBook;
