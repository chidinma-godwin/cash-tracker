import singletonRouter from 'next/router';
import userEvent from '@testing-library/user-event';

// CahsTracker imports
import { render, screen } from 'testUtils';
import { useUser } from 'utils/hooks';
import ClientDetailsList from '../clientDetailsLit';

jest.mock('utils/hooks', () => ({
  useUser: jest.fn(),
}));

// eslint-disable-next-line global-require
jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('ClientDetailsList component', () => {
  const requiredProps = {
    handleTransactionAccount: jest.fn(),
    handleShowDialog: jest.fn(),
  };
  beforeEach(() => {
    useUser.mockReturnValue({
      user: {
        clientsEmail: ['client1@email.com', 'client2@email.com'],
        clientsDetails: [
          { username: 'client1', email: 'client1@email.com' },
          { username: 'client2', email: 'client2@email.com' },
        ],
        deletedEmails: ['deleted@email.com'],
        pendingRequests: ['pending@email.com'],
      },
    });
  });
  it('matches snapshot', () => {
    const { asFragment } = render(<ClientDetailsList {...requiredProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('should navigate to the correct url if the view button of a transaction account is clicked', () => {
    render(<ClientDetailsList {...requiredProps} />);
    window.scrollTo = jest.fn();

    const viewButton = screen.getAllByRole('link', {
      name: /View transaction/i,
    });
    userEvent.click(viewButton[0]);

    expect(singletonRouter).toMatchObject({
      asPath: '/transaction-details?clientEmail=client1%40email.com',
    });
  });
  it('calls handleTransactionAccount props with the right arguments if the delete button is clicked', () => {
    render(<ClientDetailsList {...requiredProps} />);

    const deleteButton = screen.getAllByRole('button', {
      name: /delete account/i,
    });
    userEvent.click(deleteButton[0]);

    expect(requiredProps.handleTransactionAccount).toHaveBeenCalledWith(
      'client1@email.com',
      'delete',
      'account'
    );
  });
  it('calls handleShowDialog props when the add new account button is clicked', () => {
    render(<ClientDetailsList {...requiredProps} />);

    const addButton = screen.getByRole('button', { name: 'Add New Account' });
    userEvent.click(addButton);

    expect(requiredProps.handleShowDialog).toHaveBeenCalled();
  });
  it('displays correct info, when the user has no clients', () => {
    useUser.mockReturnValue({
      user: {
        clientsEmail: [],
        clientsDetails: [],
        deletedEmails: [],
        pendingRequests: [],
      },
    });
    render(<ClientDetailsList {...requiredProps} />);

    expect(
      screen.getByText(/You do not have any transaction account/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add New Account' })
    ).toBeInTheDocument();
  });
});
