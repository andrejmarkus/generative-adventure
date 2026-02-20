import { updateAdventureMessages } from '$lib/server/services/adventureService';
import { json, error } from '@sveltejs/kit';

export const POST = async ({ request, params, locals }) => {
    const session = await locals.auth();
    if (!session?.user) throw error(401, "Unauthorized");

    const data = await request.json();
    const success = await updateAdventureMessages(
        params.slug, 
        session.user.id, 
        session.user.email, 
        data.messages
    );
    
    return json({ success });
}
