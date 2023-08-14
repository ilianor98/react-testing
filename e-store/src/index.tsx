// src/Index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './index.css';
import App from './App';
import ProductDetails from './ProductDetails/ProductDetails';
import AllProducts from './AllProducts/AllProducts';
import Navbar from './NavBar/Navbar';
import Login from './LogIn/Login';
import Signup from './SignUp/Signup'

const Index: React.FC = () => {
  return (
    <div>
      <h1>test</h1>
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