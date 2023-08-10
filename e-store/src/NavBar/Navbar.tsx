// Navbar.tsx
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800">
      <div className="container mx-auto flex items-center justify-between py-4">
        <a href="/" className="text-2xl font-bold text-white">
          My E-Store
        </a>
        <div className="flex space-x-4">
          <a href="/" className="text-white">
            Home
          </a>
          <a href="/products" className="text-white">
            Products
          </a>
          <a href="/cart" className="text-white">
            Cart
          </a>
          <a href="/login" className="text-white">
            Log In
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
