import { useState } from 'react';

import { Box, Loader } from '@mantine/core';
import { watchListSchema } from '../../lib/dexscreener/watchlist.dto';
import { PairDto } from '../../lib/dexscreener/pair.dto';
import { z } from 'zod';
import { WatchlistData } from './components/WatchlistData';
import { WatchlistForm } from './components/WatchlistForm';
import { loadWatchlistPairs } from '../../utils/fetch';

const App = () => {
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [data, setData] = useState<PairDto[]>([]);

  const handleFormSubmit = async (watchlist: z.infer<typeof watchListSchema>) => {
    try {
      setWatchlistLoading(true);

      const data = await loadWatchlistPairs(watchlist);
      setData(data);
    } catch (err) {
      alert('Error loading pair');
    } finally {
      setWatchlistLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <WatchlistForm handleFormSubmit={handleFormSubmit} />

        {watchlistLoading && (
          <Box sx={{ textAlign: 'center' }}>
            <Loader variant="dots" />
          </Box>
        )}

        <WatchlistData data={data} />
      </div>
    </div>
  );
};

export default App;
