import userEvent from '@testing-library/user-event';

// CashTracker imports
import { render, screen, waitFor } from 'testUtils';
import Account from '../[location]';

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {
      location: '',
    },
  }),
}));

describe('Account', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(<Account />);
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
  it('sets an "animate" class on the container if its prop is "signup"', async () => {
    render(<Account location='signup' />);
    expect(await screen.findByTestId('container')).toHaveClass('animate');
  });
  it('does not set an "animate" class on the container if its prop is not "signup"', async () => {
    render(<Account location='login' />);
    expect(await screen.findByTestId('container')).not.toHaveClass('animate');
  });
  it('sets and remove the "animate" class on the container depending on the button clicked', async () => {
    render(<Account location='login' />);

    const container = await screen.findByTestId('container');
    const signupButton = await screen.findByRole('button', {
      name: /Sign Up/i,
    });
    const signinButton = await screen.findByRole('button', {
      name: /Sign In/i,
    });

    expect(container).not.toHaveClass('animate');

    userEvent.click(signupButton);
    expect(container).toHaveClass('animate');

    userEvent.click(signinButton);
    expect(container).not.toHaveClass('animate');
  });
});
