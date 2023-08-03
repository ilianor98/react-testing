// src/App.tsx
import React from 'react';
import Navbar from './NavBar/Navbar';
import Index from './index'

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Index />
    </div>
  );
};

export default App;
