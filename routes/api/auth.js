import express from 'express';
import { signUp, signIn, signOut, googleSignin, googleAuth, googleRedirect } from '../../controllers/index.js';
import { validation, wrapper, auth } from '../../middlewares/index.js';
import { joiLoginSchema, joiUserSchema } from '../../models/index.js';

const authRouter = express.Router();

authRouter.post('/signup', validation(joiUserSchema), wrapper(signUp));

authRouter.post('/signin', validation(joiLoginSchema), wrapper(signIn));

authRouter.get('/signout', auth, wrapper(signOut));

authRouter.get('/google', wrapper(googleAuth));
authRouter.get('/google-redirect', wrapper(googleRedirect));
authRouter.get('/google-signin', wrapper(googleSignin));

export { authRouter };
