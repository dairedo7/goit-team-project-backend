const { Planning } = require('../../models');

const getPlanningInfo = async (req, res) => {
  const user = req.user;

  const books = await Planning.findOne({ _id: user.planning });
  const planning = await Planning.findOne({ _id: user.planning });
  const bookdsToRead = books.booksToRead;

  if (!books || !planning) {
    const error = new Error({ message: 'Not found' });
    error.status = 404;
    throw error;
  }
  res.json({
    status: 'success',
    code: 200,
    planning,
    data: {
      booksNumber: bookdsToRead.length,
      planningDur: planning.duration,
    },
  });
};

module.exports = getPlanningInfo;
