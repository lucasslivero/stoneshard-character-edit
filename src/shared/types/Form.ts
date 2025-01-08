import { z } from 'zod';

export const formSchema = z.object({
  strength: z.number().min(0).max(30),
  agility: z.number().min(0).max(30),
  perception: z.number().min(0).max(30),
  vitality: z.number().min(0).max(30),
  willpower: z.number().min(0).max(30),
  abilityPoints: z.number().min(0).max(30),
  // 11 + 11 + 11 + 10 + 10 = 60 (Initial Stats)
  // 60 + 30 (1 per Level) = 90 (Max Stats Points)
  statsPoints: z.number().min(0).max(90),
  abilities: z.array(
    z.object({
      skillId: z.string(),
      isActive: z.boolean(),
      isLocked: z.boolean(),
      skillName: z.string(),
      iconPath: z.string().nullish(),
      category: z.string().nullish(),
      tier: z.number().nullish(),
      immutable: z.boolean(),
    }),
  ),
});

export type FormSchema = z.infer<typeof formSchema>;
