import { getAdventureById, updateAdventureMessages } from '$lib/server/services/adventureService';
import { error } from '@sveltejs/kit';

export async function load({ params, locals }) {
	const session = await locals.auth();
	if (!session?.user) throw error(401, 'Unauthorized');

	const adventure = await getAdventureById(params.slug);
	if (!adventure) throw error(404, 'Timeline not found');

	// Check ownership
	const isOwner =
		(adventure.userId && adventure.userId === session.user.id) ||
		(adventure.userEmail && adventure.userEmail === session.user.email);

	// For legacy adventures without userId/userEmail, we might want to allow it?
	// But since they were always supposed to have userEmail, let's keep it tight.
	if (!isOwner) throw error(403, "Forbidden: You don't own this timeline");

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
