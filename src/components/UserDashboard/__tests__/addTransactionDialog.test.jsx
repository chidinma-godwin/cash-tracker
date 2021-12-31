// Cash Tracker imports
import userEvent from '@testing-library/user-event';
import { render, fireEvent, waitFor, screen } from 'testUtils';
import { useUser } from 'utils/hooks';
import AddTransactionDialog from '../addTransactionDialog';

jest.mock('utils/hooks', () => ({
  useUser: jest.fn(),
}));

describe('AddTransactionDialog component', () => {
  const requiredProps = {
    showDialog: true,
    handleCloseDialog: jest.fn(),
    handleTransactionAccount: jest.fn(),
    openSnackBar: false,
    handleCloseSnackBar: jest.fn(),
    errMsg: '',
  };
  beforeEach(() => {
    useUser.mockReturnValue({ user: { clientsEmail: ['test@email.com'] } });
  });
  it('matches snapshot when showDialog is true', () => {
    const { baseElement } = render(<AddTransactionDialog {...requiredProps} />);
    expect(baseElement).toMatchSnapshot();
  });
  it('matches snapshot when showDialog is false', () => {
    const { baseElement } = render(
      <AddTransactionDialog {...requiredProps} showDialog={false} />
    );
    expect(baseElement).toMatchSnapshot();
  });
  it('calls handleTransactionAccount props when submit button is clicked', async () => {
    render(<AddTransactionDialog {...requiredProps} />);

    userEvent.type(screen.getByLabelText('Client Email'), 'test@email.com');
    userEvent.selectOptions(screen.getByLabelText('Currency'), 'NGN (₦)');

    const submitButton = screen.getByRole('button', { name: /Add/i });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(requiredProps.handleTransactionAccount).toHaveBeenCalled();
    });
  });
  it('calls handleCloseDialog props when cancel button is clicked', async () => {
    render(<AddTransactionDialog {...requiredProps} />);

    userEvent.type(screen.getByLabelText('Client Email'), 'test@email.com');
    userEvent.selectOptions(screen.getByLabelText('Currency'), 'NGN (₦)');

    const submitButton = screen.getByRole('button', { name: /Cancel/i });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(requiredProps.handleCloseDialog).toHaveBeenCalled();
    });
  });
  it('shows error alert if there is an error', () => {
    render(
      <AddTransactionDialog
        {...requiredProps}
        errMsg='Some error'
        openSnackBar
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Some error');
  });
  it('informs user that a request will be sent if the email is not in the options', async () => {
    render(<AddTransactionDialog {...requiredProps} />);
    const email = screen.getByLabelText('Client Email');

    userEvent.type(email, 'new@email.com');
    fireEvent.blur(email);

    await waitFor(() =>
      expect(
        screen.getByText(/There is no user with this email/i)
      ).toBeInTheDocument()
    );
  });
});
