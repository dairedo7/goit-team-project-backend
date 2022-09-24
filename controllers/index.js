const signUp = require("./users/signup");
const signIn = require("./users/signin");
const signOut = require("./users/signout");
const authController = require("./auth/auth.controller");

module.exports = {
  signUp,
  signIn,
  signOut,
  authController,
};
