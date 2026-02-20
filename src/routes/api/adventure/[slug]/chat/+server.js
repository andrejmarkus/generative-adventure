// Chat API - Generative Adventure
import { error } from '@sveltejs/kit';
import { getAdventureById } from '$lib/server/services/adventureService';
import { streamChat } from '$lib/server/services/aiService';

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request, params, locals }) => {
	try {
		const session = await locals.auth();
		if (!session?.user) throw error(401, 'Unauthorized');

		// Validate Hex ID
		if (!params.slug || !/^[0-9a-fA-F]{24}$/.test(params.slug)) {
			throw error(400, 'Invalid Adventure ID format');
		}

		const adventure = await getAdventureById(params.slug);
		if (!adventure) throw error(404, 'Timeline not found');

		const isOwner =
			(adventure.userId && adventure.userId === session.user.id) ||
			(adventure.userEmail && adventure.userEmail === session.user.email);

		if (!isOwner) throw error(403, "Forbidden");

		const currentStats = adventure.stats || {};
		if (currentStats.health <= 0 || currentStats.hunger <= 0) {
			throw error(400, 'Game Over');
		}

		const data = await request.json();
		const clientMessages = data.messages || [];

		const systemPrompt = adventure.messages[0];
		const userIntro = adventure.messages[1];

		const fullMessages = [systemPrompt, userIntro, ...clientMessages.slice(2)];

		const stream = await streamChat(fullMessages, adventure.recap || '');

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream'
			}
		});
	} catch (err) {
		console.error('Chat API error:', err);
		// If it's already a SvelteKit error, rethrow it
		if (err.status && err.body) throw err;
		throw error(500, err.message || 'Failed to process command');
	}
};
