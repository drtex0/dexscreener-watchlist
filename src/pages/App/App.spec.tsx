import App from './App';

import { fireEvent, render } from '@testing-library/react';

import { watchlistFactoryFn } from '../../test/factories/watchlist';
import { act } from 'react-dom/test-utils';

import * as FetchModule from '../../utils/fetch';
import { pairFactoryFn } from '../../test/factories/pair';

jest.mock('./components/WatchlistData', () => ({
  WatchlistData: () => <>WatchlistData</>,
}));

jest.mock('../../utils/fetch', () => {
  return {
    __esModule: true,
    ...jest.requireActual('../../utils/fetch'),
  };
});

const renderComponent = () => {
  return render(<App />);
};

describe('App', () => {
  it('handles the loader on request', async () => {
    const watchlist = watchlistFactoryFn().build();
    const pair = pairFactoryFn().build();
    const spy = jest
      .spyOn(FetchModule, 'loadWatchlistPairs')
      .mockResolvedValue(pair.pairs);
    const comp = renderComponent();

    const textArea = comp.container.querySelector('textarea');
    const button = comp.container.querySelector('button');

    fireEvent.change(textArea!, { target: { value: JSON.stringify(watchlist) } });

    await act(() => {
      fireEvent.submit(button!);
    });

    expect(spy).toHaveBeenCalled();
  });
});
