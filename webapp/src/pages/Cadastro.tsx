import React from "react";
import SlideLogin from "../components/SlideLogin";
import "../styles/cadastro.css";

const Cadastro = () => {
  return (
    <div className="kh kh-register">
      <div className="kh-page">
        <div className="kh-col">
          <div className="kh-logo-top">
            <img src="/logo_kh.svg" alt="KnowHall" />
          </div>

          <div className="kh-card glow">
            <h1 className="kh-title">Crie sua Conta!</h1>
            <SlideLogin />

            <form action="/register" method="POST" className="kh-form">
              <div className="kh-grid">
                <div className="kh-field">
                  <label htmlFor="username" className="req">Nome de Usuário</label>
                  <input type="text" id="username" name="username" placeholder="Usuário" required />
                </div>

                <div className="kh-field">
                  <label htmlFor="cpf" className="req">CPF</label>
                  <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00" required />
                </div>

                <div className="kh-field">
                  <label htmlFor="email" className="req">E-mail</label>
                  <input type="email" id="email" name="email" placeholder="email@exemplo.com" required />
                </div>

                <div className="kh-field">
                  <label htmlFor="phone">Telefone (Opcional)</label>
                  <input type="tel" id="phone" name="phone" placeholder="(00) 00000-0000" />
                </div>

                <div className="kh-field">
                  <label htmlFor="password" className="req">Senha</label>
                  <input type="password" id="password" name="password" placeholder="Senha" required />
                </div>

                <div className="kh-field">
                  <label htmlFor="confirm-password" className="req">Confirmar Senha</label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    placeholder="Confirmar Senha"
                    required
                  />
                </div>
              </div>

              <label htmlFor="checkbox" className="kh-terms">
                <input type="checkbox" id="checkbox" name="checkbox" required />
                Li e estou de Acordo com os <a href="#">Termos de privacidade</a>
              </label>

              <button type="submit" className="kh-btn">CADASTRAR</button>
            </form>
          </div>
        </div>

        <div className="kh-side">
          <img src="/logo.svg" alt="Identidade Visual KnowHall" />
        </div>
      </div>
    </div>
  );
};

export default Cadastro;