import App from './App';

import { fireEvent, render } from '@testing-library/react';

// jest.mock('./components/WatchlistData', () => ({ WatchlistData: <></> }));
// jest.mock('./components/WatchlistForm', () => ({ WatchlistForm: <></> }));
const renderComponent = () => {
  return render(<App />);
};

describe('App', () => {
  it('renders', () => {
    const comp = renderComponent();
    expect(true).toBeTruthy();
    // expect(comp.findAllByText('WatchlistData')).toBeInTheDocument();
    // expect(comp.findAllByText('WatchlistForm')).toBeInTheDocument();
  });

  // it('updates the counter', async () => {
  //   const { container } = renderComponent();

  //   const button = container.querySelector('button');

  //   expect(button).toBeDefined();

  //   await fireEvent(button!, new MouseEvent('click'));

  //   const counter = container.querySelector('.text-6xl');
  //   expect(counter?.innerHTML).toEqual('0');
  // });
});
