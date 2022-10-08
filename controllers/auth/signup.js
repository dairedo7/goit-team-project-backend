const { User } = require('../../models/user');
const { Conflict } = require('http-errors');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env;
const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new Conflict('Email in use');
  }
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  await User.create({ email, password: hashPassword, name });
  await user?.save();

  const theUser = await User.findOne({ email: email });
  const payload = {
    id: theUser._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
  await User.findByIdAndUpdate(theUser._id, { token });

  res.status(201).json({
    status: 'success',
    code: 201,
    user: { name, email, _id: theUser._id },
    token,
  });
};

module.exports = signUp;
