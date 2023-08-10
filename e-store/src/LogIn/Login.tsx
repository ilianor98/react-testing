// Login.tsx
import React from 'react';
import LoginForm from './LoginForm'; // Update the import

const Login: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="container mx-auto p-8">
        <h1>Login</h1>
        <LoginForm /> {/* Render your LoginForm component here */}
      </div>
    </div>
  );
};

export default Login;
