import { ai } from '$lib/server/ai';

export async function streamChat(messages, recap = "") {
    const trimmedMessages = trimMessages(messages);
    
    // Inject recap if available to provide long-term memory
    if (recap) {
        trimmedMessages.splice(1, 0, {
            role: 'system',
            content: `STORY RECAP: ${recap}`
        });
    }

    const completion = await ai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: trimmedMessages,
        stream: true,
        temperature: 0.8
    });

    return new ReadableStream({
        async start(controller) {
            for await (const chunk of completion) {
                const content = chunk.choices[0]?.delta?.content || "";
                if (content) {
                    controller.enqueue(content);
                }
            }
            controller.close();
        }
    });
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
            content: 'Summarize the story so far in 3-5 concise sentences. Focus on major plot points, player decisions, and current location. Do not include game stats.'
        }
    ];

    const completion = await ai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: summaryPrompt,
        temperature: 0.5
    });

    return completion.choices[0]?.message?.content || "";
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
            stats.inventory = inventoryMatch[1].trim().split('\n').filter(i => i.trim() && i.trim() !== '[ items ]');
        }

        const weaponsMatch = text.match(/WEAPONS\/ARMOR:\s*([\s\S]*?)\s*(?:STATS:|$)/i);
        if (weaponsMatch) {
            stats.weapons = weaponsMatch[1].trim().split('\n').filter(i => i.trim() && !i.includes('[ weapon'));
        }

        const healthMatch = text.match(/Health:\s*(\d+)/i);
        if (healthMatch) stats.health = parseInt(healthMatch[1]);

        const hungerMatch = text.match(/Hunger:\s*(\d+)/i);
        if (hungerMatch) stats.hunger = parseInt(hungerMatch[1]);

        const moneyMatch = text.match(/Money:\s*(\d+)/i);
        if (moneyMatch) stats.money = parseInt(moneyMatch[1]);
    } catch (e) {
        console.error("Error parsing stats:", e);
    }

    return stats;
}

/**
 * Strips the stats tracking template from a message for clean display.
 */
export function stripStats(text) {
    if (!text) return "";
    return text.replace(/INVENTORY:\s*[\s\S]*?(?:STATS:[\s\S]*?(?:\n\n|$)|$)/i, "").trim();
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
