import { adventuresCollection } from '$lib/db/mongo.js';
import { ObjectId } from 'mongodb';

export const POST = async({ request }) => {
    const { adventureId } = await request.json();

    const result = await adventuresCollection.deleteOne({ _id: new ObjectId(adventureId) });

    return new Response("302");
}