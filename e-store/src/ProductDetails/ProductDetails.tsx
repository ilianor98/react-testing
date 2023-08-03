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
}

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Fetch product data from the Flask API based on the productId
    axios.get(`http://localhost:8000/api/product_id/${productId}`).then((response) => {
      setProduct(response.data);
    });
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <img src={product.img} alt={product.name} />
    </div>
  );
};

export default ProductDetails;
