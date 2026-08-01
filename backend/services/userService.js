const User = require("../models/User");

async function loginOrCreateUser({ name, username }) {
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return existingUser;
  }

  return User.create({ name, username });
}

async function getAllUsers() {
  return User.find().sort({ createdAt: 1 });
}

module.exports = {
  getAllUsers,
  loginOrCreateUser,
};
