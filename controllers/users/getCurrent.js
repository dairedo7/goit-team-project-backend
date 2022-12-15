// const { User } = require('../../models');

export const getCurrent = async ({ user }, res) => {
  res.json({
    status: 'success',
    code: 200,
    data: {
      user,
    },
  });
};
