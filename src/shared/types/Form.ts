import { z } from 'zod';

export const formSchema = z.object({
  strength: z.number().min(0),
  agility: z.number().min(0),
  perception: z.number().min(0),
  vitality: z.number().min(0),
  willpower: z.number().min(0),
  abilityPoints: z.number().min(0),
  statsPoints: z.number().min(0),
  level: z.number().min(0),
  xp: z.number().min(0),
  abilities: z.array(
    z.object({
      skillName: z.string(),
      isActive: z.boolean(),
      points: z.number(),
      isUnlocked: z.boolean(),
      additionalPoints: z.number(),
      skillIndex: z.number(),
    }),
  ),
});

export type FormSchema = z.infer<typeof formSchema>;
