const { Planning } = require('../models/planning');

const getPlanningBooks = async (planning) => {
  const { books } = await Planning.findOne({ _id: planning });
  console.log(books);
  return books;
};

module.exports = { getPlanningBooks };
