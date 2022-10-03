const Book = require('../../models');
const User = require('../../models');

const getPlanningInfo = async (_, res) => {
  const result = await Book.find({});
  console.log(result);
  if (!result) {
    const error = new Error({ message: 'Not found' });
    error.status = 404;
    throw error;
  }
  res.json(result);
};

module.exports = getPlanningInfo;
