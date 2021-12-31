import userEvent from '@testing-library/user-event';

// CashTracker imports
import { render, screen } from 'testUtils';
import PendingUserList from '../pendingUserList';

describe('PendingUserList component', () => {
  const requiredProps = {
    pendingInvitations: ['test@email.com', 'another@email.com'],
    handleTransactionAccount: jest.fn(),
  };
  it('matches snapshot', () => {
    const { asFragment } = render(<PendingUserList {...requiredProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('calls handleTransactionAccount props with the right data when add button is clicked', () => {
    render(<PendingUserList {...requiredProps} />);

    const addButton = screen.getAllByRole('button', {
      name: /confirm account/i,
    });
    userEvent.click(addButton[1]);

    expect(requiredProps.handleTransactionAccount).toHaveBeenCalledWith(
      'another@email.com',
      'add'
    );
  });
  it('calls handleTransactionAccount props with the right data when delete button is clicked', () => {
    render(<PendingUserList {...requiredProps} />);

    const deleteButton = screen.getAllByRole('button', {
      name: /delete request/i,
    });
    userEvent.click(deleteButton[0]);

    expect(requiredProps.handleTransactionAccount).toHaveBeenCalledWith(
      'test@email.com',
      'delete'
    );
  });
});
