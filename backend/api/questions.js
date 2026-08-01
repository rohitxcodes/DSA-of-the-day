import { connectToDatabase } from "./_lib/db.js";
import Question from "./_models/Question.js";

export default async function handler(request, response) {
  await connectToDatabase();

  if (request.method === "GET") {
    const questions = await Question.find().sort({ createdAt: -1 }).lean();
    response.status(200).json(questions);
    return;
  }

  if (request.method === "POST") {
    const { title, link } = request.body || {};
    const trimmedTitle = String(title || "").trim();
    const trimmedLink = String(link || "").trim();

    if (!trimmedTitle || !trimmedLink) {
      response.status(400).json({ error: "Title and link are required." });
      return;
    }

    const question = await Question.create({
      title: trimmedTitle,
      link: trimmedLink,
      completedBy: [],
    });

    response.status(201).json(question.toObject());
    return;
  }

  response.setHeader("Allow", ["GET", "POST"]);
  response.status(405).json({ error: "Method not allowed" });
}
