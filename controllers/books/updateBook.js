const { Book } = require('../../models/book');

const { requestError } = require('../../helpers/requestError');

const updateBook = async (req, res) => {
  const { bookId: id } = req.params;

  const result = await Book.findByIdAndUpdate(id, req.body, { new: true });
  // await theUser?.save();
  await result.save();

  if (!result) {
    throw requestError(404, 'Not found');
  }
  res.json(result);
};

module.exports = updateBook;
