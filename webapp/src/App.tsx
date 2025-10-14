import React from 'react';
import logo from './logo.svg';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import { Routes, Route } from 'react-router-dom';
import CriarPost from './pages/CriarPost';

function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/criar-post" element={<CriarPost />} />
    </Routes>
    </>
  );
}

export default App;
