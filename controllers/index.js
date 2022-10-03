const signUp = require('./auth/signup');
const signIn = require('./auth/signin');
const signOut = require('./auth/signout');
const authController = require('./auth/auth-controller');
const getCurrent = require('./users/getCurrent');
const getBookStatus = require('./books/getBookStatus');
const getPlanningInfo = require('./users/getPlanningInfo');
const startPlan = require('./users/startPlan');
const readPages = require('./users/readPages');

module.exports = {
  signUp,
  signIn,
  signOut,
  authController,
  getCurrent,
  getBookStatus,
  getPlanningInfo,
  startPlan,
  readPages,
};
