import http from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const PORT = 3000;

function loadLocalEnv() {
  if (process.env.MONGODB_URI) {
    return;
  }

  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) {
    return;
  }

  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmedLine.indexOf("=");
    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, equalsIndex).trim();
    const value = trimmedLine.slice(equalsIndex + 1).trim();

    if (key === "MONGODB_URI" && value) {
      process.env.MONGODB_URI = value;
      break;
    }
  }
}

loadLocalEnv();

const [
  { default: usersHandler },
  { default: questionsHandler },
  { default: toggleCompletionHandler },
] = await Promise.all([
  import("./api/users.js"),
  import("./api/questions.js"),
  import("./api/toggle-completion.js"),
]);

function createResponse(nodeResponse) {
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  return {
    setHeader(name, value) {
      headers[name] = value;
    },
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      nodeResponse.writeHead(statusCode, headers);
      nodeResponse.end(JSON.stringify(payload));
    },
  };
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

const server = http.createServer(async (request, response) => {
  if (!request.url) {
    response.writeHead(400, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Missing request URL" }));
    return;
  }

  if (!request.url.startsWith("/api/")) {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  try {
    const body = request.method === "POST" ? await readJsonBody(request) : {};
    const handlerRequest = {
      method: request.method,
      body,
      headers: request.headers,
      url: request.url,
    };

    const handlerResponse = createResponse(response);

    if (request.url === "/api/users") {
      await usersHandler(handlerRequest, handlerResponse);
      return;
    }

    if (request.url === "/api/questions") {
      await questionsHandler(handlerRequest, handlerResponse);
      return;
    }

    if (request.url === "/api/toggle-completion") {
      await toggleCompletionHandler(handlerRequest, handlerResponse);
      return;
    }

    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Not found" }));
  } catch (error) {
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({ error: error.message || "Internal server error" }),
    );
  }
});

server.listen(PORT, () => {
  console.log(`Local API server running at http://localhost:${PORT}`);
});
