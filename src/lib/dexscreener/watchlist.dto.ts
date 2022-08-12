import { number, z } from 'zod';

export const watchlist = z.object({
  updatedAtTimestamp: z.number(),
  lists: z.any(),
});
