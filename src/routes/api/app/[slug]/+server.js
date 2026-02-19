import { adventuresCollection } from '$lib/db/mongo';
import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const POST = async ({ request, params }) => {
    const filter = { _id: new ObjectId(params.slug) };

    const data = await request.json();
    const messages = data.messages;

    const existing = await adventuresCollection.findOne(filter);
    // Protect the system prompt and initial intro from being changed by the client.
    const protectedMessages = existing.messages.slice(0, 2);
    const updatedMessages = [...protectedMessages, ...messages.slice(2)];

    await adventuresCollection.updateOne(filter, {
        $set: {
            messages: updatedMessages
        }
    });

    return json({ success: true });
}