const {
  createQuestion: createQuestionService,
  getAllQuestions,
  toggleQuestionCompletion: toggleQuestionCompletionService,
} = require("../services/questionService");

async function getQuestions(req, res) {
  try {
    const questions = await getAllQuestions();
    return res.json(questions);
  } catch (error) {
    console.error("Fetch questions error:", error.message);
    return res.status(500).json({ message: "Could not load questions." });
  }
}

async function createQuestion(req, res) {
  try {
    const createdQuestion = await createQuestionService(req.body);
    return res.status(201).json(createdQuestion);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Create question error:", error.message);
    return res
      .status(statusCode)
      .json({ message: error.message || "Could not add question." });
  }
}

async function toggleQuestionCompletion(req, res) {
  try {
    const populatedQuestion = await toggleQuestionCompletionService({
      questionId: req.params.questionId,
      userId: req.body.userId,
    });

    return res.json(populatedQuestion);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Toggle question error:", error.message);
    return res
      .status(statusCode)
      .json({ message: error.message || "Could not update question." });
  }
}

module.exports = {
  createQuestion,
  getQuestions,
  toggleQuestionCompletion,
};
