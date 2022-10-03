const express = require('express');
const { wrapper, auth } = require('../../middlewares');
const { startPlan, readPages, getPlanningInfo, getCurrent } = require('../../controllers');

const router = express.Router();

router.get('/current', auth, wrapper(getCurrent));

router.get('/planning', auth, wrapper(getPlanningInfo));

router.post('/planning', auth, wrapper(startPlan));

router.patch('/planning', wrapper(readPages));

module.exports = router;
