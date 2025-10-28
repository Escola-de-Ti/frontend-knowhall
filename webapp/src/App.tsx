import React from 'react';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import { Routes, Route } from 'react-router-dom';
import CriarPost from './pages/CriarPost';
import Perfil from './pages/Perfil';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/criar-post" element={<CriarPost />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
    </>
  );
}

export default App;
