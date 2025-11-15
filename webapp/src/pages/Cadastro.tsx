/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, FormEvent, ChangeEvent } from 'react';
import SlideLogin from '../components/SlideLogin';
import '../styles/Cadastro.css';
import { cpfMask, phoneMask, removeMask } from '../utils/masks';
import { isValidCPF, isValidEmail } from '../utils/validators';
import { usuarioService, UsuarioCreateDTO } from '../services/usuarioService';

interface FormData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;
  aceitouTermos: boolean;
}

interface FormErrors {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  senha?: string;
  confirmarSenha?: string;
  aceitouTermos?: string;
  geral?: string;
}

const Cadastro: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    aceitouTermos: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;

    if (name === 'cpf') {
      newValue = cpfMask(value);
    } else if (name === 'telefone') {
      newValue = phoneMask(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : newValue,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!isValidCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 8) {
      newErrors.senha = 'Senha deve ter pelo menos 8 caracteres';
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    if (!formData.aceitouTermos) {
      newErrors.aceitouTermos = 'Você deve aceitar os termos de privacidade';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload: UsuarioCreateDTO = {
        email: formData.email,
        cpf: removeMask(formData.cpf),
        telefone: formData.telefone ? removeMask(formData.telefone) : undefined,
        nome: formData.nome,
        senha: formData.senha,
        tipoUsuario: 'ALUNO',
      };

      const usuario = await usuarioService.criar(payload);

      console.log('Usuário cadastrado com sucesso:', usuario);

      setSuccessMessage('Cadastro realizado com sucesso! Redirecionando...');

      setFormData({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        senha: '',
        confirmarSenha: '',
        aceitouTermos: false,
      });

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      setErrors({ geral: error.message || 'Erro ao cadastrar. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

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

            {successMessage && <div className="success-message">{successMessage}</div>}

            {errors.geral && <div className="error-message">{errors.geral}</div>}

            <form onSubmit={handleSubmit} className="kh-form">
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
                    value={formData.nome}
                    onChange={handleChange}
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
                    value={formData.cpf}
                    onChange={handleChange}
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
                    value={formData.email}
                    onChange={handleChange}
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
                    value={formData.telefone}
                    onChange={handleChange}
                    maxLength={15}
                    disabled={loading}
                  />
                  {errors.telefone && <span className="error">{errors.telefone}</span>}
                </div>

                <div className="kh-field">
                  <label htmlFor="senha" className="req">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    placeholder="Mínimo 8 caracteres"
                    value={formData.senha}
                    onChange={handleChange}
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
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.confirmarSenha && <span className="error">{errors.confirmarSenha}</span>}
                </div>
              </div>

              <label htmlFor="aceitouTermos" className="kh-terms">
                <input
                  type="checkbox"
                  id="aceitouTermos"
                  name="aceitouTermos"
                  checked={formData.aceitouTermos}
                  onChange={handleChange}
                  disabled={loading}
                />
                Li e estou de Acordo com os <a href="#">Termos de privacidade</a>
              </label>
              {errors.aceitouTermos && (
                <span className="error" style={{ display: 'block', marginTop: '-10px' }}>
                  {errors.aceitouTermos}
                </span>
              )}

              <button type="submit" className="kh-btn" disabled={loading}>
                {loading ? 'CADASTRANDO...' : 'CADASTRAR'}
              </button>
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
