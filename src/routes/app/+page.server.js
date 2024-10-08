import { adventuresCollection } from '../../lib/db/mongo';

export const load = async (event) => {
    const session = await event.locals.auth();
    const result = await adventuresCollection.find({ userEmail: session.user.email }).toArray();
    
    const adventures = result.map(adventure => ({
        ...adventure,
        _id: adventure._id.toString()
    }));

    return { adventures }
}