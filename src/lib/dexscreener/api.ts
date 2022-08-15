import { z, ZodError } from 'zod';
import { PairDto, rootObjectSchema, RootPairDto } from './pair.dto';

const BASE_URL = 'https://api.dexscreener.com/latest/dex/pairs';

export const getUrl = ({
  pairAddress,
  platformId,
}: {
  pairAddress: string;
  platformId: string;
}) => {
  return [BASE_URL, platformId, pairAddress].join('/');
};

export const loadPairInfo = async (url: string): Promise<RootPairDto> => {
  try {
    const response = await fetch(url);

    if (response.status > 200)
      throw new Error('Unable to get result from dexscreener api');

    const data = await response.json();

    const output = rootObjectSchema.parse(data);

    return output;
  } catch (err) {
    if (err instanceof ZodError) {
      console.error('Validation error', err);
      console.log(url);
    }

    throw err;
  }
};
