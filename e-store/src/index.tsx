// src/Index.tsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, /*Link*/ } from 'react-router-dom';
import './index.css';
import App from './App';
import ProductDetails from './ProductDetails/ProductDetails';
import AllProducts from './AllProducts/AllProducts';
import Navbar from './NavBar/Navbar';
import Login from './LogIn/Login';
import Signup from './SignUp/Signup'
import axios from 'axios';

const Index: React.FC = () => {
  const [categories, setCategories] = useState<{ name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className=''>
      <span className='fixed left-0 w-full inline-grid grid-cols-7 gap-4 text-center justify-center'>
      <span></span>
      <span>
      <div className=''>
      <h1>Categories</h1>
      <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">Select a category</option>
        {categories.map((category, index) => (
          <option key={index} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      {selectedCategory && <p>You selected: {selectedCategory}</p>}
    </div>
      </span>
      <span>TEST SPAN </span>
      <span>03</span>
      <span>04</span>
      <span>05</span>
      <span></span>
      </span>
    
    
    
    </div>
  );
};



const Root: React.FC = () => {
    return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/all_products" element={<AllProducts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    );
  };
  
  ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);

export default Index;