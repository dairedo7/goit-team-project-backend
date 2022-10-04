const { User, Planning } = require("../../models");

const getPlanningInfo = async (req, res) => {
  const user = req.user;

  const { books } = await User.findOne({ _id: user }).populate("books");
  const planning = await Planning.findOne({ _id: user.planning });

  if (!books || !planning) {
    const error = new Error({ message: "Not found" });
    error.status = 404;
    throw error;
  }
  res.json({
    status: "success",
    code: 200,
    data: {
      booksNumber: books.length,
      planningDur: planning.duration,
    },
  });
};

module.exports = getPlanningInfo;
