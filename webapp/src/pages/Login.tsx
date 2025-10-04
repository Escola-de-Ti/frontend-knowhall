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
        <form action="/login" method="POST">
          <h1>Bem Vindo!</h1>

          <label htmlFor="username" className='username'>Nome de Usuário | E-mail</label>
          <input type="text" name="username" id="username" placeholder="Usuário" required/>
          
          <label htmlFor="password" className='password'>Senha</label>
          <input type="password" name="password" id="password" placeholder="Senha" required/>

          <a href="/">Esqueci minha Senha.</a>

          <input type="submit" className="submit" value="ENTRAR"/>
        </form>
      </div>
    </>
  );
};

export default Login;
