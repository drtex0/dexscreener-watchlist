import { Factory } from 'fishery';
import { WatchListInputDto } from '../../lib/dexscreener/watchlist.dto';
import { faker } from '@faker-js/faker';

class WatchListFactory extends Factory<WatchListInputDto> {
  public ethereum(amount: number = 1): this {
    return this.params({
      lists: Array.from({ length: amount }, () => ({
        id: faker.random.alpha(),
        name: faker.random.alpha(),
        pairs: [
          {
            timestamp: faker.datatype.datetime().getTime(),
            pairAddress: faker.datatype.hexadecimal(42),
            platformId: 'ethereum',
          },
        ],
      })),
    });
  }
}

export const watchlistFactory = WatchListFactory.define<WatchListInputDto>(
  ({ params }) => {
    const { lists } = params;

    return {
      updatedAtTimestamp: faker.datatype.datetime().getTime(),
      lists: lists ?? [
        {
          id: faker.random.alpha(),
          name: faker.random.alpha(),
          pairs: [
            {
              timestamp: faker.datatype.datetime().getTime(),
              pairAddress: faker.datatype.hexadecimal(42),
              platformId: faker.company.bsNoun(),
            },
          ],
        },
      ],
    };
  },
);

export const watchlistFactoryFn = (): WatchListFactory =>
  watchlistFactory as WatchListFactory;
