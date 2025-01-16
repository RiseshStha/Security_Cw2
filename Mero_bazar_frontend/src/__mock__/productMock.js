
const mockProductData = {
  data: {
    product: {
      _id: '123',
      postTitle: 'Ducati',
      price: 1000000,
      category: 'Vehicles',
      description: 'A great product',
      condition: 'New',
      delivery: 'Available',
      negotation: 'Yes',
      createdAt: '2021-01-01',
      createdBy: 'user123',
      location: 'Bkhaktapur',
      productImage: 'test-image.jpg',
      averageRating: 4.5,
    },
  },
};

const mockProductsData = {
  data: {
    products: [
      {
        _id: '1',
        postTitle: 'Product 1',
        price: 1000,
        condition: 'New',
        productImage: 'product1.jpg',
        description: 'Description 1',
      },
      {
        _id: '2',
        postTitle: 'Product 2',
        price: 2000,
        condition: 'Used',
        productImage: 'product2.jpg',
        description: 'Description 2',
      },
    ],
    totalProducts: 2,
  },
};

const mockCommentsData = {
  data: {
    comment: [
      {
        _id: 'comment1',
        authorName: 'John Doe',
        content: 'Great product!',
        rating: 4,
        createdAt: '2021-01-01',
        userImage: 'user-image.jpg',
        replies: [],
      },
    ],
  },
};

const mockSimilarProducts = {
  data: {
    product: [
      {
        _id: 'similar1',
        postTitle: 'Similar Product 1',
        price: 150,
        condition: 'Used',
        productImage: 'similar-image1.jpg',
      },
      {
        _id: 'similar2',
        postTitle: 'Similar Product 2',
        price: 200,
        condition: 'New',
        productImage: 'similar-image2.jpg',
      },
    ],
  },
};


module.exports ={
    mockProductData,
    mockCommentsData,
    mockSimilarProducts,
    mockProductsData,
};