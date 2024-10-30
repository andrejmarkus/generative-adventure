import { ollama } from '$lib';

export const POST = async ({ request }) => {
    const data = await request.json();
    const messages = data.messages;

    const response = await ollama.chat({
        model: 'llama3.2:latest',
        messages: messages,
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