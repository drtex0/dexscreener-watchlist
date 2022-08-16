import { Table } from '@mantine/core';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
  flexRender,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { PairDto } from '../../../lib/dexscreener/pair.dto';

interface TableProps {
  data: PairDto[];
}

export const WatchlistData = ({ data }: TableProps) => {
  const columns = useMemo<ColumnDef<Partial<PairDto>>[]>(
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

  const [sorting, setSorting] = useState<SortingState>([]);

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
                      {flexRender(header.column.columnDef.header, header.getContext())}
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
  );
};
