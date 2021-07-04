const {User} = require('../../models/user');
const userOnline = async (uid, socket) => {
  try {
    const user = await User.updateOne(
        {_id: uid},
        {
          $set: {
            status: true,
            latestActivity: new Date().toISOString(),
            socket_id: socket,
          },
        },
    );
    return user;
  } catch (error) {
    return error;
  }
};
const userOffline = async (socket) => {
  try {
    const user = await User.updateOne(
        {socket_id: socket},
        {
          $set: {
            status: false,
            socket_id: null,
            latestActivity: new Date().toISOString(),
          },
        },
    );
    return user;
  } catch (error) {
    return error;
  }
};

module.exports = {
  userOnline: userOnline,
  userOffline: userOffline,
};
