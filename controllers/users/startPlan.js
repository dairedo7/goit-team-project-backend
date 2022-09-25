const {User} = require('../../models/user');

const startPlan = async (req, res) => {
  const date = new Date();
  const lastDay = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastDay.getMonth() - 1));

  try {
    const incomeDay = await User.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          day: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(incomeDay);
  } catch (err) {
    res.status(500).json(err);
  }
  }

  module.exports = startPlan;
