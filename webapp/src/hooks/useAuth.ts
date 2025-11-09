import { useState } from 'react'
import { login, logout } from '../services/auth.service'

export function useAuth(){
  const [loading,setLoading] = useState(false)
  const signIn = async (email:string, senha:string) => {
    setLoading(true)
    try { await login(email, senha); return true }
    catch { return false }
    finally { setLoading(false) }
  }
  const signOut = () => logout()
  const isAuth = !!localStorage.getItem('kh_token')
  return { signIn, signOut, isAuth, loading }
}