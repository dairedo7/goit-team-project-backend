import { requestError } from '../../helpers/requestError.js';

export const removePlanning = async (req, res) => {
  const { planningId: id } = req.params;
  const user = req.user;
  user.planning = [];
  user.save();

  if (!id) {
    throw requestError(404, 'Not found');
  }

  res.json({
    message: 'Planning has been deleted',
  });
};
