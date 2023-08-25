import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard'; // Import the modified ProductCard component

interface Product {
  id: string;
  name: string;
  img: string;
  price: string;
}

const AllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/all_products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className='m-24 rounded-md grid grid-cols-4 gap-12'>
      {products.map((product) => (
        <Link to={`/product/${product.id}`} key={product.id}>
          <ProductCard product={product} />
        </Link>
      ))}
    </main>
  );
};

export default AllProducts;
