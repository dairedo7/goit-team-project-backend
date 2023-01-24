const { bookServices } = require('../../services');
const { requestError } = require('../../helpers/requestError');

const removeBook = async (req, res) => {
  const { bookId: _id } = req.params;
  const theUser = req.user;

  const result = await bookServices.removeBook(_id);
  if (!result) {
    throw requestError(404, 'Not found');
  }
  theUser?.books.splice(_id, 1);
  await theUser?.save();

  res.json({
    message: 'Book deleted',
  });
};

module.exports = removeBook;
