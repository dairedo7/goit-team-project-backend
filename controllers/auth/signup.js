const { User } = require("../../models/user");
const { Conflict } = require("http-errors");
const bcrypt = require("bcrypt");

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new Conflict("Email in use");
  }
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  await User.create({ email, password: hashPassword, name });
  res.status(201).json({
    status: "success",
    code: 201,
    user: { name, email },
  });
};

module.exports = signUp;
