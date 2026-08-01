import { connectToDatabase } from "./_lib/db.js";
import Question from "./_models/Question.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", ["POST"]);
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  await connectToDatabase();

  const { questionId, userId } = request.body || {};

  if (!questionId || !userId) {
    response.status(400).json({ error: "questionId and userId are required." });
    return;
  }

  const question = await Question.findById(questionId);

  if (!question) {
    response.status(404).json({ error: "Question not found." });
    return;
  }

  const hasUser = question.completedBy.some(
    (existingUserId) => String(existingUserId) === String(userId),
  );

  if (hasUser) {
    question.completedBy = question.completedBy.filter(
      (existingUserId) => String(existingUserId) !== String(userId),
    );
  } else {
    question.completedBy.push(userId);
  }

  await question.save();
  response.status(200).json(question.toObject());
}
