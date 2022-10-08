const express = require('express');
const { wrapper, auth } = require('../../middlewares');
const { startPlan, readPages, removePlanning, getPlanningInfo, getCurrent } = require('../../controllers');

const router = express.Router();

router.get('/', auth, wrapper(getCurrent));

router.get('/planning', auth, wrapper(getPlanningInfo));

router.post('/planning', auth, wrapper(startPlan));

router.patch('/planning', auth, wrapper(readPages));

router.delete('/:planningId', auth, wrapper(removePlanning));

module.exports = router;
