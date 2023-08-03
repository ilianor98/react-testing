// src/Index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './index.css';
import App from './App';
import ProductDetails from './ProductDetails/ProductDetails';

const Index: React.FC = () => {
  return (
    <div className="container mx-auto mt-4">
      <h1>Welcome to My E-Store</h1>
      <p>Choose an option:</p>
      <ul>
        <li>
          <Link to="/product/1">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              View Product 1
            </button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

const Root: React.FC = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
        </Routes>
      </Router>
    );
  };
  
  ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);

export default Index;
