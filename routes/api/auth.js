const express = require("express");
const { signUp, signIn, signOut } = require("../../controllers");
const { validation, wrapper, auth } = require("../../middlewares");

const { joiLoginSchema, joiUserSchema } = require("../../models");

const {
  googleAuth,
  googleRedirect,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/signup", validation(joiUserSchema), wrapper(signUp));

router.post("/signin", validation(joiLoginSchema), wrapper(signIn));

router.get("/signout", auth, wrapper(signOut));

router.get("/google", wrapper(googleAuth));
router.get("/google-redirect", wrapper(googleRedirect));

module.exports = router;
