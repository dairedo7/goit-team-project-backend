const { Router } = require("./auth.router");
const wrapper = require("../../middlewares/wrapper");
const { googleAuth, googleRedirect } = require("../../controllers/auth");

const router = Router();

router.get("./google", wrapper(googleAuth));
router.get("./google-redirect", wrapper(googleRedirect));

module.exports = router;
