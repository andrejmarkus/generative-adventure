import { adventuresCollection } from '$lib/db/mongo';
import { ollama } from '$lib';
import { ObjectId } from 'mongodb';

export const POST = async ({ params }) => {
    const adventure = await adventuresCollection.findOne({ _id: new ObjectId(params.slug) });

    const response = await ollama.chat({
        model: 'llama3.2:latest',
        messages: adventure.messages,
        stream: true
    });

    const stream = new ReadableStream({
        async start(controller) {
            for await (const chunk of response) {
                controller.enqueue(chunk.message.content);
            }
            controller.close();
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream'
        }
    });
}