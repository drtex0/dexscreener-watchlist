import { faker } from '@faker-js/faker';
import { watchlistFactory, watchlistFactoryFn } from '../test/factories/watchlist';
import { loadWatchlistPairs, mapPairsFromWatchList } from './fetch';

import * as ApiModule from '../lib/dexscreener/api';
import { pairFactoryFn } from '../test/factories/pair';
import { pairSchema, rootPairSchema } from '../lib/dexscreener/pair.dto';

jest.mock('../lib/dexscreener/api', () => ({
  __esModule: true,
  ...jest.requireActual('../lib/dexscreener/api'),
}));

describe('#mapPairsFromWatchList', () => {
  it('maps pairs from watchlist', () => {
    const watchlist = watchlistFactory.build();

    expect(mapPairsFromWatchList(watchlist)).toEqual([
      `https://api.dexscreener.com/latest/dex/pairs/${watchlist.lists[0].pairs[0].platformId}/${watchlist.lists[0].pairs[0].pairAddress}`,
    ]);
  });

  it('group pairs by platformId', () => {
    const watchlist = watchlistFactoryFn().ethereum(5).build();
    const newList = {
      id: faker.datatype.string(),
      name: 'bsc',
      pairs: [
        {
          timestamp: faker.datatype.datetime().getTime(),
          pairAddress: '0xA1f5cb91d9aADc651aec0BE5678A22E20EE9b79Ef4',
          platformId: 'bsc',
        },
      ],
    };

    const pairs = watchlist.lists.flatMap((l) =>
      l.pairs.map(({ pairAddress }) => pairAddress),
    );

    expect(
      mapPairsFromWatchList({ ...watchlist, lists: [...watchlist.lists, newList] }),
    ).toEqual([
      `https://api.dexscreener.com/latest/dex/pairs/ethereum/${pairs.join(',')}`,
      `https://api.dexscreener.com/latest/dex/pairs/bsc/0xA1f5cb91d9aADc651aec0BE5678A22E20EE9b79Ef4`,
    ]);
  });

  it('splits the requests if the input is too long', () => {
    const watchlist = watchlistFactoryFn().ethereum(30).build();
    const newList = {
      id: faker.datatype.string(),
      name: 'bsc',
      pairs: [
        {
          timestamp: faker.datatype.datetime().getTime(),
          pairAddress: '0xA1f5cb91d9aADc651aec0BE5678A22E20EE9b79Ef4',
          platformId: 'bsc',
        },
      ],
    };

    const pairs = watchlist.lists.flatMap((l) =>
      l.pairs.map(({ pairAddress }) => pairAddress),
    );

    expect(
      mapPairsFromWatchList({ ...watchlist, lists: [...watchlist.lists, newList] }),
    ).toHaveLength(4);
  });
});

describe('#loadWatchlistPairs', () => {
  const watchList = {
    updatedAtTimestamp: 3544173233770,
    lists: [
      {
        id: 'dka0d9',
        name: 'Watchlist 1',
        pairs: [
          {
            timestamp: 1900800331099,
            pairAddress: '0x09F8BE8df0DC0d3903A6C2c7add8C14290DbDa0e5d',
            platformId: 'ethereum',
          },
        ],
      },
    ],
  };
  it('loads the metrics', async () => {
    const mockPairs = pairFactoryFn().build();
    const apiSpy = jest
      .spyOn(ApiModule, 'loadPairInfo')
      .mockResolvedValue(mockPairs.pairs);

    const pairs = await loadWatchlistPairs(watchList);

    expect(pairs).toHaveLength(mockPairs.pairs.length);

    expect(apiSpy).toHaveBeenCalled();
  });

  it('respects the output dto', async () => {
    const mockPairs = pairFactoryFn().build();
    const apiSpy = jest
      .spyOn(ApiModule, 'loadPairInfo')
      .mockResolvedValue(mockPairs.pairs);

    const pairs = await loadWatchlistPairs(watchList);

    expect(() => pairSchema.parse(pairs[0])).not.toThrow();
  });
});
