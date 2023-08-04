/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateUserPage from './CreateUserPage';
import { useUserContext } from '../context/UserContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

describe('CreateUserPage', () => {
  let mockCreateUser: jest.Mock;
  let mockIsLoggedIn: boolean;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateUser = jest.fn();
    mockIsLoggedIn = false;
    (useUserContext as jest.Mock).mockReturnValue({ createUser: mockCreateUser, isLoggedIn: mockIsLoggedIn });
  });

  it('should render the create user page correctly', () => {
    render(<CreateUserPage />);

    // Check if the required elements are rendered
    const usernameInput = screen.getByTestId('username-text-field').querySelector('input') as HTMLInputElement;
    expect(usernameInput).toBeInTheDocument();
    const emailInput = screen.getByTestId('email-text-field').querySelector('input') as HTMLInputElement;
    expect(emailInput).toBeInTheDocument();
    const passwordInput = screen.getByTestId('password-text-field').querySelector('input') as HTMLInputElement;
    expect(passwordInput).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create User' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('should show an error for empty username', async () => {
    render(<CreateUserPage />);

    const createUserButton = screen.getByRole('button', { name: 'Create User' });

    // Click on the "Create User" button without entering a username
    fireEvent.click(createUserButton);

    // Check if the error message is displayed
    expect(screen.getByText('Username cannot be empty')).toBeInTheDocument();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('should show an error for invalid email format', async () => {
    render(<CreateUserPage />);

    const usernameInput = screen.getByTestId('username-text-field').querySelector('input') as HTMLInputElement;
    const emailInput = screen.getByTestId('email-text-field').querySelector('input') as HTMLInputElement;
    const createUserButton = screen.getByRole('button', { name: 'Create User' });

    // Enter an invalid email format
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.click(createUserButton);

    // Check if the error message is displayed
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('should show an error for short password', async () => {
    render(<CreateUserPage />);

    const usernameInput = screen.getByTestId('username-text-field').querySelector('input') as HTMLInputElement;
    const emailInput = screen.getByTestId('email-text-field').querySelector('input') as HTMLInputElement;
    const passwordInput = screen.getByTestId('password-text-field').querySelector('input') as HTMLInputElement;
    const createUserButton = screen.getByRole('button', { name: 'Create User' });

    // Enter valid username and email but a short password
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(createUserButton);

    // Check if the error message is displayed
    expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('should call the createUser function on valid input', async () => {
    render(<CreateUserPage />);

    const usernameInput = screen.getByTestId('username-text-field').querySelector('input') as HTMLInputElement;
    const emailInput = screen.getByTestId('email-text-field').querySelector('input') as HTMLInputElement;
    const passwordInput = screen.getByTestId('password-text-field').querySelector('input') as HTMLInputElement;
    const createUserButton = screen.getByRole('button', { name: 'Create User' });

    // Enter valid input
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123!' } });
    fireEvent.click(createUserButton);

    // Check if the createUser function is called
    expect(mockCreateUser).toHaveBeenCalledTimes(1);
    expect(mockCreateUser).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123!');
  });
});
