// src/ProductDetails.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Define the Product interface here
interface Product {
  id: number;
  name: string;
  description: string;
  img: string;
  price: string;
}

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId?: string }>(); // Notice the "?" after "productId"
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (productId) {
      // Fetch product data from the Flask API based on the productId
      axios.get(`http://localhost:8000/api/product_id/${productId}`).then((response) => {
        setProduct(response.data);
      });
    }
  }, [productId]);

  const addToCart = async () => {
    if (productId) { // Check if productId is defined
      try {
        // Make a POST request to add the product to the cart
        const response = await axios.post('http://localhost:8000/api/add_to_cart', {
          product_id: parseInt(productId),
          user_id: parseInt(localStorage.getItem('user_id') || '0'),
        });

        if (response.data.message === 'Added to cart') {
          // Display a success message
          alert('Product added to cart successfully');
        } else {
          // Display an error message
          alert('Failed to add product to cart');
        }
      } catch (error) {
        console.error('Error adding product to cart:', error);
      }
    }
  };

  if (!product) {
    return <div><h1>Error: Product not found.</h1></div>;
  }

  return (
    <div className='text-center mt-20'>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <img src={product.img} alt={product.name} />
      <p>{product.price} $</p>
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
};


export default ProductDetails;
