import dns from 'node:dns';
import mongoose from 'mongoose';

// Fix for Windows / local environment DNS lookup issues with mongodb+srv SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  if (typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch {
  // Ignore in restricted environments
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Global cache to prevent multiple connections during Next.js hot-reloads in development.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB with connection caching and retry logic.
 */
async function dbConnect(retries = 3, delay = 1000): Promise<typeof mongoose> {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4, prevents ECONNREFUSED on Windows
    };

    cached.promise = (async () => {
      let lastError: unknown;
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const m = await mongoose.connect(MONGODB_URI!, opts);
          return m;
        } catch (error) {
          lastError = error;
          console.warn(`[MongoDB] Connection attempt ${attempt}/${retries} failed:`, (error as Error).message);
          if (attempt < retries) {
            await new Promise((resolve) => setTimeout(resolve, delay * attempt));
          }
        }
      }
      throw lastError;
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
