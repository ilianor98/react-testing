import React, { useState } from 'react';
import CartDialog from '@/Cart/CartDialog';
import CartDialog2 from '@/Cart/CartDialog2';

const Navbar: React.FC = () => {
  const isLoggedIn = localStorage.getItem('access_token');

  const handleLogout = () => {
    // Clear the access token from local storage
    localStorage.removeItem('access_token');
    localStorage.setItem('user_id', "0");

    // Perform any additional logout-related actions, e.g., notify the server

    // Redirect to the index page
    window.location.href = '/';
  };

  const [cartDialogOpen, setCartDialogOpen] = useState(false);

  const handleCartButtonClick = () => {
    setCartDialogOpen(true);
  };

  const handleCloseCartDialog = () => {
    setCartDialogOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800">
      <div className="container mx-auto flex items-center justify-between py-4">
        <a href="/" className="text-2xl font-bold text-white">
          My E-Store
        </a>
        <div className="flex space-x-4">
          <button className="text-white bg-transparent" onClick={() => (window.location.href = '/')}>
            Home
          </button>
          <button className="text-white bg-transparent" onClick={() => (window.location.href = '/all_products')}>
            Products
          </button>
          <button className="text-white bg-transparent" onClick={handleCartButtonClick}>
              Cart
            </button>
            <CartDialog2 />
            {!isLoggedIn && (
              <button className="text-white bg-transparent" onClick={() => (window.location.href = '/signup')}>
                Sign Up
              </button>
            )}
          {isLoggedIn ? (
            <button className="text-white bg-transparent" onClick={handleLogout}>
              Sign Out
            </button>
          ) : (
            <button className="text-white bg-transparent" onClick={() => (window.location.href = '/login')}>
              Sign In
            </button>
          )}
        </div>
      </div>
      {cartDialogOpen && <CartDialog onClose={handleCloseCartDialog}/>}
    </nav>
  );
};

export default Navbar;
