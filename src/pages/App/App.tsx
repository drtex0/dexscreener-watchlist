import React, { useEffect, useState } from 'react';
import { z } from 'zod';

import { Pair } from './App.types';
import './App.css';

const App = () => {
  const [watchList, setWatchList] = useState('');
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [pairs, setPairs] = useState<Array<string>>([]);
  const [data, setData] = useState<Array<Record<string, string>>>([]);

  const handleWatchlistChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWatchList(event.target.value);

    const pairSchema = z.object({
      timestamp: z.number(),
      pairAddress: z.string(),
      platformId: z.string(),
    });

    const watchListSchema = z.object({
      updatedAtTimestamp: z.number(),
      lists: z.array(
        z.object({ id: z.string(), name: z.string(), pairs: z.array(pairSchema) }),
      ),
    });

    const data = watchListSchema.parse(JSON.parse(event.target.value));

    const pairs = data.lists.flatMap((a) =>
      a.pairs.map(({ pairAddress, platformId }) => ({ pairAddress, platformId })),
    );

    setPairs(pairs.map(getUrl));
  };

  const getUrl = ({
    pairAddress,
    platformId,
  }: {
    pairAddress: string;
    platformId: string;
  }) => {
    const base_url = 'https://api.dexscreener.com/latest/dex/pairs';

    return [base_url, platformId, pairAddress].join('/');
  };

  useEffect(() => {
    const loadPairInfo = async (url: string) => {
      try {
        const result = await fetch(url);

        const data = await result.json();

        return data;
      } catch (err) {
        console.error(err);
      }
    };

    const loadAllPairs = async (urls: Array<string>) => {
      const requests = await Promise.allSettled(urls.map(loadPairInfo));

      console.log(requests);

      const data = requests.map((r) => {
        if (r.status === 'fulfilled') {
          return {
            name: r.value.pair.baseToken.name,
            priceChange: r.value.pair.priceChange.h1,
            volume: r.value.pair.volume.h1,
            price: r.value.pair.priceUsd,
          };
        }
      });

      setData(data);
    };

    if (pairs.length > 0) {
      console.log('aqi');
      loadAllPairs(pairs);
    }
  }, [pairs]);

  const loadWatchList = (event: React.MouseEvent) => {
    event.preventDefault();
    setWatchlistLoading(true);
  };

  console.log(data);

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <textarea
          className="text-xs text-red-600 border"
          onChange={handleWatchlistChange}
          value={watchList}
        />
        <button
          className="px-6 py-2 rounded bg-green-800 hover:bg-green-600 text-white"
          type="button"
          onClick={loadWatchList}
        >
          Load
        </button>
        {watchlistLoading && <div> Loading </div>}

        <div className="border">
          {data.map((d, index) => {
            return (
              <div key={index} className="border flex justify-between">
                <span> {d.name} </span>
                <span> {d.price} </span>
                <span>{d.priceChange}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
