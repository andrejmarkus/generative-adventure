import { adventuresCollection } from '$lib/db/mongo';
import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const POST = async ({ request, params }) => {
    const filter = { _id: new ObjectId(params.slug) };

    const data = await request.json();
    const messages = data.messages;

    await adventuresCollection.updateOne(filter, {
        $set: {
            messages: messages
        }
    });

    return json({ success: true });
}