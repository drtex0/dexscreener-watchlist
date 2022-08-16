import * as MantineHooksModule from '@mantine/hooks';
import { fireEvent, render, screen } from '@testing-library/react';
import { WatchListInputDto } from '../../../lib/dexscreener/watchlist.dto';
import { watchlistFactoryFn } from '../../../test/factories/watchlist';
import { WatchlistForm } from './WatchlistForm';

const renderComponent = (props: any) => {
  return render(<WatchlistForm {...props} />);
};

describe('WatchlistForm', () => {
  let watchlist: WatchListInputDto;

  beforeEach(() => {
    watchlist = watchlistFactoryFn().build();
  });

  it('initializes the textarea with the localStorage data', () => {
    jest
      .spyOn(MantineHooksModule, 'useLocalStorage')
      .mockReturnValue([watchlist, jest.fn()]);

    const component = renderComponent({ handleFormSubmit: jest.fn() });

    const textArea = component.container.querySelector('textarea');

    expect(textArea).not.toBeEmptyDOMElement();
  });

  describe('regarding form submissions', () => {
    it('reports JSON error from zod', () => {
      const setWatchListSpy = jest.fn();
      jest
        .spyOn(MantineHooksModule, 'useLocalStorage')
        .mockReturnValue(['', setWatchListSpy]);

      const component = renderComponent({ handleFormSubmit: jest.fn() });
      const textArea = component.container.querySelector('textarea');
      const button = component.container.querySelector('button');

      fireEvent.change(textArea!, { target: { value: 'test' } });
      fireEvent.submit(button!);

      expect(screen.findAllByText('Incorrect JSON format')).toBeDefined();
      expect(setWatchListSpy).not.toHaveBeenCalled();
    });

    it('changes the localStorage if form is valid', () => {
      const setWatchListSpy = jest.fn();
      const props = { handleFormSubmit: jest.fn() };
      jest
        .spyOn(MantineHooksModule, 'useLocalStorage')
        .mockReturnValue(['', setWatchListSpy]);

      const component = renderComponent(props);
      const textArea = component.container.querySelector('textarea');
      const button = component.container.querySelector('button');

      fireEvent.change(textArea!, { target: { value: JSON.stringify(watchlist) } });
      fireEvent.submit(button!);

      expect(setWatchListSpy).toHaveBeenCalledWith(JSON.stringify(watchlist));
      expect(props.handleFormSubmit).toHaveBeenCalledWith(watchlist);
    });
  });
});
