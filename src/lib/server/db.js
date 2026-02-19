import { MongoClient } from "mongodb";
import { env } from '$env/dynamic/private'

export const client = new MongoClient(env.MONGODB_URI);
export const db = client.db(env.MONGODB_NAME);
export const adventuresCollection = db.collection('adventures');

export async function connect() {
    await client.connect();
}

export async function disconnect() {
    await client.disconnect();
}