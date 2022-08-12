import App from './App';

import { fireEvent, render } from '@testing-library/react';

const renderComponent = () => {
  return render(<App />);
};

describe('App', () => {
  it('renders', () => {
    const { container } = renderComponent();
    const counter = container.querySelector('.text-6xl');

    expect(counter?.innerHTML).toEqual('0');
  });

  it('updates the counter', async () => {
    const { container } = renderComponent();

    const button = container.querySelector('button');

    expect(button).toBeDefined();

    await fireEvent(button!, new MouseEvent('click'));

    const counter = container.querySelector('.text-6xl');
    expect(counter?.innerHTML).toEqual('0');
  });
});
