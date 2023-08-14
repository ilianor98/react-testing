import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Product {
  id: string;  
  name: string;
  description: string;
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
          <div className='col-span-4 md:col-span-2 bg-slate-700 text-center'>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <div>
              <img
                src={product.img}
                className="rounded-md object-fill h-48 w-96"
                alt={product.name}
              />
            </div>
            <p>{product.price} $</p>
          </div>
        </Link>
      ))}
    </main>
  );
};

export default AllProducts;
