import { MongoClient } from "mongodb";

export const client = new MongoClient(import.meta.env.VITE_MONGO_CONNECTION_STRING);
export const db = client.db(import.meta.env.VITE_MONGO_DATABASE_NAME);

export async function connect() {
    await client.connect();
}

export async function disconnect() {
    await client.disconnect();
}