import { userServices } from '../../services/index.js';
import Unauthorized from 'http-errors';

export const signOut = async (req, res) => {
  let { _id, token } = req.user;
  console.log(_id);

  if (!_id) {
    throw new Unauthorized('Not authorized');
  }
  token = null;
  await userServices.findUserAndUpdate(_id, token);

  res.json({ status: 'success', code: 204, message: 'The user was successfully logged out' });
};
