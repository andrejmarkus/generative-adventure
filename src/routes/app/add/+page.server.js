import { redirect, fail } from '@sveltejs/kit';
import { createAdventure } from '$lib/server/services/adventureService';
import { adventureSchema } from '$lib/server/schemas';

export const actions = {
	default: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user) return fail(401, { message: 'Unauthorized' });

		const formData = await request.formData();
		const data = {
			characterName: formData.get('character-name'),
			characterClass: formData.get('character-class'),
			name: formData.get('name'),
			setting: formData.get('setting')
		};

		const result = adventureSchema.safeParse(data);
		if (!result.success) {
			return fail(400, {
				errors: result.error.flatten().fieldErrors,
				data
			});
		}

		const adventureId = await createAdventure(session.user.id, session.user.email, result.data);

		if (!adventureId) {
			return fail(500, { message: 'Database Error: Timeline initialization failed' });
		}

		redirect(302, '/app/' + adventureId);
	}
};
