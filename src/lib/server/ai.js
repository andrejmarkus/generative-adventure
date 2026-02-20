// place files you want to import through the `$lib` alias in this folder.
import OpenAI from 'openai';
import { env } from '$env/dynamic/private';

// OpenRouter configuration
export const ai = new OpenAI({
	apiKey: env.OPENROUTER_API_KEY || 'dummy-key',
	baseURL: 'https://openrouter.ai/api/v1',
	defaultHeaders: {
		'HTTP-Referer': 'http://localhost:5173', // Optional, for OpenRouter rankings
		'X-Title': 'Generative Adventure' // Optional
	}
});
