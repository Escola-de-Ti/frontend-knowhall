import React from 'react';
import '../styles/login.css';

const Login = () => {
    return (
        <div className='loginPage'>
            <div>Bem Vindo!</div>
            <div>Nome de Usuário | E-mail</div>
            <input type="text" />
            <div>Senha</div>
            <input type="password" />
            <button>Entrar</button>
            <a href="/">Esqueci minha Senha.</a>
        </div>
    )
}

export default Login