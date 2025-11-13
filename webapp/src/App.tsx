import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import CriarPost from './pages/CriarPost';
import CriarWorkshop from './pages/CriarWorkshop';
import Perfil from './pages/Perfil';
import Feed from './pages/Feed';
import Workshops from './pages/Workshops';
import NotFound from './components/NotFound';

function isAuth() {
  const basic = import.meta.env.VITE_API_USER;
  const token = localStorage.getItem('kh_token');
  return !!token || !!basic;
}

function App() {
  const home = isAuth() ? <Navigate to="/feed" replace /> : <Navigate to="/feed" replace />;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/criar-post" element={<CriarPost/>} />
      <Route path="/criar-workshop" element={<CriarWorkshop />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/workshops" element={<Workshops />} />
      <Route path="/" element={home} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
