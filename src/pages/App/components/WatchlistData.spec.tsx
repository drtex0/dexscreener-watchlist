import { TableProps } from '@mantine/core';
import { render } from '@testing-library/react';
import { pairFactoryFn } from '../../../test/factories/pair';
import { WatchlistData } from './WatchlistData';

const renderComponent = (props: any) => {
  return render(<WatchlistData {...props} />);
};

describe('WatchlistData', () => {
  it('returns empty body if no data', () => {
    const component = renderComponent({ data: [] });

    const tableBody = component.container.querySelector('tbody');
    expect(tableBody?.childNodes).toHaveLength(0);
  });

  it('returns the table', () => {
    const { pairs } = pairFactoryFn().build();
    const component = renderComponent({ data: pairs });

    const tableBody = component.container.querySelector('tbody');
    expect(tableBody?.childNodes).toHaveLength(pairs.length);
  });
});
