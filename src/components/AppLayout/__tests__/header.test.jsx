import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import singletonRouter from 'next/router';
import mockRouter from 'next-router-mock';

// CashTrackr imports
import Header from '../header';

// eslint-disable-next-line global-require
jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('Header', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Header />);

    expect(asFragment()).toMatchSnapshot();
  });
  it('navigates to the home page when the home link is clicked', () => {
    window.scrollTo = jest.fn();
    mockRouter.setCurrentUrl('/dashboard');
    render(<Header />);

    const link = screen.getByText('Cash Tracker');

    userEvent.click(link);

    expect(singletonRouter).toMatchObject({ asPath: '/' });
  });
});
