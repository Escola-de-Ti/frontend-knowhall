import React, { useState } from 'react'
import SlideLogin from '../components/SlideLogin'
import '../styles/Cadastro.css'
import { useNavigate } from 'react-router-dom'
import { criarUsuario } from '../services/usuario.service'

const Cadastro = () => {
  const nav = useNavigate()
  const [form, setForm] = useState({
    username: '',
    cpf: '',
    email: '',
    phone: '',
    password: '',
    confirm: ''
  })
  const [loading, setLoading] = useState(false)

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function onlyDigits(v: string) {
    return (v || '').replace(/\D+/g, '')
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (form.password !== form.confirm) {
      alert('Senhas não conferem')
      return
    }

    const payload = {
      nome: form.username.trim(),
      email: form.email.trim(),
      senha: form.password,
      cpf: form.cpf ? onlyDigits(form.cpf) : undefined,
      telefone: form.phone ? onlyDigits(form.phone) : undefined,
      tipoUsuario: 'ALUNO'
    }

    setLoading(true)
    try {
      await criarUsuario(payload as any)
      alert('Conta criada com sucesso! Faça login.')
      nav('/login')
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === 'string' ? err.response.data : '') ||
        err?.message ||
        'Erro ao criar conta'
      console.error('Erro no cadastro:', { payload, err: err?.response || err })
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

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

            <form onSubmit={onSubmit} className="kh-form">
              <div className="kh-grid">
                <div className="kh-field">
                  <label htmlFor="username" className="req">Nome de Usuário</label>
                  <input id="username" name="username" required value={form.username} onChange={onChange} />
                </div>

                <div className="kh-field">
                  <label htmlFor="cpf" className="req">CPF</label>
                  <input id="cpf" name="cpf" required value={form.cpf} onChange={onChange} />
                </div>

                <div className="kh-field">
                  <label htmlFor="email" className="req">E-mail</label>
                  <input id="email" name="email" type="email" required value={form.email} onChange={onChange} />
                </div>

                <div className="kh-field">
                  <label htmlFor="phone">Telefone (Opcional)</label>
                  <input id="phone" name="phone" value={form.phone} onChange={onChange} />
                </div>

                <div className="kh-field">
                  <label htmlFor="password" className="req">Senha</label>
                  <input id="password" name="password" type="password" required value={form.password} onChange={onChange} />
                </div>

                <div className="kh-field">
                  <label htmlFor="confirm" className="req">Confirmar Senha</label>
                  <input id="confirm" name="confirm" type="password" required value={form.confirm} onChange={onChange} />
                </div>
              </div>

              <label htmlFor="checkbox" className="kh-terms">
                <input type="checkbox" id="checkbox" required />
                Li e estou de acordo com os <a href="#">Termos de privacidade</a>
              </label>

              <button type="submit" className="kh-btn" disabled={loading}>
                {loading ? 'Enviando...' : 'CADASTRAR'}
              </button>
            </form>
          </div>
        </div>

        <div className="kh-side">
          <img src="/logo.svg" alt="Identidade Visual KnowHall" />
        </div>
      </div>
    </div>
  )
}

export default Cadastro