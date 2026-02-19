import { getAdventureById } from '$lib/server/services/adventureService';
import { streamChat } from '$lib/server/services/aiService';
import { error } from '@sveltejs/kit';

export const POST = async ({ params }) => {
    const adventure = await getAdventureById(params.slug);
    if (!adventure) throw error(404, "Timeline not found");

    const stream = await streamChat(adventure.messages);

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream'
        }
    });
}
