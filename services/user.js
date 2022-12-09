import { User } from '../models/index.js';

const findUserByEmail = async (email) => {
  const findUserByEmail = await User.findOne({ email });
  return findUserByEmail;
};

const findUserById = async (id, token) => {
  console.log(token);
  const findUserById = await User.findOne({ _id: id }, { token });
  return findUserById;
};

const findUserAndUpdate = async (id, token) => {
  const findUserById = await User.findByIdAndUpdate({ _id: id }, { token });
  return findUserById;
};

const addNewUserByGoogle = async (email, name, password) => {
  const addByGoogle = await new User({ email, name, password }).save();

  return addByGoogle;
};

const addNewUser = async (email, name, password) => {
  const addNewUser = await User.create({ email, name, password });

  return addNewUser;
};

const updateToken = async (id, token) => {
  const newToken = await User.updateOne({ _id: id }, { token });

  return newToken;
};

export const userServices = {
  findUserByEmail,
  findUserById,
  addNewUserByGoogle,
  addNewUser,
  updateToken,
  findUserAndUpdate,
};
