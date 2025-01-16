import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { loginUserApi } from '../../apis/Api';
import { toast } from 'react-toastify';
import Loginpage from './Loginpage';

// Mocking useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mocking loginUserApi
jest.mock('../../apis/Api', () => ({
  loginUserApi: jest.fn(),
}));

// Mocking toast from react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

describe('Loginpage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should display success toast message and navigate to home page on successful login', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockImplementation(() => mockNavigate);

    render(<Loginpage />);

    const mockResponse = {
      data: {
        success: true,
        message: "Login successful!",
        token: "fake-token",
        userData: { id: 1, name: "Test User" },
      },
    };

    loginUserApi.mockResolvedValue(mockResponse);

    const phoneNumber = screen.getByTestId('phone-number-input');
    const password = screen.getByTestId('password-input');
    const loginBtn = screen.getByTestId('login-button');

    fireEvent.change(phoneNumber, {
      target: { value: '987654321' },
    });
    fireEvent.change(password, {
      target: { value: 'test123' },
    });

    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(loginUserApi).toHaveBeenCalledWith({
        phoneNumber: '987654321',
        password: 'test123',
      });

      expect(toast.success).toHaveBeenCalledWith('Login successful!');
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('Should display error toast message on failed login', async () => {
    render(<Loginpage />);

    const mockResponse = {
      data: {
        success: false,
        message: "Invalid credentials",
      },
    };

    loginUserApi.mockResolvedValue(mockResponse);

    const phoneNumber = screen.getByTestId('phone-number-input');
    const password = screen.getByTestId('password-input');
    const loginBtn = screen.getByTestId('login-button');

    fireEvent.change(phoneNumber, {
      target: { value: '987654321' },
    });
    fireEvent.change(password, {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(loginUserApi).toHaveBeenCalledWith({
        phoneNumber: '987654321',
        password: 'wrongpassword',
      });

      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });
});
