import React from 'react';
import '../styles/login.css';

const Login = () => {
  return (
    <>
      <div className="logo-container">
        <img src="/public/logo_kh.svg" alt="Logo KnowHall Escrito por Extenso" />
      </div>

      <div className="logo">
        <img src="/public/logo.svg" alt="Identidade Visual KnowHall" />
      </div>

      <div className="login-container">
        <h1>Bem Vindo!</h1>
        <div>Nome de Usuário | E-mail</div>
        <input type="text" />

        <div>Senha</div>
        <input type="password" />

        <a href="/">Esqueci minha Senha.</a>

        <button type="submit">ENTRAR</button>
      </div>
    </>
  );
};

export default Login;
