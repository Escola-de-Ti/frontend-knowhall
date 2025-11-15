import React, { JSX } from 'react';
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
import WorkshopParticipantes from './pages/WorkshopParticipantes'; // 🔹 NOVO IMPORT

function isAuth() {
  const basic = import.meta.env.VITE_API_USER;
  const token = localStorage.getItem('kh_access_token');
  return !!token && !!basic;
}

function PrivateRoute({ children }: { children: JSX.Element }) {
  if (!isAuth()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicRoute({ children }: { children: JSX.Element }) {
  if (isAuth()) {
    return <Navigate to="/feed" replace />;
  }
  return children;
}

function App() {
  const home = isAuth() ? <Navigate to="/feed" replace /> : <Navigate to="/login" replace />;

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
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/cadastro"
              element={
                <PublicRoute>
                  <Cadastro />
                </PublicRoute>
              }
            />

            <Route
              path="/criar-post"
              element={
                <PrivateRoute>
                  <CriarPost />
                </PrivateRoute>
              }
            />
            <Route
              path="/criar-workshop"
              element={
                <PrivateRoute>
                  <CriarWorkshop />
                </PrivateRoute>
              }
            />
            <Route
              path="/workshops/:id/editar"
              element={
                <PrivateRoute>
                  <EditarWorkshop />
                </PrivateRoute>
              }
            />
            <Route
              path="/workshops/:id/inscritos"
              element={
                <PrivateRoute>
                  <WorkshopParticipantes />
                </PrivateRoute>
              }
            />

            <Route
              path="/perfil"
              element={
                <PrivateRoute>
                  <Perfil />
                </PrivateRoute>
              }
            />
            <Route
              path="/perfil/:id"
              element={
                <PrivateRoute>
                  <Perfil />
                </PrivateRoute>
              }
            />
            <Route
              path="/feed"
              element={
                <PrivateRoute>
                  <Feed />
                </PrivateRoute>
              }
            />
            <Route
              path="/perfil/editar-perfil"
              element={
                <PrivateRoute>
                  <EditarPerfil />
                </PrivateRoute>
              }
            />
            <Route
              path="/ranking"
              element={
                <PrivateRoute>
                  <Ranking />
                </PrivateRoute>
              }
            />
            <Route
              path="/workshops"
              element={
                <PrivateRoute>
                  <Workshops />
                </PrivateRoute>
              }
            />
            <Route
              path="/historico-transacoes"
              element={
                <PrivateRoute>
                  <HistoricoTransacoes />
                </PrivateRoute>
              }
            />

            <Route path="/" element={home} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserProvider>
      </NotificationProvider>
    </>
  );
}

export default App;
