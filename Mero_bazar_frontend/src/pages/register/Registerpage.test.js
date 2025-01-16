import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate, BrowserRouter as Router } from 'react-router-dom';
import Registerpage from './Registerpage';
import { registerUserApi } from '../../apis/Api';
import { toast, ToastContainer } from 'react-toastify';
import '@testing-library/jest-dom/extend-expect';
import 'react-toastify/dist/ReactToastify.css';

jest.mock('../../apis/Api');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));


describe('Registerpage', () => {

   const renderWithRouter = (ui) => {
    return render(<Router>{ui}</Router>);
};

  it('Should display error toast message on register fail with user already existing', async () => {
    // Mock the API response
    registerUserApi.mockResolvedValue({
      data: { success: false, message: 'User already exists' },
    });

    // Render the Registerpage component
    render(
      <MemoryRouter>
        <Registerpage />
        <ToastContainer />
      </MemoryRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText('full name'), { target: { value: 'Risesh Shrestha' } });
    fireEvent.change(screen.getByPlaceholderText('number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('confirm password'), { target: { value: 'password123' } });

    // Simulate form submission
    fireEvent.click(screen.getByText('Create Account'));

    // Check if the error toast message is displayed
    const errorMessage = await screen.findByText('User already exists');
    expect(errorMessage).toBeInTheDocument();
  });

  it('Should display success toast message and navigate to login page on successful registration', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockImplementation(() => mockNavigate);

    render(<Registerpage />);

    const mockResponse = {
      data: {
        success: true,
        message: "Registered successfully!",
      },
    };

    registerUserApi.mockResolvedValue(mockResponse);

    const fullName = await screen.findByPlaceholderText('full name');
    const phoneNumber = await screen.findByPlaceholderText('number');
    const password = await screen.findByPlaceholderText('password');
    const confirmPassword = await screen.findByPlaceholderText('confirm password');
    const registerBtn = screen.getByText('Create Account');

    fireEvent.change(fullName, {
      target: { value: 'Risesh Sama Shrestha' },
    });
    fireEvent.change(phoneNumber, {
      target: { value: '987654321' },
    });
    fireEvent.change(password, {
      target: { value: 'ris123' },
    });
    fireEvent.change(confirmPassword, {
      target: { value: 'ris123' },
    });

    fireEvent.click(registerBtn);

    await waitFor(() => {
      expect(registerUserApi).toHaveBeenCalledWith({
        fullName: 'Risesh Sama Shrestha',
        phoneNumber: '987654321',
        password: 'ris123',
      });

    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
