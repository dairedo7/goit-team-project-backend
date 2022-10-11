const { User } = require('../../models');
const { Unauthorized } = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env;

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  const name = user.name;

  const passCompare = bcrypt.compare(password, user.password);

  const result = await passCompare;
  if (!user) {
    throw new Unauthorized('Current email does not exist');
  }
  if (!result) {
    throw new Unauthorized('Wrong password');
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '30d' });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    status: 'success',
    code: 200,
    data: {
      token,
      user: { email, name, _id: user._id },
    },
  });
};

module.exports = signIn;
