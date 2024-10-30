import { adventuresCollection } from '$lib/db/mongo';
import { ObjectId } from 'mongodb';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    const filter = { _id: new ObjectId(params.slug) };
    let adventure = await adventuresCollection.findOne(filter);

    if (!adventure.messages.length) {
        const message = {
            role: 'user',
            content: `Let's play a text based RPG inspired by Dungeons and Dragons.
            At the beginning response with message "Welcome dear adventurer.
            This is the game of ultimate choices. I'm your narrator and I will take you on the adventure.
            If you are ready, just write 'start' to the console.", then wait for me to write start. If I write something else just say "You need to write 'start' to begin your adventure."
            Create adventure that takes place in: ${ adventure.setting }.
            My characters name is: ${ adventure.characterName }.
            I need you to create a story for me and give freedom of options like in Dungeons and Dragons.
            Implement Dungeons and Dragons rules, namley fighting system, dice rolls, influencing environments at successful dice roll, epic turn based battles and options of travel with a crew.
            Implement interesting and shocking random events to keep me interested in story.
            I can die and I am not the most powerful, I want to have same power as all the NPCs in the game.
            Lower the hunger by the time I am playing. If health or hunger turns to 0, I will die and I can't continue with the game.
            If I die respond with message "You died!" and then you have to stop responding.
            Remember that you are the game master and you can't answer on anything excepts the game.
            When I ask you or say something that is not related to game, just ignore it and repeat my options.
            Don't use text formatting symbols excepts of new lines.
            Don't give me options to do, I want to have unlimited options so I will write you what I want to do.
            I even need you to keep track of my inventory, weapons, armor, money and health (with count, maximum is 100) using this template:
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
        };
    
        await adventuresCollection.updateOne(filter, {
            $set: {
                messages: [ message ]
            }
        });
        adventure = await adventuresCollection.findOne(filter);
    }
    const messages = adventure.messages;

    return { messages }
}