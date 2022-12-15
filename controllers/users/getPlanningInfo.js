import { planningServices } from '../../services/index.js';
import { httpCode } from '../../helpers/constants.js';
const { NOT_FOUND } = httpCode;

export const getPlanningInfo = async (req, res) => {
  const user = req.user;
  try {
    const planningBooks = await planningServices.getPlanningBooks(user.planning);

    if (!planningBooks) {
      res;
    }
    const books = await planningServices.getActiveBooks(user.planning);

    const planning = await planningServices.getPlanning(user.planning);

    if (!planningBooks || !planning) {
      const error = new Error({ message: 'Not found' });
      error.status = 404;
      throw error;
    }
    res.json({
      status: 'success',
      code: 200,
      planning,
      data: {
        books: books,
        booksNumber: planningBooks.length,
        planningDur: planning.duration,
      },
    });
  } catch (error) {
    error = new Error(`${NOT_FOUND}: No active planning found`);
    error.status = NOT_FOUND;
    throw error;
  }
};
