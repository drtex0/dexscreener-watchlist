import { faker } from '@faker-js/faker';
import { ZodError } from 'zod';
import { pairFactoryFn } from '../../test/factories/pair';
import { getUrlForPairs, loadPairInfo } from './api';
import { pair } from './watchlist.dto';

describe('#getUrlForPairs', () => {
  it('returns the correct pair endpoint', () => {
    expect(getUrlForPairs('ethereum', ['0x1', '0x2'])).toEqual(
      'https://api.dexscreener.com/latest/dex/pairs/ethereum/0x1,0x2',
    );
  });
});

describe('#loadPairInfo', () => {
  it('throws an error on not successful status', async () => {
    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        status: 404,
      }),
    );

    await expect(loadPairInfo(faker.internet.url())).rejects.toThrowError('');
  });

  it('throws a zodError if the result cant be parsed', async () => {
    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({}),
      }),
    );

    await expect(loadPairInfo(faker.internet.url())).rejects.toBeInstanceOf(ZodError);
  });

  it('returns the formatted pairs', async () => {
    const result = pairFactoryFn().ethereum(1).build();

    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(result),
      }),
    );

    await expect(loadPairInfo(faker.internet.url())).resolves.toEqual([
      {
        baseToken: result.pair?.baseToken,
        chainId: 'ethereum',
        dexId: result.pair?.dexId,
        fdv: result.pair?.fdv,
        liquidity: result.pair?.liquidity,
        pairAddress: result.pair?.pairAddress,
        priceChange: result.pair?.priceChange,
        priceNative: result.pair?.priceNative,
        priceUsd: result.pair?.priceUsd,
        quoteToken: {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          name: 'Wrapped Ether',
          symbol: 'WETH',
        },
        pairCreatedAt: result.pair?.pairCreatedAt,
        txns: result.pair?.txns,
        url: result.pair?.url,
        volume: result.pair?.volume,
      },
    ]);
  });
});
