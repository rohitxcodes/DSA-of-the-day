# Question of the Day / DSA Question Tracker

Minimal black-and-white React + Vite app with Vercel Serverless Functions and MongoDB Atlas.

## Structure

- `frontend/` holds the React app source.
- `backend/` holds the Node.js serverless handlers, models, and local API server.
- Root `src/` and `api/` contain thin wrappers so Vercel and Vite still work from the project root.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Set `MONGODB_URI`.
3. Install dependencies with `npm install`.
4. Run the frontend with `npm run dev`.
5. Run the local API server with `npm run dev:api`.
6. Deploy to Vercel with the same `MONGODB_URI` environment variable set in project settings.

## Stack

- React
- Vite
- Vanilla CSS
- JavaScript
- Vercel Serverless Functions
- MongoDB Atlas
- Mongoose
