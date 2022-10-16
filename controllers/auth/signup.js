const { Conflict } = require('http-errors');
const jwt = require('jsonwebtoken');

const { userServices } = require('../../services');

const { SECRET_KEY } = process.env;
const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await userServices.findUserByEmail(email);

  if (user) {
    throw new Conflict('Email in use');
  }
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  await userServices.addNewUser(email, name, hashPassword);
  await user?.save();

  const theUser = await userServices.findUserByEmail(email);
  console.log(theUser);
  const payload = {
    id: theUser._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '30d' });
  console.log(token);
  await userServices.findUserAndUpdate(theUser._id, token);

  res.status(201).json({
    status: 'success',
    code: 201,
    user: { name, email, _id: theUser._id },
    token,
  });
};

module.exports = signUp;
