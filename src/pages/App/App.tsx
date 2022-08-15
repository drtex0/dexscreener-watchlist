import React, { useEffect, useState } from 'react';

import './App.css';
import { Button, Loader, Table, Textarea } from '@mantine/core';
import { watchListSchema } from '../../lib/dexscreener/watchlist.dto';
import { getUrl, loadPairInfo } from '../../lib/dexscreener/api';
import { useLocalStorage } from '@mantine/hooks';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { PairDto, RootPairDto } from '../../lib/dexscreener/pair.dto';
import { useForm } from '@mantine/form';
import { z, ZodError } from 'zod';
import { chunk } from '../../utils/array';

const App = () => {
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [data, setData] = useState<Partial<PairDto>[]>([]);

  const [watchListStorage, setWatchListStorage] = useLocalStorage<string>({
    key: 'watchlist',
    deserialize: (value) => {
      return JSON.parse(value);
    },
  });

  const form = useForm({
    initialValues: {
      watchlist: '',
    },

    validate: {
      watchlist: (value) => {
        try {
          watchListSchema.parse(JSON.parse(value));

          return null;
        } catch (err) {
          if (err instanceof ZodError) {
            return 'Incorrect input';
          }

          if (err instanceof SyntaxError) {
            return 'Unable to parse JSON input';
          }

          return 'Error';
        }
      },
    },
  });

  useEffect(() => {
    if (watchListStorage.toString().length > 0) {
      try {
        watchListSchema.parse(JSON.parse(watchListStorage));
        form.setFieldValue('watchlist', watchListStorage);
      } finally {
      }
    }
  }, [watchListStorage]);

  const handleFormSubmit = form.onSubmit(async (value) => {
    try {
      const data = watchListSchema.parse(JSON.parse(value.watchlist));
      setWatchListStorage(value.watchlist);

      await loadWatchlistPairs(data);
    } catch (err) {
      console.error('caught', err);
    }
  });

  const loadWatchlistPairs = async (watchList: z.infer<typeof watchListSchema>) => {
    setWatchlistLoading(true);

    const pairUrls = watchList.lists
      .flatMap(({ pairs }) =>
        pairs.map(({ pairAddress, platformId }) => ({ pairAddress, platformId })),
      )
      .reduce((acc, { pairAddress, platformId }) => {
        if (!acc[platformId]) {
          return {
            ...acc,
            [platformId]: getUrl({
              pairAddress,
              platformId,
            }),
          };
        }

        const currentUrl = acc[platformId];

        return {
          ...acc,
          [platformId]: [currentUrl, pairAddress].join(','),
        };
      }, {} as Record<string, string>);

    const optimizedUrls = Object.values(pairUrls).flatMap((url) => {
      const pairParams = url.split('/');
      if (pairParams.length === 0) throw new Error('Unable to get pairs from url');

      const pairs = pairParams.pop()?.split(',');

      if (pairs && pairs.length > 10) {
        const baseURL = pairParams.join('/');

        const chunks = chunk(pairs, 10);

        return chunks.map((chunk) => {
          return [baseURL, chunk.join(',')].join('/');
        });
      }

      return url;
    });

    const requests = await Promise.allSettled(
      Object.values(optimizedUrls).map(loadPairInfo),
    );

    const data = requests
      .filter((p) => p.status === 'fulfilled')
      .map((p) => (p as PromiseFulfilledResult<RootPairDto>).value)
      .flatMap((p) => p.pairs);

    console.log('d', data);

    setData(data);
    setWatchlistLoading(false);
  };

  const columns = React.useMemo<ColumnDef<Partial<PairDto>>[]>(
    () => [
      {
        accessorKey: '#',
        cell: (info) => info.cell.row.index + 1,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.baseToken?.name,
        id: 'name',
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.priceUsd,
        id: 'price',
        cell: (info) => info.getValue(),
        header: () => <span>price</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.priceChange?.h1,
        id: 'price Change (1H) ',
        cell: (info) => info.getValue(),
        header: () => <span>Price Change (1H) </span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.volume?.h1,
        id: 'Volume Change (1H) ',
        cell: (info) => info.getValue(),
        header: () => <span>Volume Change (1H) </span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.priceChange?.h24,
        id: 'Price Change (24 H) ',
        cell: (info) => info.getValue(),
        header: () => <span>Price Change (24H) </span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.volume?.h24,
        id: 'Volume Change (24 H) ',
        cell: (info) => info.getValue(),
        header: () => <span>Volume Change (24H) </span>,
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <form onSubmit={handleFormSubmit}>
          <Textarea
            placeholder="Paste your watchlist here"
            label="Your watchlist "
            size="lg"
            radius="md"
            value={watchListStorage}
            required
            {...form.getInputProps('watchlist')}
          />

          <Button type="submit" color="cyan" radius="md" size="lg">
            Load
          </Button>
        </form>

        {watchlistLoading && <Loader variant="dots" />}

        <Table className="border">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
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
