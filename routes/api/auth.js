const { Router } = require("express");

const wrapper = require("../../middlewares/wrapper");
const {
  googleAuth,
  googleRedirect,
} = require("../../controllers/auth/auth.controller");

const router = Router();

router.get("/google", wrapper(googleAuth));
router.get("/google-redirect", wrapper(googleRedirect));

module.exports = router;
