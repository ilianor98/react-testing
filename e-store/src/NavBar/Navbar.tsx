// Navbar.tsx
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav>
      <div className="container mx-auto flex items-center justify-between py-4 content-center">
        <a href="/" className="text-2xl font-bold">
          My E-Store
        </a>
        <div className="flex space-x-4">
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/cart">Cart</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
