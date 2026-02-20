import { deleteAdventure } from '$lib/server/services/adventureService';
import { json, error } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session?.user) throw error(401, "Unauthorized");

    const { adventureId } = await request.json();
    const success = await deleteAdventure(adventureId, session.user.id, session.user.email);

    if (!success) {
        throw error(400, "Failed to delete timeline");
    }

    return json({ success: true });
}