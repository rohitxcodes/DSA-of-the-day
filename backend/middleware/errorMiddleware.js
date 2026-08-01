function notFoundHandler(req, res) {
  res.status(404).json({ message: "Route not found." });
}

function errorHandler(err, req, res, next) {
  console.error("Unhandled server error:", err.message);
  res.status(500).json({ message: "Internal server error." });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
