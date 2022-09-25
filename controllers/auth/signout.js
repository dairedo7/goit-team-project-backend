const { User } = require("../../models");
const { Unauthorized } = require("http-errors");

const signOut = async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    throw new Unauthorized("Not authorized");
  }

  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};

module.exports = signOut;
