import { ai } from '$lib/server/ai';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const POST = async ({ request }) => {
	try {
		const { setting } = await request.json();

		if (!setting || setting.length < 10) {
			return new Response(JSON.stringify({ error: 'Setting description too short' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Simple check for valid API Key
		if (!env.OPENROUTER_API_KEY || env.OPENROUTER_API_KEY === 'dummy-key') {
			console.warn('OPENROUTER_API_KEY is missing or invalid. Using fallbacks.');
			// Skip AI and use fallbacks
			throw new Error('API Key Missing');
		}

		const prompt = `Based on this setting description, suggest 6-8 appropriate character archetypes/classes that would fit this world.

Setting: "${setting}"

Return ONLY a JSON array of strings (archetypes). 1-3 words per archetype.
NO PREAMBLE. NO EXPLANATION.

Example format: ["Archetype A", "Archetype B"]`;

		// Sequenced failover using low-traffic/high-availability free providers
		// Priority: Compact reasoning -> MoE reasoning -> Flash performance
		const models = [
			'liquid/lfm-2.5-1.2b-instruct:free',
			'arcee-ai/trinity-mini:free',
			'google/gemma-3-12b-it:free',
			'stepfun/step-3.5-flash:free',
			'upstage/solar-pro-3:free'
		];

		let completion = null;
		let lastError = null;
		let responseText = '';

		for (const model of models) {
			try {
				const response = await ai.chat.completions.create({
					model,
					messages: [{ role: 'user', content: prompt }],
					temperature: 0.9,
					max_tokens: 300
				});

				const content = response.choices[0]?.message?.content;
				if (content && content.trim().length > 0) {
					completion = response;
					responseText = content.trim();
					break;
				} else {
					console.warn(`Model ${model} returned empty content, trying next...`);
				}
			} catch (error) {
				console.error(`Skipping ${model} - Status: High Load/Error:`, error.message);
				lastError = error;
			}
		}

		if (!responseText) throw lastError || new Error('All AI providers returned empty or failed');

		// Try to parse the JSON response
		try {
			// Try to find ANY JSON-like structure (brackets or braces)
			const jsonRegex = /\[[\s\S]*\]|\{[\s\S]*\}/;
			const jsonMatch = responseText.match(jsonRegex);
			const cleanJson = jsonMatch ? jsonMatch[0] : responseText.trim();

			let classes = [];
			try {
				const parsed = JSON.parse(cleanJson);
				classes = Array.isArray(parsed) ? parsed : (parsed.classes || parsed.archetypes || []);
			} catch (parseError) {
				console.warn('JSON.parse failed, attempting regex extraction:', parseError.message);
				// If JSON parsing fails, try to extract words between quotes
				const quoteMatch = responseText.match(/"([^"]+)"|'([^']+)'/g);
				if (quoteMatch) {
					classes = quoteMatch.map(m => m.replace(/['"]/g, ''));
				}
			}
			
			// Filter and validate
			const validClasses = classes
				.filter(c => typeof c === 'string' && c.length >= 2 && c.length < 30)
				.map(c => c.trim())
				.filter(c => {
					const lc = c.toLowerCase();
					return !lc.includes('here are') && 
						   !lc.includes('returning') && 
						   !lc.includes('json') &&
						   !lc.includes('setting');
				})
				.slice(0, 9);
			
			if (validClasses.length >= 3) {
				return json({ classes: validClasses });
			}
		} catch (e) {
			console.error('AI Parse Logic Exception:', e.message, 'Raw Response:', responseText);
		}

		// If AI failed but the key is valid, let the user know it was a parsing/model issue
		return json({ 
			classes: ['Warrior', 'Scholar', 'Merchant', 'Guardian', 'Explorer', 'Technician', 'Mystic', 'Adventurer'],
			isFallback: true,
			error: 'AI generation failed. Using default archetypes.'
		});

	} catch (error) {
		console.error('Error getting suggested classes:', error);
		
		const isAuthError = error.message?.includes('API Key') || error.status === 401;
		
		return json({ 
			classes: ['Warrior', 'Scholar', 'Merchant', 'Guardian', 'Explorer', 'Technician', 'Mystic', 'Adventurer'],
			isFallback: true,
			error: isAuthError ? 'OPENROUTER_API_KEY is missing or invalid in .env' : 'AI Service at capacity. Using defaults.'
		}, { status: 200 }); // Return 200 so the UI can show the classes but warn the user
	}
};