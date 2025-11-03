import React, { useState } from 'react';
import SlideLogin from '../components/SlideLogin';
import '../styles/Cadastro.css';
import { http } from '../api/http';

const Cadastro = () => {
  const [form,setForm] = useState({
    username:'', cpf:'', email:'', phone:'', password:'', confirm:'', termos:false
  })
  const [loading,setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    if(form.password !== form.confirm){ alert('Senhas diferentes'); return }
    if(!form.termos){ alert('Aceite os termos'); return }
    setLoading(true)
    try{
      await http.post('/api/usuarios', {
        nome: form.username,
        cpf: form.cpf,
        email: form.email,
        telefone: form.phone || null,
        senha: form.password,
      })
      alert('Conta criada')
    }catch{
      alert('Erro ao cadastrar')
    }finally{ setLoading(false) }
  }

  return (
    <div className="kh kh-register">
      <div className="kh-page">
        <div className="kh-col">
          <div className="kh-logo-top"><img src="/logo_kh.svg" alt="KnowHall" /></div>
          <div className="kh-card glow">
            <h1 className="kh-title">Crie sua Conta!</h1>
            <SlideLogin />
            <form className="kh-form" onSubmit={onSubmit}>
              <div className="kh-grid">
                <div className="kh-field">
                  <label htmlFor="username" className="req">Nome de Usuário</label>
                  <input id="username" value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))} required />
                </div>
                <div className="kh-field">
                  <label htmlFor="cpf" className="req">CPF</label>
                  <input id="cpf" value={form.cpf} onChange={e=>setForm(f=>({...f,cpf:e.target.value}))} required />
                </div>
                <div className="kh-field">
                  <label htmlFor="email" className="req">E-mail</label>
                  <input id="email" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required />
                </div>
                <div className="kh-field">
                  <label htmlFor="phone">Telefone (Opcional)</label>
                  <input id="phone" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
                </div>
                <div className="kh-field">
                  <label htmlFor="password" className="req">Senha</label>
                  <input id="password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required />
                </div>
                <div className="kh-field">
                  <label htmlFor="confirm-password" className="req">Confirmar Senha</label>
                  <input id="confirm-password" type="password" value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))} required />
                </div>
              </div>

              <label htmlFor="checkbox" className="kh-terms">
                <input id="checkbox" type="checkbox" checked={form.termos} onChange={e=>setForm(f=>({...f,termos:e.target.checked}))} required />
                Li e estou de Acordo com os <a href="#">Termos de privacidade</a>
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
  );
};

export default Cadastro;