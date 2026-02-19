import { ai } from '$lib/server/ai';

export async function streamChat(messages) {
    const completion = await ai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages,
        stream: true,
        temperature: 0.8
    });

    return new ReadableStream({
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
}
