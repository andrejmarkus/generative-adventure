import { updateAdventureMessages } from '$lib/server/services/adventureService';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, params }) => {
    const data = await request.json();
    const success = await updateAdventureMessages(params.slug, data.messages);
    
    return json({ success });
}
