import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import CriarPost from './pages/CriarPost';
import CriarWorkshop from './pages/CriarWorkshop';
import Perfil from './pages/Perfil';
import Feed from './pages/Feed';
import EditarPerfil from './pages/EditarPerfil';
import NotFound from './components/NotFound';
import Ranking from './pages/Ranking';
import Workshops from './pages/Workshops';
import HistoricoTransacoes from './pages/HistoricoTransacoes';
import { NotificationProvider } from './contexts/NotificationContext';
import { UserProvider } from './contexts/UserContext';
import EditarWorkshop from './pages/EditarWorkshop';

function isAuth() {
  const basic = import.meta.env.VITE_API_USER;
  const token = localStorage.getItem('kh_access_token');
  return !!token || !!basic;
}

function App() {
  const home = isAuth() ? <Navigate to="/feed" replace /> : <Navigate to="/feed" replace />;

  return (
    <>
      <Toaster
        position="top-right"
        containerStyle={{
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            zIndex: 99999,
          },
        }}
      />
      <NotificationProvider>
        <UserProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/criar-post" element={<CriarPost />} />
            <Route path="/criar-workshop" element={<CriarWorkshop />} />
            <Route path="/workshops/:id/editar" element={<EditarWorkshop />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/perfil/:id" element={<Perfil />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/perfil/editar-perfil" element={<EditarPerfil />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/historico-transacoes" element={<HistoricoTransacoes />} />
            <Route path="/" element={home} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserProvider>
      </NotificationProvider>
    </>
  );
}

export default App;
