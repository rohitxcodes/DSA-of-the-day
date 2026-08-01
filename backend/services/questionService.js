const mongoose = require("mongoose");

const Question = require("../models/Question");
const User = require("../models/User");

function isValidHttpUrl(value) {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
}

async function populateQuestion(questionId) {
  return Question.findById(questionId).populate("completedBy", "name username");
}

async function getAllQuestions() {
  return Question.find()
    .sort({ createdAt: -1 })
    .populate("completedBy", "name username");
}

async function createQuestion({ title, link }) {
  if (!isValidHttpUrl(link)) {
    const error = new Error("Question link must be a valid URL.");
    error.statusCode = 400;
    throw error;
  }

  const createdQuestion = await Question.create({ title, link });
  return populateQuestion(createdQuestion._id);
}

async function toggleQuestionCompletion({ questionId, userId }) {
  if (
    !mongoose.isValidObjectId(questionId) ||
    !mongoose.isValidObjectId(userId)
  ) {
    const error = new Error("Invalid question or user id.");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  const question = await Question.findById(questionId);

  if (!question) {
    const error = new Error("Question not found.");
    error.statusCode = 404;
    throw error;
  }

  const isCompleted = question.completedBy.some(
    (completedUserId) => completedUserId.toString() === userId,
  );

  if (isCompleted) {
    question.completedBy.pull(userId);
  } else {
    question.completedBy.addToSet(userId);
  }

  await question.save();

  return populateQuestion(question._id);
}

module.exports = {
  createQuestion,
  getAllQuestions,
  toggleQuestionCompletion,
};
