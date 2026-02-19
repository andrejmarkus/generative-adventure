import { adventuresCollection } from '$lib/db/mongo';
import { ObjectId } from 'mongodb';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    const filter = { _id: new ObjectId(params.slug) };
    let adventure = await adventuresCollection.findOne(filter);

    if (!adventure.messages.length) {
        const messages = [
            {
                role: 'system',
                content: `You are a text based RPG narrator inspired by Dungeons and Dragons.
                Create adventure that takes place in: ${ adventure.setting }.
                The player's character name is: ${ adventure.characterName }.
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
    
        await adventuresCollection.updateOne(filter, {
            $set: {
                messages: messages
            }
        });
        adventure = await adventuresCollection.findOne(filter);
    }
    const messages = adventure.messages;

    return { messages }
}