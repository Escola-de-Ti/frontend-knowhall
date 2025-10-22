import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/SlideLogin.css';

export default function SlideLogin() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isLogin = pathname.startsWith('/login');
  const isRegister = pathname.startsWith('/cadastro');

  return (
    <div className="slide-container" role="tablist" aria-label="Alternar entre Cadastro e Login">
      <button
        type="button"
        role="tab"
        aria-selected={isRegister}
        className={`slide-register ${isRegister ? 'active' : ''}`}
        onClick={() => navigate('/cadastro')}
      >
        Cadastre-se
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={isLogin}
        className={`slide-login ${isLogin ? 'active' : ''}`}
        onClick={() => navigate('/login')}
      >
        Login
      </button>
    </div>
  );
}
