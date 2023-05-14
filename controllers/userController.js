const User = require("../models/User");
const Channel = require("../models/Channel");
const { userTokenPayload, createJWT } = require("../utils");

const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.userId, req.body, {
    new: true,
  });
  const tokenUser = userTokenPayload(user);
  const token = createJWT({ payload: tokenUser });

  res.status(200).json({ user, token });
};

const deleteAccount = async (req, res) => {
  const user = await User.findById(req.user.userId);
  const updatePromises = user?.channels?.map((channelId) =>
    Channel.findByIdAndUpdate(channelId, { $pull: { members: req.user.userId } })
  );

  await Promise.all(updatePromises);
  await user.remove();
  res.status(200).json("Account deleted successfully");
};

const getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
};

module.exports = {
  updateUser,
  deleteAccount,
  getUsers,
};