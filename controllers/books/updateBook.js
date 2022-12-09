import { bookServices } from '../../services/index.js';
import { requestError } from '../../helpers/requestError.js';

export const updateBook = async (req, res) => {
  const { bookId } = req.body;

  const result = await bookServices.updateBook(bookId, req.body);

  if (!result) {
    throw requestError(404, 'Not found');
  }
  res.json(result);
};
