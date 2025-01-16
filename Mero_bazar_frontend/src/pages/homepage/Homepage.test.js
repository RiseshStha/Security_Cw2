import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Homepage from './Homepage';
import { getProducts } from '../../apis/Api';
import { mockProductsData } from '../../__mock__/productMock';

jest.mock('../../apis/Api', () => ({
  getProducts: jest.fn(),
}));

describe('Homepage', () => {
    beforeEach(() => {
      getProducts.mockResolvedValue(mockProductsData);
    });
  
    it('should render products correctly', async () => {
      render(
        <Router>
          <Homepage />
        </Router>
      );
  
      waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.getByText('NPR 1000')).toBeInTheDocument();
        expect(screen.getByText('NPR 2000')).toBeInTheDocument();
      });
    });

    it('should update products when a category is selected', async () => {
        const mockCategoryProductsData = {
          data: {
            products: [
              {
                _id: '3',
                postTitle: 'Category Product 1',
                price: 3000,
                condition: 'New',
                productImage: 'categoryproduct1.jpg',
                description: 'Category Description 1',
              },
            ],
            totalProducts: 1,
          },
        };
    
        getProducts.mockResolvedValueOnce(mockCategoryProductsData);
    
        render(
          <Router>
            <Homepage />
          </Router>
        );
    
        fireEvent.click(screen.getByText('Vehicles'));
    
        waitFor(() => {
          expect(screen.getByText('Category Product 1')).toBeInTheDocument();
          expect(screen.getByText('NPR 3000')).toBeInTheDocument();
        });
      });

      it('should update products when a category is selected', async () => {
        const mockCategoryProductsData = {
          data: {
            products: [
              {
                _id: '3',
                postTitle: 'Category Product 1',
                price: 3000,
                condition: 'New',
                productImage: 'categoryproduct1.jpg',
                description: 'Category Description 1',
              },
            ],
            totalProducts: 1,
          },
        };
    
        getProducts.mockResolvedValueOnce(mockCategoryProductsData);
    
        render(
          <Router>
            <Homepage />
          </Router>
        );
    
        fireEvent.click(screen.getByText('Vehicles'));
    
        waitFor(() => {
          expect(screen.getByText('Category Product 1')).toBeInTheDocument();
          expect(screen.getByText('NPR 3000')).toBeInTheDocument();
        });
      });

      it('should update products when a category is selected', async () => {
        const mockCategoryProductsData = {
          data: {
            products: [
              {
                _id: '3',
                postTitle: 'Category Product 1',
                price: 3000,
                condition: 'New',
                productImage: 'categoryproduct1.jpg',
                description: 'Category Description 1',
              },
            ],
            totalProducts: 1,
          },
        };
    
        getProducts.mockResolvedValueOnce(mockCategoryProductsData);
    
        render(
          <Router>
            <Homepage />
          </Router>
        );
    
        fireEvent.click(screen.getByText('Vehicles'));
    
        waitFor(() => {
          expect(screen.getByText('Category Product 1')).toBeInTheDocument();
          expect(screen.getByText('NPR 3000')).toBeInTheDocument();
        });
      });

      it('should update products when a category is selected', async () => {
        const mockCategoryProductsData = {
          data: {
            products: [
              {
                _id: '3',
                postTitle: 'Category Product 1',
                price: 3000,
                condition: 'New',
                productImage: 'categoryproduct1.jpg',
                description: 'Category Description 1',
              },
            ],
            totalProducts: 1,
          },
        };
    
        getProducts.mockResolvedValueOnce(mockCategoryProductsData);
    
        render(
          <Router>
            <Homepage />
          </Router>
        );
    
        fireEvent.click(screen.getByText('Vehicles'));
    
        waitFor(() => {
          expect(screen.getByText('Category Product 1')).toBeInTheDocument();
          expect(screen.getByText('NPR 3000')).toBeInTheDocument();
        });
      });

      it('should update products when a category is selected', async () => {
        const mockCategoryProductsData = {
          data: {
            products: [
              {
                _id: '3',
                postTitle: 'Category Product 1',
                price: 3000,
                condition: 'New',
                productImage: 'categoryproduct1.jpg',
                description: 'Category Description 1',
              },
            ],
            totalProducts: 1,
          },
        };
    
        getProducts.mockResolvedValueOnce(mockCategoryProductsData);
    
        render(
          <Router>
            <Homepage />
          </Router>
        );
    
        fireEvent.click(screen.getByText('Vehicles'));
    
        waitFor(() => {
          expect(screen.getByText('Category Product 1')).toBeInTheDocument();
          expect(screen.getByText('NPR 3000')).toBeInTheDocument();
        });
      });
    
    
    
    
    
});