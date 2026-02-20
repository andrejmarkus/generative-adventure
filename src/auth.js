import { SvelteKitAuth } from "@auth/sveltekit";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { client } from "$lib/server/db";
import Google from "@auth/sveltekit/providers/google";

export const { handle, signIn, signOut } = SvelteKitAuth({ 
    providers: [Google],
    adapter: MongoDBAdapter(client),
    trustHost: true
});