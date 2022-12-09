import { bookServices } from '../../services/index.js';
import { requestError } from '../../helpers/requestError.js';

export const removeBook = async (req, res) => {
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
