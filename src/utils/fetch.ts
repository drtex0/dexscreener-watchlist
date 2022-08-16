import { z } from 'zod';
import { getUrlForPairs, loadPairInfo } from '../lib/dexscreener/api';
import { PairDto } from '../lib/dexscreener/pair.dto';
import { watchListSchema } from '../lib/dexscreener/watchlist.dto';
import { chunk } from './array';

export const mapPairsFromWatchList = (watchList: z.infer<typeof watchListSchema>) => {
  const pairs = watchList.lists
    .flatMap(({ pairs }) =>
      pairs.map(({ pairAddress, platformId }) => ({ pairAddress, platformId })),
    )
    .reduce((acc, { pairAddress, platformId }) => {
      return {
        ...acc,
        [platformId]: [...(acc[platformId] ?? []), pairAddress],
      };
    }, {} as Record<string, Array<string>>);

  return Object.entries(pairs).flatMap(([platformId, pairAddresses]) => {
    if (pairAddresses.length > 10) {
      const chunks = chunk(pairAddresses, 10);

      return chunks.map((addresses) => getUrlForPairs(platformId, addresses));
    }

    return getUrlForPairs(platformId, pairAddresses);
  });
};

export const loadWatchlistPairs = async (watchList: z.infer<typeof watchListSchema>) => {
  const watchListPairsURLs = mapPairsFromWatchList(watchList);

  const requests = await Promise.allSettled(
    Object.values(watchListPairsURLs).map(loadPairInfo),
  );

  return requests
    .filter((p) => p.status === 'fulfilled')
    .flatMap((p) => (p as PromiseFulfilledResult<PairDto[]>).value);
};
