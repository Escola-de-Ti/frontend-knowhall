import { useEffect, useState } from 'react';
import { getUsuario, UsuarioDTO } from '../services/perfil.service';

export function usePerfil(id: number) {
  const [data, setData] = useState<UsuarioDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getUsuario(id)
      .then(d => alive && setData(d))
      .catch(e => alive && setError(e?.message || 'Erro'))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id]);

  return { data, loading, error };
}