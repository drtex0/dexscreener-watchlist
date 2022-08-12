import { z } from 'zod';

import { watchlist } from './watchlist.dto';

export const parseWatchlist = (watchListInput: Record<string, unknown>) => {
  const items = watchlist.parse(watchListInput);

  return items;
};
