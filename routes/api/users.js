import express from 'express';
import { wrapper, auth } from '../../middlewares/index.js';
import { startPlan, addReadPages, removePlanning, getPlanningInfo, getCurrentStatus } from '../../controllers/index.js';

const apiUsers = express.Router();

apiUsers.get('/', auth, wrapper(getCurrentStatus));

apiUsers.get('/planning', auth, wrapper(getPlanningInfo));

apiUsers.post('/planning', auth, wrapper(startPlan));

apiUsers.patch('/planning', auth, wrapper(addReadPages));

apiUsers.delete('/:planningId', auth, wrapper(removePlanning));

export { apiUsers };
