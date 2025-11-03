import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SlideLogin from '../components/SlideLogin';
import '../styles/Login.css';

const Login: React.FC = () => {
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const hasBasic = !!import.meta.env.VITE_API_USER;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (hasBasic) {
        localStorage.setItem('kh_token', 'dev-basic');
      } else {
        // JWT real
        // chame seu service de login aqui:
        // await login(usernameOUemail, password)
      }
      nav('/perfil');
    } catch (err: any) {
      console.error('Erro no login:', err?.response || err?.message || err);
      alert('Falha no login: ' + (err?.response?.data?.message || 'verifique o console'));
    }
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
            <form onSubmit={onSubmit} className="kh-form">
              <div className="kh-field">
                <label htmlFor="username" className="req">
                  Nome de Usuário | E-mail
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Usuário"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="kh-field">
                <label htmlFor="password" className="req">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Senha"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <a href="/recuperar-senha" className="forgot">
                Esqueci minha Senha.
              </a>

              <button type="submit" className="kh-btn">
                ENTRAR
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
