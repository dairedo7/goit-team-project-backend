const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { SECRET_KEY } = process.env;

const googleSignin = async (req, res, next) => {
  try {
    const token = req.params.token;

    if (!token) {
      return res.status(400).json({
        code: 400,
        message: 'Not found token',
      });
    }
    const user = await User.findOne({ token });
    console.log(user);
    if (!user) {
      return res.status(401).json({
        message: 'Wrong token!',
      });
    }

    const payload = {
      id: user._id,
    };
    const newToken = jwt.sign(payload, SECRET_KEY, {
      expiresIn: '12h',
    });

    await User.findByIdAndUpdate(user._id, { newToken });

    return res.status(200).json({
      status: 'success',
      data: {
        token,
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = googleSignin;
