import { MongoClient } from 'mongodb';
import { env } from '$env/dynamic/private';

// Only initialize if MONGODB_URI is present to avoid errors during build/analysis
// At build time, we use a placeholder to avoid throwing errors when the module is imported
const uri = env.MONGODB_URI || 'mongodb://localhost:27017/placeholder';
export const client = new MongoClient(uri);

// Use MONGODB_NAME if provided, or let it be determined by the URI/default
const dbName = env.MONGODB_NAME || undefined;
export const db = client.db(dbName);
export const adventuresCollection = db.collection('adventures');

export async function connect() {
	// Only attempt to connect if we have a real URI
	if (!env.MONGODB_URI) {
		console.warn('MONGODB_URI not defined, skipping connection (likely during build/analysis)');
		return;
	}
	await client.connect();
}

export async function disconnect() {
	await client.disconnect();
}
