const signUp = require('./auth/signup');
const signIn = require('./auth/signin');
const signOut = require('./auth/signout');
const { googleAuth, googleRedirect } = require('./auth/auth');
const getCurrent = require('./users/getCurrent');
const getBookStatus = require('./books/getBookStatus');
const getPlanningInfo = require('./users/getPlanningInfo');
const startPlan = require('./users/startPlan');
const readPages = require('./users/readPages');
const googleSignin = require('./auth/googleSignin');
const removePlanning = require('./users/removePlanning');

module.exports = {
  signUp,
  signIn,
  signOut,
  googleAuth,
  googleRedirect,
  googleSignin,
  getCurrent,
  getBookStatus,
  getPlanningInfo,
  startPlan,
  readPages,
  removePlanning,
};
