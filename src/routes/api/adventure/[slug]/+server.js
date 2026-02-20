import { updateAdventureMessages } from '$lib/server/services/adventureService';
import { json, error } from '@sveltejs/kit';

export const POST = async ({ request, params, locals }) => {
	try {
		const session = await locals.auth();
		if (!session?.user) throw error(401, 'Unauthorized');

		// Validate Hex ID
		if (!params.slug || !/^[0-9a-fA-F]{24}$/.test(params.slug)) {
			throw error(400, 'Invalid Adventure ID format');
		}

		const data = await request.json();
		const success = await updateAdventureMessages(
			params.slug,
			session.user.id,
			session.user.email,
			data.messages
		);

		return json({ success });
	} catch (err) {
		console.error('Update database error:', err);
		if (err.status && err.body) throw err;
		throw error(500, err.message || 'Internal Server Error');
	}
};
