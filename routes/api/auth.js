const express = require('express');
const { signUp, signIn, signOut, googleSignin, googleAuth, googleRedirect } = require('../../controllers');
const { validation, wrapper, auth } = require('../../middlewares');

const { joiLoginSchema, joiUserSchema } = require('../../models');

const router = express.Router();

router.post('/signup', validation(joiUserSchema), wrapper(signUp));

router.post('/signin', validation(joiLoginSchema), wrapper(signIn));

router.get('/signout', auth, wrapper(signOut));

router.get('/google', wrapper(googleAuth));
router.get('/google-redirect', wrapper(googleRedirect));
router.get('/google-signin', wrapper(googleSignin));

module.exports = router;

// const express = require('express');
// const passport = require('passport');
// const { signUp, signIn, signOut, googleSignin } = require('../../controllers');
// const { validation, wrapper, auth } = require('../../middlewares');
// const jwt = require('jsonwebtoken');
// const { FRONTEND_URL, SECRET_KEY } = process.env;

// require('../../controllers/auth/auth');

// const { joiLoginSchema, joiUserSchema } = require('../../models');

// const router = express.Router();

// // Google OAuth routes
// router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// router.get(
//   '/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: '/failure',
//     session: false,
//   }),
//   (req, res) => {
//     // Custom redirect logic after successful authentication
//     const payload = {
//       id: req.user._id,
//     };
//     const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '30d' });
//     console.log('FRONTEND_URL', FRONTEND_URL);
//     console.log('TOKEN', token);
//     const redirectURL = `${process.env.FRONTEND_URL}?token=${token}`;
//     console.log('REDIRECT URL', redirectURL);

//     res.redirect(redirectURL);
//   }
// );

// router.get('/failure', (req, res) => {
//   res.send('Something went wrong');
// });

// // Other routes
// router.post('/signup', validation(joiUserSchema), wrapper(signUp));

// router.post('/signin', validation(joiLoginSchema), wrapper(signIn));

// router.get('/signout', auth, wrapper(signOut));

// router.get('/google-signin', wrapper(googleSignin));

// module.exports = router;
