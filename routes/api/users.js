
const express = require("express");
const { getCurrent } = require("../../controllers");
const getPlanningInfo = require('../../controllers');
const { wrapper, auth } = require("../../middlewares");

const { startPlan } = require("../../controllers/users/startPlan");

const router = express.Router();

router.get("/current", auth, wrapper(getCurrent));

router.get("/planning", auth, wrapper(getPlanningInfo));

router.get("/start-planning", wrapper(startPlan));

module.exports = router;
