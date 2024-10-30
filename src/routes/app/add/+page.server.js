import { redirect } from '@sveltejs/kit';
import { adventuresCollection } from '$lib/db/mongo';
import { error } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, locals }) => {
        const session = await locals.auth();

        const data = await request.formData();
        const characterName = data.get("character-name");
        const name = data.get("name");
        const setting = data.get("setting");

        const result = await adventuresCollection.insertOne({
            userEmail: session.user.email,
            name: name,
            characterName: characterName,
            setting: setting,
            messages: []
        })

        if (!result.acknowledged) {
            error(404, {
                message: "Error while inserting document"
            });
        }

        redirect(302, "/app");
    }
}