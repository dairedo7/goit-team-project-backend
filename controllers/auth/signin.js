import Unauthorized from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { userServices } from '../../services/index.js';

import dotenv from 'dotenv';
dotenv.config();

const { env: SECRET_KEY } = process;

// console.log(SECRET_KEY);
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await userServices.findUserByEmail(email);

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
  let Key = '';
  ({ SECRET_KEY: Key } = SECRET_KEY);

  console.log('key', Key);

  const token = jwt.sign(payload, Key, { expiresIn: '30d' });

  await userServices.findUserAndUpdate(user._id, token);
  res.json({
    status: 'success',
    code: 200,
    data: {
      token,
      user: { email, name, _id: user._id },
    },
  });
};
