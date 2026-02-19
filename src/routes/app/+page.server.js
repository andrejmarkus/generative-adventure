import { getAdventuresForUser } from '$lib/server/services/adventureService';

export const load = async ({ locals }) => {
    const session = await locals.auth();
    if (!session?.user) return { adventures: [] };

    const adventures = await getAdventuresForUser(session.user.email);
    return { adventures };
};
