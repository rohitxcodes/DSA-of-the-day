import { connectToDatabase } from "./_lib/db.js";
import User from "./_models/User.js";

export default async function handler(request, response) {
  await connectToDatabase();

  if (request.method === "GET") {
    const users = await User.find().sort({ createdAt: 1 }).lean();
    response.status(200).json(users);
    return;
  }

  if (request.method === "POST") {
    const { name, username } = request.body || {};
    const trimmedName = String(name || "").trim();
    const normalizedUsername = String(username || "")
      .trim()
      .toLowerCase();

    if (!trimmedName || !normalizedUsername) {
      response.status(400).json({ error: "Name and username are required." });
      return;
    }

    const user = await User.findOneAndUpdate(
      { username: normalizedUsername },
      {
        $setOnInsert: {
          name: trimmedName,
          username: normalizedUsername,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    ).lean();

    response.status(200).json(user);
    return;
  }

  response.setHeader("Allow", ["GET", "POST"]);
  response.status(405).json({ error: "Method not allowed" });
}
