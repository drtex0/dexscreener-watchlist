import { PairDto, rootPairSchema } from './pair.dto';

const BASE_URL = 'https://api.dexscreener.com/latest/dex/pairs';

export const getUrlForPairs = (platformId: string, pairAddresses: string[]) => {
  return [BASE_URL, platformId, pairAddresses.join(',')].join('/');
};

export const loadPairInfo = async (url: string): Promise<PairDto[]> => {
  const response = await fetch(url);

  if (response.status > 200) throw new Error('Unable to get result from dexscreener api');

  const data = await response.json();

  const output = rootPairSchema.parse(data);

  return output.pairs;
};
