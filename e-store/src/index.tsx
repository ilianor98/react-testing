// src/Index.tsx
import React, { /*useState, useEffect*/ } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, /*Link*/ } from 'react-router-dom';
import './index.css';
import App from './App';
import ProductDetails from './ProductDetails/ProductDetails';
import AllProducts from './AllProducts/AllProducts';
import Navbar from './NavBar/Navbar';
import Login from './LogIn/Login';
import Signup from './SignUp/Signup'
import CategoriesList from './Lists/CategoriesList';
import Admin from './Admin/Admin';

const Index: React.FC = () => {

  return (
    <div>
      
    <div className=''>
      <span className=' left-0 w-full inline-grid grid-cols-7 gap-4 text-center justify-center'>
      <span></span>
      <span>
      <CategoriesList />
      </span>
      <span>TEST SPAN </span>
      <span>
        <CategoriesList />
      </span>
      <span>04</span>
      <span>05</span>
      <span></span>
      </span>
    
    
    
    </div>
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
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    );
  };
  
  ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);

export default Index;