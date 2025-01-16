import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, useParams } from 'react-router-dom';
import PostDetailPage from './PostDetailPage';
import { getProductById, createComment, getCommentsApi, rateProduct, getSimilarProducts } from '../../apis/Api';
import { toast } from 'react-toastify';
import { mockCommentsData, mockProductData, mockSimilarProducts } from '../../__mock__/productMock';

// Mocking useParams to simulate route parameters
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

// Mocking API calls
jest.mock('../../apis/Api', () => ({
  getProductById: jest.fn(),
  createComment: jest.fn(),
  getCommentsApi: jest.fn(),
  rateProduct: jest.fn(),
  getSimilarProducts: jest.fn(),
}));

// Mocking toast from react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

describe('PostDetailPage', () => {
    beforeEach(() => {
      useParams.mockReturnValue({ id: '123' });
      getProductById.mockResolvedValue(mockProductData);
      getCommentsApi.mockResolvedValue(mockCommentsData);
      getSimilarProducts.mockResolvedValue(mockSimilarProducts);
      localStorage.setItem('user', JSON.stringify({ _id: 'user123', fullName: 'Test User', profileImage: 'profile-image.jpg' }));
    });
  
    it('should render product details correctly', async () => {
      render(
        <Router>
          <PostDetailPage />
        </Router>
      );
  
      waitFor(() => {
        expect(screen.getByText('Ducati')).toBeInTheDocument();
        expect(screen.getByText('Rs 1000000')).toBeInTheDocument();
        expect(screen.getByText('A great product')).toBeInTheDocument();
        expect(screen.getByText('Vehicles')).toBeInTheDocument();
        expect(screen.getByText('New')).toBeInTheDocument();
        expect(screen.getByText('Available')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('Bkhaktapur')).toBeInTheDocument();
      });
    });
  
    it('should submit and display a new comment', async () => {
      createComment.mockResolvedValue({ data: { success: true } });
  
      render(
        <Router>
          <PostDetailPage />
        </Router>
      );
  
      const commentInput = screen.getByPlaceholderText('Write a comment...');
      const submitButton = screen.getByText('Submit');
  
      fireEvent.change(commentInput, { target: { value: 'New Comment' } });
      fireEvent.click(submitButton);
  
      await waitFor(() => {
        expect(createComment).toHaveBeenCalledWith({
          author: 'user123',
          authorName: 'Test User',
          content: 'New Comment',
          postId: '123',
          rating: 0,
          userImage: 'profile-image.jpg',
        });
        expect(getCommentsApi).toHaveBeenCalledWith('123');
      });
    });
  
    it('should submit and reflect a new rating', async () => {
        rateProduct.mockResolvedValue({ data: { success: true } });
    
        render(
          <Router>
            <PostDetailPage />
          </Router>
        );
    
        const stars = screen.getAllByTestId('product-rating').find(element => element.className.includes('fa fa-star-o'));
        fireEvent.click(stars);
    
        waitFor(() => {
          expect(rateProduct).toHaveBeenCalledWith('123', { rating: 2 });
          expect(getProductById).toHaveBeenCalledWith('123');
        });
    
        waitFor(() => {
          expect(screen.getByText('Average Rating:')).toBeInTheDocument();
          expect(screen.getByText('4.5')).toBeInTheDocument();
        });
      });

      it('should render similar products correctly', async () => {
        render(
          <Router>
            <PostDetailPage />
          </Router>
        );
    
        waitFor(() => {
          expect(screen.getByText('Similar Products')).toBeInTheDocument();
          expect(screen.getByText('Similar Product 1')).toBeInTheDocument();
          expect(screen.getByText('Rs.150')).toBeInTheDocument();
          expect(screen.getByText('Used')).toBeInTheDocument();
    
          expect(screen.getByText('Similar Product 2')).toBeInTheDocument();
          expect(screen.getByText('Rs.200')).toBeInTheDocument();
          expect(screen.getByText('New')).toBeInTheDocument();
        });
      });
  });
  