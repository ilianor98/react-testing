import CartDialog from '@/Cart/CartDialog';
import React from 'react';



const Navbar: React.FC = () => {
  const isLoggedIn = localStorage.getItem('access_token');
  const isAdmin = localStorage.getItem('is_admin') === '1';

  const handleLogout = () => {
    // Clear the access token from local storage
    localStorage.removeItem('access_token');
    localStorage.setItem('user_id', "0");

    // Perform any additional logout-related actions, e.g., notify the server

    // Redirect to the index page
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800">
      <div className="container mx-auto flex items-center justify-between py-4">
        <a href="/" className="text-2xl font-bold text-white">
          My E-Store
        </a>
        <div className="flex space-x-4">
          {isAdmin && ( // Render the "Admin" button only for admin users
              <button className="text-white bg-transparent" onClick={() => (window.location.href = '/admin')}>
                Admin
              </button>
            )}
          <button className="text-white bg-transparent" onClick={() => (window.location.href = '/')}>
            Home
          </button>
          <button className="text-white bg-transparent" onClick={() => (window.location.href = '/all_products')}>
            Products
          </button>
          
            <CartDialog />
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
      
    </nav>
  );
};

export default Navbar;
