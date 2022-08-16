import { Faker, faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { PairDto, RootPairDto } from '../../lib/dexscreener/pair.dto';

export const generatePair = (chainId: string = faker.commerce.productName()): PairDto => {
  const pair = {
    chainId: chainId ?? faker.commerce.productName(),
    dexId: faker.datatype.string(),
    url: faker.internet.url(),
    pairAddress: faker.datatype.hexadecimal(42),
    baseToken: {
      address: faker.datatype.hexadecimal(42),
      name: faker.company.name(),
      symbol: faker.datatype.string(4),
    },
    quoteToken: {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      name: 'Wrapped Ether',
      symbol: 'WETH',
    },
    priceNative: faker.commerce.price(),
    priceUsd: faker.commerce.price(),
    txns: {
      m5: { buys: faker.datatype.number(1), sells: faker.datatype.number(1) },
      h1: { buys: faker.datatype.number(2), sells: faker.datatype.number(2) },
      h6: { buys: faker.datatype.number(3), sells: faker.datatype.number(3) },
      h24: { buys: faker.datatype.number(4), sells: faker.datatype.number(4) },
    },
    volume: {
      m5: faker.datatype.number(1),
      h1: faker.datatype.number(2),
      h6: faker.datatype.number(3),
      h24: faker.datatype.number(4),
    },
    priceChange: {
      m5: faker.datatype.number(1),
      h1: faker.datatype.number(2),
      h6: faker.datatype.number(3),
      h24: faker.datatype.number(4),
    },
    liquidity: {
      usd: faker.datatype.number(),
      base: faker.datatype.number(),
      quote: faker.datatype.float(),
    },
    fdv: faker.datatype.number(),
    pairCreatedAt: new Date().getTime(),
  };

  return pair;
};

class PairFactory extends Factory<RootPairDto> {
  public ethereum(amount: number = 1): this {
    const pairs = Array.from({ length: amount }, () => generatePair('ethereum'));

    return this.params({ pair: pairs.length === 1 ? pairs[0] : null, pairs });
  }

  public single(): this {
    const pair = generatePair();

    return this.params({
      pair,
      pairs: [pair],
    });
  }

  public multiple(): this {
    return this.params({
      pair: null,
      pairs: [generatePair('ethereum'), generatePair('ethereum')],
    });
  }
}

const pairFactory = PairFactory.define<RootPairDto>(({}) => {
  const nbPairs = Math.round(Math.random() * 1 + 2);

  const pairs = Array.from({ length: nbPairs }, () => generatePair());

  return {
    schemaVersion: faker.datatype.string(),
    pair: pairs.length === 1 ? pairs[0] : null,
    pairs,
  };
});

const pairFactoryFn = (): PairFactory => pairFactory as PairFactory;

export { pairFactoryFn, PairFactory };
