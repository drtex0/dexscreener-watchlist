import React, { useEffect, useState } from 'react';
import { z } from 'zod';

import { Pair } from './App.types';

import './App.css';
import { Button, Loader, Table, Textarea } from '@mantine/core';

const App = () => {
  const [watchList, setWatchList] = useState('');
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [pairs, setPairs] = useState<Array<string>>([]);
  const [data, setData] = useState<Array<Record<string, any>>>([]);

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

    const pairs = data.lists.flatMap(({ pairs }) =>
      pairs.map(({ pairAddress, platformId }) => ({ pairAddress, platformId })),
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
  const loadPairInfo = async (url: string): Promise<any> => {
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

    const data = requests.map((r) => {
      if (r.status === 'fulfilled') {
        return {
          name: r.value.pair.baseToken.name,
          priceChange: r.value.pair.priceChange,
          volume: r.value.pair.volume,
          price: r.value.pair.priceUsd,
        };
      }
    });

    setData(data as any);
    setWatchlistLoading(false);
  };

  useEffect(() => {}, [pairs]);

  const loadWatchList = (event: React.MouseEvent) => {
    event.preventDefault();
    setWatchlistLoading(true);

    if (pairs.length > 0) {
      loadAllPairs(pairs);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <Textarea
          onChange={handleWatchlistChange}
          placeholder="Paste your watchlist here"
          label="Your watchlist "
          size="lg"
          radius="md"
          value={watchList}
          required
        />

        <Button onClick={loadWatchList} color="cyan" radius="md" size="lg">
          Load
        </Button>

        {watchlistLoading && <Loader variant="dots" />}

        <Table className="border">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price </th>
              <th>Price Change (1H)</th>
              <th>Volume (1H)</th>
              <th>Price Change (24H)</th>
              <th>Volume (24H)</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d, index) => {
              console.log(d);
              return (
                <tr key={index} className="border flex justify-between">
                  <td> {index} </td>
                  <td> {d.name} </td>
                  <td> {d.price} </td>
                  <td>{d.priceChange.h1}</td>
                  <td>{d.volume.h1}</td>
                  <td>{d.priceChange.h24}</td>
                  <td>{d.volume.h24}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default App;
