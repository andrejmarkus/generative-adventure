import { ObjectId } from 'mongodb';
import { adventuresCollection } from '$lib/server/db';

export async function getAdventuresForUser(userId, userEmail) {
    const query = { $or: [] };
    if (userId) query.$or.push({ userId });
    if (userEmail) query.$or.push({ userEmail });
    
    // If neither is provided, return empty
    if (query.$or.length === 0) return [];

    const result = await adventuresCollection.find(query).toArray();
    return result.map(adventure => ({
        ...adventure,
        _id: adventure._id.toString()
    }));
}

export async function getAdventureById(id) {
    const adventure = await adventuresCollection.findOne({ _id: new ObjectId(id) });
    if (adventure) {
        adventure._id = adventure._id.toString();
    }
    return adventure;
}

export async function createAdventure(userId, userEmail, { name, characterName, setting }) {
    const defaultMessages = [
        {
            role: 'system',
            content: `You are a text based RPG narrator inspired by Dungeons and Dragons.
            Create adventure that takes place in: ${setting}.
            The player's character name is: ${characterName}.
            I need you to create a story and give freedom of options like in Dungeons and Dragons.
            Implement Dungeons and Dragons rules, namely fighting system, dice rolls, influencing environments at successful dice roll, epic turn based battles and options of travel with a crew.
            Implement interesting and shocking random events to keep me interested in story.
            The player can die and is not the most powerful, they have same power as all the NPCs in the game.
            Lower the hunger by the time the player is playing. If health or hunger turns to 0, they will die and can't continue with the game.
            If they die respond with message "You died!" and then you have to stop responding.
            Remember that you are the game master and you can't answer on anything except the game.
            When the player asks you or says something that is not related to game, just ignore it and repeat options.
            Don't use text formatting symbols except of new lines.
            Don't give the player options to do, they want to have unlimited options so they will decide what they want to do.
            You MUST keep track of the player's inventory, weapons, armor, money and health (with count, maximum is 100) using this template:
            The template for stats is this, please WRITE IT after EVERY response (text in square brackets marks part that you can overwrite with things in brackets): 
            "
            INVENTORY:
            [ items ]
            WEAPONS/ARMOR:
            [ weapon + stat ]
            [ armor + stat ]
            STATS:
            [ Health: health,
            Hunger: hunger
            Money: money$ ]
            "
            `
        },
        {
            role: "user",
            content: "Welcome me to the game of ultimate choices. Narrate a very brief intro and tell me to write 'start' to begin the adventure."
        }
    ];

    const result = await adventuresCollection.insertOne({
        userId,
        userEmail,
        name,
        characterName,
        setting,
        messages: defaultMessages,
        createdAt: new Date()
    });

    return result.acknowledged ? result.insertedId.toString() : null;
}

export async function updateAdventureMessages(id, userId, userEmail, messages) {
    const filter = { 
        _id: new ObjectId(id),
        $or: []
    };
    if (userId) filter.$or.push({ userId });
    if (userEmail) filter.$or.push({ userEmail });

    if (filter.$or.length === 0) return false;

    const adventure = await adventuresCollection.findOne(filter);
    if (!adventure) return false;

    // Protect the system prompt and initial intro.
    const protectedMessages = adventure.messages.slice(0, 2);
    const updatedMessages = [...protectedMessages, ...messages.slice(2)];

    const result = await adventuresCollection.updateOne(filter, {
        $set: { messages: updatedMessages, updatedAt: new Date() }
    });

    return result.acknowledged;
}

export async function deleteAdventure(id, userId, userEmail) {
    const filter = { 
        _id: new ObjectId(id),
        $or: []
    };
    if (userId) filter.$or.push({ userId });
    if (userEmail) filter.$or.push({ userEmail });

    // If neither is provided, then it's effectively protected from deletion
    if (filter.$or.length === 0) return false;

    const result = await adventuresCollection.deleteOne(filter);
    return result.acknowledged && result.deletedCount > 0;
}
