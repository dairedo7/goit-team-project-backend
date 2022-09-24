const express = require('express')
const {signUp, signIn, logout} = require('../../controllers');
const {validation, wrapper, auth} = require('../../middlewares');

const {
  joiLoginSchema,
  joiUserSchema,
} = require("../../models");

const router = express.Router();

router.post("/signup", validation(joiUserSchema), wrapper(signUp));

router.post("/signin", validation(joiLoginSchema), wrapper(signIn));

router.get("/logout", auth, wrapper(logout));


module.exports = router;
