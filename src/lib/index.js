// place files you want to import through the `$lib` alias in this folder.
import { Ollama } from 'ollama';

export const ollama = new Ollama({ host: import.meta.env.PROD ? 'ollama:11434' : 'localhost:11434' });