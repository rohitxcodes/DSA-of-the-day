const { getAllUsers, loginOrCreateUser } = require("../services/userService");

async function loginUser(req, res) {
  try {
    const user = await loginOrCreateUser(req.body);
    return res.status(200).json(user);
  } catch (error) {
    if (error.code === 11000) {
      const duplicateUser = await loginOrCreateUser(req.body);

      if (duplicateUser) {
        return res.status(200).json(duplicateUser);
      }
    }

    console.error("User login error:", error.message);
    return res.status(500).json({ message: "Could not log in user." });
  }
}

async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    return res.json(users);
  } catch (error) {
    console.error("Fetch users error:", error.message);
    return res.status(500).json({ message: "Could not load users." });
  }
}

module.exports = {
  getUsers,
  loginUser,
};
