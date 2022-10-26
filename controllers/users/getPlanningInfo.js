const { planningServices } = require('../../services');

const getPlanningInfo = async (req, res) => {
  const user = req.user;

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
};

module.exports = getPlanningInfo;
