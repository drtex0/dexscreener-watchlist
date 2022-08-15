import { number, z } from 'zod';

export const pairSchema = z.object({
  timestamp: z.number(),
  pairAddress: z.string(),
  platformId: z.string(),
});

export const pair = z.object({
  id: z.string(),
  name: z.string(),
  pairs: z.array(pairSchema),
});

export const watchListSchema = z.object({
  updatedAtTimestamp: z.number(),
  lists: z.array(pair),
});
