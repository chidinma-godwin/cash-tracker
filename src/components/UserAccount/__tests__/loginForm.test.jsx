import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

// CashTracker imports
import { useUser } from 'utils/swrHooks';
import { render, fireEvent, waitFor, screen } from 'testUtils';
import makeServer from 'testUtils/apiMock';
import { wrongCredentials } from 'constants/errorMessages';
import LoginForm from '../loginForm';

jest.mock('next-auth/react', () => ({ signIn: jest.fn() }));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('utils/swrHooks', () => ({
  useUser: jest.fn(),
}));

describe('Login Form', () => {
  const user = {
    id: '1',
    username: 'Name',
    email: 'test@email.com',
    password: 'secret',
    clientsEmail: ['client1@email.com'],
    pendingInvitations: ['invite@email.com'],
    pendingRequests: ['pending1@email.com', 'pending2@email.com'],
  };
  const mutateSpy = jest.fn();
  const mockPushSpy = jest.fn();
  let server;

  beforeEach(() => {
    server = makeServer();
    mutateSpy.mockRestore();
    mockPushSpy.mockRestore();
    useRouter.mockImplementation(() => ({
      push: mockPushSpy,
    }));
    useUser.mockImplementation(() => ({ mutate: mutateSpy }));
  });
  afterEach(() => {
    signIn.mockRestore();
    server.shutdown();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<LoginForm className='' />);

    expect(asFragment(<LoginForm className='' />)).toMatchSnapshot();
  });
  it('populates the form with the given values', async () => {
    render(<LoginForm className='' />);

    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(email, 'test@email.com');
    userEvent.type(password, 'secretpassword');

    await waitFor(() => {
      expect(screen.getByTestId('login-form')).toHaveFormValues({
        email: 'test@email.com',
        password: 'secretpassword',
      });
      expect(submitButton).toBeEnabled();
    });
  });
  it('sets error on the field if they are touched and left empty and disables the submit button', async () => {
    render(<LoginForm className='' />);

    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(email, '');
    userEvent.type(password, '');
    fireEvent.blur(email);
    fireEvent.blur(password);

    // Ensure error message shows
    await waitFor(() => {
      expect(screen.getByText('Your email is required')).toBeInTheDocument();
    });
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Please enter your password')).toBeInTheDocument();
    expect(password).toHaveAttribute('aria-invalid', 'true');
    expect(submitButton).toBeDisabled();
  });
  it('sets error on the field and disables the submit button if they have invalid data', async () => {
    render(<LoginForm className='' />);

    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(email, 'test@');
    fireEvent.blur(email);
    userEvent.type(password, '');
    fireEvent.blur(password);

    // Ensure error message shows
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Please enter your password')).toBeInTheDocument();
    expect(password).toHaveAttribute('aria-invalid', 'true');
    expect(submitButton).toBeDisabled();
  });
  it('focuses on the input field when the appended icon is clicked', async () => {
    render(<LoginForm className='' />);

    userEvent.click(screen.getByRole('button', { name: /email/i }));
    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toHaveFocus();
    });
  });
  it('toggles the password and confirm password field visibility when the appended icon is clicked', () => {
    render(<LoginForm className='' />);

    const password = screen.getByLabelText('Password');

    // Toggle password field
    expect(password).toHaveAttribute('type', 'password');
    userEvent.click(screen.getByRole('button', { name: /toggle password/i }));
    expect(password).toHaveAttribute('type', 'text');
  });
  it('shows error alert, does not navigate to dashbord if login request was not successful, and closes the alert when the close button is clicked', async () => {
    signIn.mockReturnValue({ error: wrongCredentials });
    render(<LoginForm className='' />);

    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(email, 'test@email.com');
    userEvent.type(password, 'secret');

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(wrongCredentials);
    });
    expect(mockPushSpy).not.toHaveBeenCalled();

    // Close alert
    userEvent.click(screen.getByRole('button', { name: /Close/i }));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
  it('redirects to dashboard, and does not show error alert if login request was successful', async () => {
    signIn.mockReturnValue({ error: null, ok: true });

    render(<LoginForm className='' />);

    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(email, 'test@email.com');
    userEvent.type(password, 'secret');

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPushSpy).toHaveBeenCalledWith('/dashboard');
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
