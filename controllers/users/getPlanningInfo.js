const { Book, User, Planning } = require("../../models");

const getPlanningInfo = async (req, res) => {
  const result = await Book.find({});

  const user = req.user;
  console.log(user.planning);

  const planning = await User.findOne({ _id: user?.planning }).populate(
    "books"
  );

  console.log(planning);

  if (!result) {
    const error = new Error({ message: "Not found" });
    error.status = 404;
    throw error;
  }
  res.json(user);
};

module.exports = getPlanningInfo;
