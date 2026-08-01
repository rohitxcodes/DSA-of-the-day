import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const globalForMongoose = globalThis;

if (!globalForMongoose.__mongooseCache) {
  globalForMongoose.__mongooseCache = { conn: null, promise: null };
}

const cache = globalForMongoose.__mongooseCache;

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
