const signUp = require("./auth/signup");
const signIn = require("./auth/signin");
const signOut = require("./auth/signout");
const getCurrent = require("./users/getCurrent");

module.exports = {
  signUp,
  signIn,
  signOut,
  getCurrent,
};
