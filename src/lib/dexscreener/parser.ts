import { z } from 'zod';

import { watchListSchema } from './watchlist.dto';

export const parseWatchlist = (watchListInput: Record<string, unknown>) => {
  const items = watchListSchema.parse(watchListInput);

  return items;
};
