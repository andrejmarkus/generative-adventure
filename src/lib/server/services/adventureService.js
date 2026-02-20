import { ObjectId } from 'mongodb';
import { adventuresCollection } from '$lib/server/db';
import { extractStats, summarizeAdventure } from './aiService';

const MAX_MESSAGES_DB = 100;

export async function getAdventuresForUser(userId, userEmail) {
	const query = { $or: [] };
	if (userId) query.$or.push({ userId });
	if (userEmail) query.$or.push({ userEmail });

	// If neither is provided, return empty
	if (query.$or.length === 0) return [];

	const result = await adventuresCollection.find(query).toArray();
	return result.map((adventure) => ({
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

export async function createAdventure(
	userId,
	userEmail,
	{ name, characterName, setting, characterClass }
) {
	const defaultMessages = [
		{
			role: 'system',
			content: `You are a text based RPG narrator that can create adventures in ANY setting or genre.
            Create adventure that takes place in: ${setting}.
            The player's character name is: ${characterName}.
            ${characterClass ? `The player's character archetype/role is: ${characterClass}.` : 'Determine an appropriate character archetype based on the setting and story.'}
            I need you to create a story and give freedom of options like in Dungeons and Dragons.
            Adapt your rules and mechanics to fit the setting - for example:
            - In fantasy settings: use magic, combat, quests
            - In cyberpunk: use hacking, corporations, technology
            - In modern/real life: use social skills, investigation, everyday challenges
            - In sci-fi: use technology, space travel, alien encounters
            - In historical: use period-appropriate technology and social norms
            Implement interesting and shocking random events to keep me interested in story.
            The player can die and is not the most powerful, they have same power as all the NPCs in the game.
            Lower the hunger by 5-15 points per major action (travel, combat, exploration). Health decreases only during combat or dangerous situations.
            Players can recover health by resting (specify "rest" or "sleep") and hunger by eating food from inventory.
            Implement progressive difficulty - as the adventure continues, encounters become more challenging.
            Add random events every 3-5 player actions to keep the story dynamic and surprising.
            Include environmental storytelling - describe weather, time of day, and how they affect the adventure.
            Create memorable NPCs with distinct personalities, motivations, and backstories.
            Allow players to form alliances, make deals, and influence the world around them.
            Include moral choices that affect the story outcome and NPC relationships.
            If they die, respond with "GAME OVER:" followed by a beautiful, dramatic description of their final moments, then stop responding completely. Do not provide any further game content after death.
            Remember that you are the game master and you can't answer on anything except the game.
            The player cannot predict the future - you are the narrator and control all outcomes. Players can only make decisions in the present moment.
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
			role: 'user',
			content:
				"Welcome me to the game of ultimate choices. Narrate a very brief intro and tell me to write 'start' to begin the adventure."
		}
	];

	const result = await adventuresCollection.insertOne({
		userId,
		userEmail,
		name,
		characterName,
		characterClass,
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
	let updatedMessages = [...protectedMessages, ...messages.slice(2)];

	// CAP DATABASE DOCUMENT SIZE:
	// Only store the most recent messages up to MAX_MESSAGES_DB
	// to prevent the MongoDB document from growing indefinitely.
	if (updatedMessages.length > MAX_MESSAGES_DB) {
		const recentMessages = updatedMessages.slice(-(MAX_MESSAGES_DB - 2));
		updatedMessages = [...protectedMessages, ...recentMessages];
	}

	// Parse stats from the last message if it's from the assistant
	let latestStats = adventure.stats || {};
	const lastMessage = updatedMessages[updatedMessages.length - 1];
	if (lastMessage && lastMessage.role === 'assistant') {
		latestStats = extractStats(lastMessage.content);
	}

	// Story Recap / Infinite Memory logic:
	// If the number of messages grows large (e.g., > 40),
	// we generate a new recap to maintain context in the sliding window.
	let recap = adventure.recap || '';
	if (updatedMessages.length > 40 && updatedMessages.length % 20 === 0) {
		try {
			const newRecap = await summarizeAdventure(updatedMessages);
			if (newRecap) recap = newRecap;
		} catch (e) {
			console.error('Failed to generate recap:', e);
		}
	}

	const result = await adventuresCollection.updateOne(filter, {
		$set: {
			messages: updatedMessages,
			stats: latestStats,
			recap: recap,
			updatedAt: new Date()
		}
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
