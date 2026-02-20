import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const session = await event.locals.auth();
	if (session?.user) throw redirect(302, '/app');
	return {};
};
