// Signup.tsx
import React from 'react';
import SignUpForm from './SignupForm'; // Update the import

const SignUp: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="container mx-auto p-8">
        <h1>Sign Up</h1>
        <SignUpForm /> {/* Render your SignUpForm component here */}
      </div>
    </div>
  );
};

export default SignUp;
