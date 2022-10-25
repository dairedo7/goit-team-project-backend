const { Planning } = require('../../models');
const { planningServices } = require('../../services');

const getPlanningInfo = async (req, res) => {
  const user = req.user;

  const planningBooks = await planningServices.getPlanningBooks(user.planning);
  console.log('The books collection in user.planning', planningBooks);
  const { books } = await Planning.findOne({ _id: user.planning }).populate('books');
  console.log('Result', books);
  const planning = await Planning.findOne({ _id: user.planning });

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
