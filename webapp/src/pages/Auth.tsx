/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import '../styles/Auth.css';
import { cpfMask, phoneMask, removeMask } from '../utils/masks';
import { isValidCPF, isValidEmail } from '../utils/validators';
import { usuarioService, UsuarioCreateDTO } from '../services/usuarioService';
import { authService } from '../services/authService';

interface LoginData {
  login: string;
  senha: string;
}

interface CadastroData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;
  tipoUsuario: 'ALUNO' | 'INSTRUTOR';
}

interface FormErrors {
  [key: string]: string | undefined;
}

const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'cadastro'>('login');
  const [loginData, setLoginData] = useState<LoginData>({ login: '', senha: '' });
  const [cadastroData, setCadastroData] = useState<CadastroData>({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    tipoUsuario: 'ALUNO',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (authService.isAuthenticated()) {
      window.location.href = '/feed';
    }
  }, []);

  const handleModeChange = (newMode: 'login' | 'cadastro') => {
    setMode(newMode);
    setErrors({});
    setSuccessMessage('');
  };

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCadastroChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'cpf') newValue = cpfMask(value);
    else if (name === 'telefone') newValue = phoneMask(value);

    setCadastroData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateLogin = (): boolean => {
    const newErrors: FormErrors = {};
    if (!loginData.login.trim()) newErrors.login = 'E-mail é obrigatório';
    if (!loginData.senha) newErrors.senha = 'Senha é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCadastro = (): boolean => {
    const newErrors: FormErrors = {};

    if (!cadastroData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    else if (cadastroData.nome.trim().length < 2) newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';

    if (!cadastroData.cpf) newErrors.cpf = 'CPF é obrigatório';
    else if (!isValidCPF(cadastroData.cpf)) newErrors.cpf = 'CPF inválido';

    if (!cadastroData.email) newErrors.email = 'E-mail é obrigatório';
    else if (!isValidEmail(cadastroData.email)) newErrors.email = 'E-mail inválido';

    if (!cadastroData.senha) newErrors.senha = 'Senha é obrigatória';
    else if (cadastroData.senha.length < 8) newErrors.senha = 'Senha deve ter pelo menos 8 caracteres';

    if (!cadastroData.confirmarSenha) newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    else if (cadastroData.senha !== cadastroData.confirmarSenha) newErrors.confirmarSenha = 'As senhas não coincidem';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!validateLogin()) return;

    setLoading(true);
    try {
      await authService.login(loginData.login, loginData.senha);
      window.location.href = '/feed';
    } catch (error: any) {
      setErrors({ geral: error.message || 'E-mail ou senha incorretos. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCadastroSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (!validateCadastro()) return;

    setLoading(true);
    try {
      const payload: UsuarioCreateDTO = {
        email: cadastroData.email,
        cpf: removeMask(cadastroData.cpf),
        telefone: cadastroData.telefone ? removeMask(cadastroData.telefone) : undefined,
        nome: cadastroData.nome,
        senha: cadastroData.senha,
        tipoUsuario: cadastroData.tipoUsuario,
      };

      await usuarioService.criar(payload);
      setSuccessMessage('Cadastro realizado com sucesso! Redirecionando...');
      setCadastroData({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        senha: '',
        confirmarSenha: '',
        tipoUsuario: 'ALUNO',
      });

      setTimeout(() => {
        setMode('login');
        setSuccessMessage('');
      }, 2000);
    } catch (error: any) {
      setErrors({ geral: error.message || 'Erro ao cadastrar. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`kh ${mode === 'login' ? 'kh-login' : 'kh-register'}`}>
      <div className="kh-page">
        <div className="kh-side">
          <img src="/logo_real.png" alt="Identidade Visual KnowHall" />
        </div>

        <div className="kh-col">
          <div className="kh-logo-top">
            <img src="/logo_kh.svg" alt="KnowHall" />
          </div>

          <div className="kh-card glow">
            <h1 className="kh-title">{mode === 'login' ? 'Bem Vindo!' : 'Crie sua Conta!'}</h1>

            <div className="slide-container" role="tablist" aria-label="Alternar entre Cadastro e Login">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'cadastro'}
                className={`slide-register ${mode === 'cadastro' ? 'active' : ''}`}
                onClick={() => handleModeChange('cadastro')}
              >
                Cadastre-se
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                className={`slide-login ${mode === 'login' ? 'active' : ''}`}
                onClick={() => handleModeChange('login')}
              >
                Login
              </button>
            </div>

            {successMessage && <div className="success-message">{successMessage}</div>}
            {errors.geral && <div className="error-message">{errors.geral}</div>}

            <div className="forms-wrapper">
                <div className={`form-container ${mode === 'login' ? 'active' : ''}`}>
                <form onSubmit={handleLoginSubmit} className="kh-form">
                    <div className="kh-field">
                    <label htmlFor="login" className="req">
                        E-mail
                    </label>
                    <input
                        type="text"
                        id="login"
                        name="login"
                        placeholder="seu@email.com"
                        value={loginData.login}
                        onChange={handleLoginChange}
                        disabled={loading}
                    />
                    {errors.login && <span className="error">{errors.login}</span>}
                    </div>

                    <div className="kh-field">
                    <label htmlFor="senha" className="req">
                        Senha
                    </label>
                    <input
                        type="password"
                        id="senha"
                        name="senha"
                        placeholder="Sua senha"
                        value={loginData.senha}
                        onChange={handleLoginChange}
                        disabled={loading}
                    />
                    {errors.senha && <span className="error">{errors.senha}</span>}
                    </div>

                    <button type="submit" className="kh-btn" disabled={loading}>
                    {loading ? 'ENTRANDO...' : 'ENTRAR'}
                    </button>
                </form>
                </div>
              <div className={`form-container ${mode === 'cadastro' ? 'active' : ''}`}>
                <form onSubmit={handleCadastroSubmit} className="kh-form">
                  <div className="kh-grid">
                    <div className="kh-field">
                      <label htmlFor="nome" className="req">
                        Nome
                      </label>
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        placeholder="Seu nome completo"
                        value={cadastroData.nome}
                        onChange={handleCadastroChange}
                        disabled={loading}
                      />
                      {errors.nome && <span className="error">{errors.nome}</span>}
                    </div>

                    <div className="kh-field">
                      <label htmlFor="cpf" className="req">
                        CPF
                      </label>
                      <input
                        type="text"
                        id="cpf"
                        name="cpf"
                        placeholder="000.000.000-00"
                        value={cadastroData.cpf}
                        onChange={handleCadastroChange}
                        maxLength={14}
                        disabled={loading}
                      />
                      {errors.cpf && <span className="error">{errors.cpf}</span>}
                    </div>

                    <div className="kh-field">
                      <label htmlFor="email" className="req">
                        E-mail
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="email@exemplo.com"
                        value={cadastroData.email}
                        onChange={handleCadastroChange}
                        disabled={loading}
                      />
                      {errors.email && <span className="error">{errors.email}</span>}
                    </div>

                    <div className="kh-field">
                      <label htmlFor="telefone">Telefone (Opcional)</label>
                      <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        placeholder="(00) 00000-0000"
                        value={cadastroData.telefone}
                        onChange={handleCadastroChange}
                        maxLength={15}
                        disabled={loading}
                      />
                    </div>

                    <div className="kh-field">
                      <label htmlFor="cadastro-senha" className="req">
                        Senha
                      </label>
                      <input
                        type="password"
                        id="cadastro-senha"
                        name="senha"
                        placeholder="Mínimo 8 caracteres"
                        value={cadastroData.senha}
                        onChange={handleCadastroChange}
                        disabled={loading}
                      />
                      {errors.senha && <span className="error">{errors.senha}</span>}
                    </div>

                    <div className="kh-field">
                      <label htmlFor="confirmarSenha" className="req">
                        Confirmar Senha
                      </label>
                      <input
                        type="password"
                        id="confirmarSenha"
                        name="confirmarSenha"
                        placeholder="Confirmar Senha"
                        value={cadastroData.confirmarSenha}
                        onChange={handleCadastroChange}
                        disabled={loading}
                      />
                      {errors.confirmarSenha && <span className="error">{errors.confirmarSenha}</span>}
                    </div>

                    <div className="kh-field kh-field-full">
                      <label htmlFor="tipoUsuario" className="req">
                        Tipo de Usuário
                      </label>
                      <select
                        id="tipoUsuario"
                        name="tipoUsuario"
                        value={cadastroData.tipoUsuario}
                        onChange={handleCadastroChange}
                        disabled={loading}
                      >
                        <option value="ALUNO">Aluno</option>
                        <option value="INSTRUTOR">Instrutor</option>
                      </select>
                      {errors.tipoUsuario && <span className="error">{errors.tipoUsuario}</span>}
                    </div>
                  </div>

                  <button type="submit" className="kh-btn" disabled={loading}>
                    {loading ? 'CADASTRANDO...' : 'CADASTRAR'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;