import { ai } from '$lib/server/ai';

export async function streamChat(messages, recap = '') {
	const trimmedMessages = trimMessages(messages);

	// Inject recap if available to provide long-term memory
	if (recap) {
		trimmedMessages.splice(1, 0, {
			role: 'system',
			content: `STORY RECAP: ${recap}`
		});
	}

	const models = [
		'arcee-ai/trinity-large-preview:free',
		'google/gemma-3-27b-it:free',
		'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
		'mistralai/mistral-small-3.1-24b-instruct:free',
		'meta-llama/llama-3.3-70b-instruct:free'
	];

	let lastError;
	for (const model of models) {
		try {
			const completion = await ai.chat.completions.create({
				model,
				messages: trimmedMessages,
				stream: true,
				temperature: 0.8
			});

			return new ReadableStream({
				async start(controller) {
					try {
						for await (const chunk of completion) {
							const content = chunk.choices[0]?.delta?.content || '';
							if (content) {
								controller.enqueue(content);
							}
						}
					} catch (err) {
						console.error(`Streaming error with model ${model}:`, err);
						controller.error(err);
					} finally {
						controller.close();
					}
				}
			});
		} catch (err) {
			console.error(`Failed to start chat with model ${model}:`, err.message);
			lastError = err;
			// If it's a 401 (Auth) or 400 (Bad Request), don't bother retrying with same parameters?
			// But 400 "Provider returned error" is exactly what we want to skip.
			continue;
		}
	}

	throw lastError || new Error('All models failed to respond');
}

/**
 * Generates a short summary of the adventure so far.
 * This is used to maintain long-term context without blowing the token limit.
 */
export async function summarizeAdventure(messages) {
	const summaryPrompt = [
		...messages.slice(0, 2), // System + Intro
		{
			role: 'system',
			content:
				'Summarize the story so far in 3-5 concise sentences. Focus on major plot points, player decisions, and current location. Do not include game stats.'
		}
	];

	// Prioritizing extremely fast, low-latency models for summarization
	const models = [
		'liquid/lfm-2.5-1.2b-instruct:free',
		'google/gemma-3-12b-it:free',
		'stepfun/step-3.5-flash:free',
		'arcee-ai/trinity-mini:free',
		'upstage/solar-pro-3:free'
	];

	for (const model of models) {
		try {
			const completion = await ai.chat.completions.create({
				model,
				messages: summaryPrompt,
				temperature: 0.5
			});
			const content = completion.choices[0]?.message?.content;
			if (content && content.trim().length > 0) {
				return content.trim();
			}
			console.warn(`Summary model ${model} returned empty content.`);
			continue;
		} catch (err) {
			console.error(`Status check: Model ${model} skipped due to service error:`, err.message);
			continue;
		}
	}

	return '';
}

/**
 * Parses stats from the AI's template response.
 * Expects the template: INVENTORY, WEAPONS/ARMOR, STATS
 */
export function extractStats(text) {
	const stats = {
		inventory: [],
		weapons: [],
		health: 100,
		hunger: 100,
		money: 0
	};

	try {
		// Simple regex-based extraction
		const inventoryMatch = text.match(/INVENTORY:\s*([\s\S]*?)\s*(?:WEAPONS\/ARMOR:|$)/i);
		if (inventoryMatch) {
			stats.inventory = inventoryMatch[1]
				.trim()
				.split('\n')
				.filter((i) => i.trim() && i.trim() !== '[ items ]');
		}

		const weaponsMatch = text.match(/WEAPONS\/ARMOR:\s*([\s\S]*?)\s*(?:STATS:|$)/i);
		if (weaponsMatch) {
			stats.weapons = weaponsMatch[1]
				.trim()
				.split('\n')
				.filter((i) => i.trim() && !i.includes('[ weapon'));
		}

		const healthMatch = text.match(/Health:\s*(\d+)/i);
		if (healthMatch) stats.health = Number.parseInt(healthMatch[1]);

		const hungerMatch = text.match(/Hunger:\s*(\d+)/i);
		if (hungerMatch) stats.hunger = Number.parseInt(hungerMatch[1]);

		const moneyMatch = text.match(/Money:\s*(\d+)/i);
		if (moneyMatch) stats.money = Number.parseInt(moneyMatch[1]);
	} catch (e) {
		console.error('Error parsing stats:', e);
	}

	return stats;
}

/**
 * Strips the stats tracking template from a message for clean display.
 */
export function stripStats(text) {
	if (!text) return '';
	return text.replace(/INVENTORY:\s*[\s\S]*?(?:STATS:[\s\S]*?(?:\n\n|$)|$)/i, '').trim();
}

/**
 * Trims message history to stay within context limits while preserving key prompts.
 */
function trimMessages(messages, maxRecent = 30) {
	if (messages.length <= maxRecent + 2) return messages;

	const firstTwo = messages.slice(0, 2);
	const recent = messages.slice(-maxRecent);

	return [...firstTwo, ...recent];
}
