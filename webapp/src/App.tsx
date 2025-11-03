import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import CriarPost from './pages/CriarPost';
import Perfil from './pages/Perfil';

function isAuth() {
  const basic = import.meta.env.VITE_API_USER;
  const token = localStorage.getItem('kh_token');
  return !!token || !!basic;
}

function Protected({ children }: { children: JSX.Element }) {
  return isAuth() ? children : <Navigate to="/login" replace />;
}

function App() {
  const home = isAuth() ? <Navigate to="/perfil" replace /> : <Navigate to="/login" replace />;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/criar-post" element={<Protected><CriarPost /></Protected>} />
      <Route path="/perfil" element={<Protected><Perfil /></Protected>} />
      <Route path="/" element={home} />
      <Route path="*" element={<div>Página não encontrada</div>} />
    </Routes>
  );
}

export default App;