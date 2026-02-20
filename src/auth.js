import { SvelteKitAuth } from "@auth/sveltekit";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { client } from "$lib/server/db";
import Google from "@auth/sveltekit/providers/google";

export const { handle, signIn, signOut } = SvelteKitAuth({ 
    providers: [Google],
    adapter: MongoDBAdapter(client),
    trustHost: true,
    callbacks: {
        session: async ({ session, user }) => {
            if (session.user && user) {
                session.user.id = user.id;
            }
            return session;
        }
    }
});
