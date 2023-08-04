/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './LoginPage';
import { useUserContext } from '../context/UserContext';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the useUserContext hook
jest.mock('../context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

// Set up the test
describe('LoginPage', () => {
  let mockLogin: jest.Mock;
  beforeEach(() => {
    // Clear all mock functions before each test
    jest.clearAllMocks();

    // Mock the login function
    mockLogin = jest.fn();

    // Mock the useUserContext hook implementation
    (useUserContext as jest.Mock).mockReturnValue({ login: mockLogin });
  });

  it('should render the login page correctly', () => {
    render(<LoginPage />);

    // Check if the required elements are rendered
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('should show an error for invalid email format', async () => {
    render(<LoginPage />);
    
    const emailInput  = screen.getByTestId('email-text-field').querySelector('input') as HTMLInputElement
    expect(emailInput ).toBeInTheDocument()
    const passwordInput  = screen.getByTestId('password-text-field').querySelector('input') as HTMLInputElement
    expect(passwordInput ).toBeInTheDocument()
    const signInButton = screen.getByRole('button', { name: 'Sign In' });
    // Enter an invalid email format
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.click(signInButton);

    // Check if the error message is displayed
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should show an error for short password', async () => {
    render(<LoginPage />);
    const emailInput  = screen.getByTestId('email-text-field').querySelector('input') as HTMLInputElement
    const passwordInput  = screen.getByTestId('password-text-field').querySelector('input') as HTMLInputElement
    const signInButton = screen.getByRole('button', { name: 'Sign In' });

    // Enter a valid email but a short password
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(signInButton);

    // Check if the error message is displayed
    expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should call the login function on valid email and password', async () => {
    render(<LoginPage />);
    const emailInput  = screen.getByTestId('email-text-field').querySelector('input') as HTMLInputElement
    const passwordInput  = screen.getByTestId('password-text-field').querySelector('input') as HTMLInputElement
    const signInButton = screen.getByRole('button', { name: 'Sign In' });

    // Enter a valid email and password
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);

    // Check if the login function is called
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
