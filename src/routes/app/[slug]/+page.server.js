import { getAdventureById, updateAdventureMessages } from '$lib/server/services/adventureService';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const adventure = await getAdventureById(params.slug);
    if (!adventure) throw error(404, "Timeline not found");

    // Migration logic for old adventures without messages
    if (!adventure.messages || !adventure.messages.length) {
        // Since createAdventure now handles this, this is just for safety.
        // We could call updateAdventureMessages with default messages here if needed,
        // but for now let's just assume new ones are correct.
    }

    return { 
        adventure,
        messages: adventure.messages || []
    };
}