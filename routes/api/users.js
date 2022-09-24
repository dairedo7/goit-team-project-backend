const express = require('express')
const {signUp, signIn, signOut, getCurrent} = require('../../controllers');
const {validation, wrapper, auth} = require('../../middlewares');

const {
  joiLoginSchema,
  joiUserSchema,
} = require("../../models");

const router = express.Router();

router.post("/signup", validation(joiUserSchema), wrapper(signUp));

router.post("/signin", validation(joiLoginSchema), wrapper(signIn));

router.get("/signout", auth, wrapper(signOut));

router.get("/current", auth, wrapper(getCurrent));

module.exports = router;
