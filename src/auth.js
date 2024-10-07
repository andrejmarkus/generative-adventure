import { SvelteKitAuth } from "@auth/sveltekit";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { client } from "$lib/db/mongo";

export const { handle, signIn, signOut } = SvelteKitAuth({
    adapter: MongoDBAdapter(client)
})