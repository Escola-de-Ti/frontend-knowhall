import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import SlideLogin from '../components/SlideLogin';
import '../styles/Login.css';
import { authService } from '../services/authService';

interface FormData {
  login: string;
  senha: string;
}

interface FormErrors {
  login?: string;
  senha?: string;
  geral?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    login: '',
    senha: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      window.location.href = '/feed';
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.login.trim()) {
      newErrors.login = 'E-mail é obrigatório';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await authService.login(formData.login, formData.senha);

      console.log('Login realizado com sucesso!');

      window.location.href = '/feed';
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      setErrors({
        geral: error.message || 'E-mail ou senha incorretos. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

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

            {errors.geral && <div className="error-message">{errors.geral}</div>}

            <form onSubmit={handleSubmit} className="kh-form">
              <div className="kh-field">
                <label htmlFor="login" className="req">
                  E-mail
                </label>
                <input
                  type="text"
                  id="login"
                  name="login"
                  placeholder="seu@email.com"
                  value={formData.login}
                  onChange={handleChange}
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
                  value={formData.senha}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.senha && <span className="error">{errors.senha}</span>}
              </div>

              <a href="/recuperar-senha" className="forgot">
                Esqueci minha Senha.
              </a>

              <button type="submit" className="kh-btn" disabled={loading}>
                {loading ? 'ENTRANDO...' : 'ENTRAR'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
