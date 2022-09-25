
const express = require("express");
const { signUp, signIn, signOut } = require("../../controllers");
const { getCurrent } = require("../../controllers");
const { validation, wrapper, auth } = require("../../middlewares");
const getPlanningInfo = require('../../controllers');


const { joiLoginSchema, joiUserSchema } = require("../../models");

const router = express.Router();

router.post("/signup", validation(joiUserSchema), wrapper(signUp));

router.post("/signin", validation(joiLoginSchema), wrapper(signIn));

router.get("/signout", auth, wrapper(signOut));

router.get("/current", auth, wrapper(getCurrent));

router.get("/planning", auth, wrapper(getPlanningInfo));

router.get("/start-planning", wrapper(startPlan));



module.exports = router;
