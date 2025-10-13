import React from 'react';
import SlideLogin from '../components/SlideLogin';
import '../styles/login.css';

const Login: React.FC = () => {
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
            <form action="/login" method="POST" className="kh-form">
              <div className="kh-field">
                <label htmlFor="username" className="req">
                  Nome de Usuário | E-mail
                </label>
                <input type="text" id="username" name="username" placeholder="Usuário" required />
              </div>

              <div className="kh-field">
                <label htmlFor="password" className="req">
                  Senha
                </label>
                <input type="password" id="password" name="password" placeholder="Senha" required />
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
