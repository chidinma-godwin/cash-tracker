import { fireEvent, render } from '@testing-library/react';

import { useRouter } from 'next/router';
import LandingPage from '..';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('LandingPage', () => {
  const mockRouterPush = jest.fn();
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockRouterPush,
    }));
  });
  it('should match snapshot', () => {
    const { asFragment } = render(<LandingPage />);

    expect(asFragment()).toMatchSnapshot();
  });
  it('navigates to login page if "Login" button is clicked', () => {
    const { getByTestId } = render(<LandingPage />);

    fireEvent.click(getByTestId('login'));

    expect(mockRouterPush).toHaveBeenCalledWith(
      '/account/[location]',
      '/account/login'
    );
  });
  it('navigates to sign up page if "Sign Up" button is clicked', () => {
    const { getByTestId } = render(<LandingPage />);

    fireEvent.click(getByTestId('sign-up'));

    expect(mockRouterPush).toHaveBeenCalledWith(
      '/account/[location]',
      '/account/signup'
    );
  });
});
