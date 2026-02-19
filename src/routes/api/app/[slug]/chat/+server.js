import { adventuresCollection } from '$lib/db/mongo';
import { ai } from '$lib';
import { ObjectId } from 'mongodb';

export const POST = async ({ request, params }) => {
    const adventure = await adventuresCollection.findOne({ _id: new ObjectId(params.slug) });
    const data = await request.json();
    const messages = data.messages;

    // Ensure the storyteller rules (system prompt) are ALWAYS present
    // even if the client tries to omit them.
    const systemPrompt = adventure.messages[0];
    const welcomeIntro = adventure.messages[1];

    // Build the history for AI, ensuring rules come first
    const fullMessages = [
        systemPrompt,
        welcomeIntro,
        ...messages.slice(2)
    ];

    const completion = await ai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: fullMessages,
        stream: true,
        temperature: 0.8
    });

    const stream = new ReadableStream({
        async start(controller) {
            for await (const chunk of completion) {
                const content = chunk.choices[0]?.delta?.content || "";
                if (content) {
                    controller.enqueue(content);
                }
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
