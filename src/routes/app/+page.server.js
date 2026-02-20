import { getAdventuresForUser } from '$lib/server/services/adventureService';

export const load = async ({ locals }) => {
    const session = await locals.auth();
    if (!session?.user) return { adventures: [] };

    // We use the ID if available, otherwise the email.
    // The service supports both via the $or query.
    const adventures = await getAdventuresForUser(session.user.id, session.user.email);
    return { adventures };
};
