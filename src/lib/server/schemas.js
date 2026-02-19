import { z } from 'zod';

export const adventureSchema = z.object({
    name: z.string().min(1, "Timeline name is required").max(50),
    characterName: z.string().min(1, "Unit designation (character name) is required").max(50),
    setting: z.string().min(10, "Environment params (setting) must be at least 10 characters long").max(500),
});
