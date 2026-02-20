import { getAdventureById } from '$lib/server/services/adventureService';
import { streamChat } from '$lib/server/services/aiService';
import { error } from '@sveltejs/kit';

export const POST = async ({ params, locals }) => {
	const session = await locals.auth();
	if (!session?.user) throw error(401, 'Unauthorized');

	const adventure = await getAdventureById(params.slug);
	if (!adventure) throw error(404, 'Timeline not found');

	// Check ownership
	const isOwner =
		(adventure.userId && adventure.userId === session.user.id) ||
		(adventure.userEmail && adventure.userEmail === session.user.email);

	if (!isOwner) throw error(403, "Forbidden: You don't own this timeline");

	const stream = await streamChat(adventure.messages);

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
};
