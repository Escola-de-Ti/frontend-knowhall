import React, { useState } from 'react';
import SlideLogin from '../components/SlideLogin';
import '../styles/Login.css';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [usernameOrEmail, setUE] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await signIn(usernameOrEmail, password);
    if (ok) nav('/perfil');
    else alert('Falha no login');
  }

  return (
    <div className="kh kh-login">
      <div className="kh-page">
        <div className="kh-side">
          <img src="/logo.svg" alt="Identidade Visual KnowHall" />
        </div>

        <div className="kh-col">
          <div className="kh-logo-top">
            <img src="/logo_kh.svg" alt="KnowHall" />
          </div>

          <div className="kh-card glow">
            <h1 className="kh-title">Bem Vindo!</h1>
            <SlideLogin />
            <form className="kh-form" onSubmit={onSubmit}>
              <div className="kh-field">
                <label htmlFor="username" className="req">Nome de Usuário | E-mail</label>
                <input id="username" value={usernameOrEmail} onChange={e=>setUE(e.target.value)} placeholder="Usuário" required />
              </div>

              <div className="kh-field">
                <label htmlFor="password" className="req">Senha</label>
                <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha" required />
              </div>

              <a href="/recuperar-senha" className="forgot">Esqueci minha Senha.</a>

              <button type="submit" className="kh-btn" disabled={loading}>
                {loading ? 'Entrando...' : 'ENTRAR'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;