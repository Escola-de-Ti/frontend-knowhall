import React from 'react';
import logo from './logo.svg';
import Login from './pages/Login';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
    </>
  );
}

export default App;
