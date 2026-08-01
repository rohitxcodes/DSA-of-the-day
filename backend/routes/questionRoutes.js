const express = require("express");

const {
  getQuestions,
  createQuestion,
  toggleQuestionCompletion,
} = require("../controllers/questionController");
const {
  validateQuestionPayload,
  validateTogglePayload,
} = require("../middleware/requestValidation");

const router = express.Router();

router.get("/", getQuestions);
router.post("/", validateQuestionPayload, createQuestion);
router.patch(
  "/:questionId/toggle",
  validateTogglePayload,
  toggleQuestionCompletion,
);

module.exports = router;
