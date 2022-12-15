const { planningServices } = require('../../services');
const {
  httpCode: { NOT_FOUND },
} = require('../../helpers/constants');

const getPlanningInfo = async (req, res) => {
  const user = req.user;
  try {
    const planningBooks = await planningServices.getPlanningBooks(user.planning);

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
    // eslint-disable-next-line no-ex-assign
    error = new Error(`${NOT_FOUND}: No active planning found`);
    error.status = NOT_FOUND;
    throw error;
  }
};

module.exports = getPlanningInfo;
