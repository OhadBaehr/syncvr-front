// lib/mongodb.ts
import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI as string;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME as string;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!MONGODB_DB_NAME) {
    throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const client = new MongoClient(MONGODB_URI);

    await client.connect();
    const db = client.db(MONGODB_DB_NAME);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
}
