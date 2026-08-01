function validateUserLogin(req, res, next) {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const username =
    typeof req.body.username === "string" ? req.body.username.trim() : "";

  if (!name || !username) {
    return res.status(400).json({ message: "Name and username are required." });
  }

  req.body.name = name;
  req.body.username = username.toLowerCase();
  next();
}

function validateQuestionPayload(req, res, next) {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const link = typeof req.body.link === "string" ? req.body.link.trim() : "";

  if (!title || !link) {
    return res.status(400).json({ message: "Title and link are required." });
  }

  req.body.title = title;
  req.body.link = link;
  next();
}

function validateTogglePayload(req, res, next) {
  const userId =
    typeof req.body.userId === "string" ? req.body.userId.trim() : "";

  if (!userId) {
    return res.status(400).json({ message: "User id is required." });
  }

  req.body.userId = userId;
  next();
}

module.exports = {
  validateQuestionPayload,
  validateTogglePayload,
  validateUserLogin,
};
