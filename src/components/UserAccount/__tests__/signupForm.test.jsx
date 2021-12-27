import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { Response } from 'miragejs';
import { signIn } from 'next-auth/react';

// CashTracker imports;
import { render, waitFor, fireEvent, screen } from 'testUtils';
import makeServer from 'testUtils/apiMock';
import { unexpected } from 'constants/errorMessages';
import { dashboardEndpoint, signupEndpoint } from 'constants/endpoints';
import SignUpForm from '../signupForm';

jest.mock('next-auth/react', () => ({ signIn: jest.fn() }));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('utils/swrHooks', () => ({
  useUser: jest.fn(),
}));

describe('SignUp Form', () => {
  let server;
  const mockPushSpy = jest.fn();

  beforeEach(() => {
    server = makeServer();
    mockPushSpy.mockRestore();
    signIn.mockRestore();
    useRouter.mockImplementation(() => ({
      push: mockPushSpy,
      query: {},
    }));
  });

  afterEach(() => {
    server.shutdown();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<SignUpForm className='' />);

    expect(asFragment(<SignUpForm className='' />)).toMatchSnapshot();
  });
  it('populates the form with the given values and removes the disabled prop from the submit button', async () => {
    render(<SignUpForm className='' />);

    const name = screen.getByLabelText('Username');
    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');
    const confirmPassword = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(name, 'Name');
    userEvent.type(email, 'test@email.com');
    userEvent.type(password, 'secretpassword');
    userEvent.type(confirmPassword, 'secretpassword');

    await waitFor(() => {
      expect(screen.getByTestId('signup-form')).toHaveFormValues({
        name: 'Name',
        email: 'test@email.com',
        password: 'secretpassword',
        password2: 'secretpassword',
      });
      expect(submitButton).toBeEnabled();
    });
  });
  it('sets error on the field if they are touched and left empty and disables the submit button', async () => {
    render(<SignUpForm className='' />);

    const name = screen.getByLabelText('Username');
    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');
    const confirmPassword = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(name, '');
    userEvent.type(email, '');
    userEvent.type(password, '');
    userEvent.type(confirmPassword, '');
    fireEvent.blur(name);
    fireEvent.blur(email);
    fireEvent.blur(password);
    fireEvent.blur(confirmPassword);

    // Ensure error message shows
    await waitFor(() => {
      expect(screen.getByText('Your name is required')).toBeInTheDocument();
    });
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Your email is required')).toBeInTheDocument();
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Please choose a password')).toBeInTheDocument();
    expect(password).toHaveAttribute('aria-invalid', 'true');
    expect(
      screen.getByText('Please re-enter your password')
    ).toBeInTheDocument();
    expect(confirmPassword).toHaveAttribute('aria-invalid', 'true');
    expect(submitButton).toBeDisabled();
  });
  it('sets error on the field and disables the submit button if they have invalid data', async () => {
    render(<SignUpForm className='' />);

    const name = screen.getByLabelText('Username');
    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');
    const confirmPassword = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(name, 'No');
    userEvent.type(email, 'test@');
    userEvent.type(password, 'short');
    userEvent.type(confirmPassword, 'different');
    fireEvent.blur(name);
    fireEvent.blur(email);
    fireEvent.blur(password);
    fireEvent.blur(confirmPassword);

    // Ensure error message shows
    await waitFor(() => {
      expect(
        screen.getByText('Username must be at least 3 characters')
      ).toBeInTheDocument();
      expect(name).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(email).toHaveAttribute('aria-invalid', 'true');
      expect(
        screen.getByText('Your password must have a minimum length of 6')
      ).toBeInTheDocument();
      expect(password).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByText('Passwords must match')).toBeInTheDocument();
      expect(confirmPassword).toHaveAttribute('aria-invalid', 'true');
      expect(submitButton).toBeDisabled();
    });
  });
  it('focuses on the input field when the appended icon is clicked', async () => {
    render(<SignUpForm className='' />);

    userEvent.click(screen.getByRole('button', { name: /username/i }));
    await waitFor(() => {
      expect(screen.getByLabelText('Username')).toHaveFocus();
    });

    userEvent.click(screen.getByRole('button', { name: /email/i }));
    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toHaveFocus();
    });
  });
  it('toggles the password and confirm password field visibility when the appended icon is clicked', () => {
    render(<SignUpForm className='' />);

    const password = screen.getByLabelText('Password');
    const confirmPassword = screen.getByLabelText('Confirm Password');

    // Toggle password field
    expect(password).toHaveAttribute('type', 'password');
    userEvent.click(screen.getByRole('button', { name: /toggle password/i }));
    expect(password).toHaveAttribute('type', 'text');

    // Toggle confirm password field
    expect(confirmPassword).toHaveAttribute('type', 'password');
    userEvent.click(screen.getByRole('button', { name: /confirm password/i }));
    expect(confirmPassword).toHaveAttribute('type', 'text');
  });
  it('shows error alert, does not navigate to login page if signup request was not successful, and closes the alert when the close button is clicked', async () => {
    server.post(signupEndpoint, () => new Response(500));
    render(<SignUpForm className='' />);

    const name = screen.getByLabelText('Username');
    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');
    const confirmPassword = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(name, 'Name');
    userEvent.type(email, 'test@email.com');
    userEvent.type(password, 'secretpassword');
    userEvent.type(confirmPassword, 'secretpassword');

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(unexpected);
    });
    expect(mockPushSpy).not.toHaveBeenCalled();

    // Close alert
    userEvent.click(screen.getByRole('button', { name: /Close/i }));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
  it('redirects to login page and does not show error alert if signup request was successful', async () => {
    signIn.mockReturnValue({ error: null, ok: true });
    render(<SignUpForm className='' />);

    const name = screen.getByLabelText('Username');
    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');
    const confirmPassword = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(name, 'Name');
    userEvent.type(email, 'test@email.com');
    userEvent.type(password, 'secretpassword');
    userEvent.type(confirmPassword, 'secretpassword');

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPushSpy).toHaveBeenCalledWith(dashboardEndpoint);
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
  it('shows error alert if the url contains an error param', async () => {
    useRouter.mockReturnValue({
      push: jest.fn(),
      query: { error: 'some error' },
    });

    render(<SignUpForm className='' />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(unexpected);
    });
  });
});
