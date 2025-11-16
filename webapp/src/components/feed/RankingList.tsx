import { useNavigate } from 'react-router-dom';
import '../../styles/feed/RankingList.css';
import { RankingUsuarioDTO } from '../../services/usuarioService';

function gerarIniciais(nome: string): string {
  if (!nome) return '??';
  const partes = nome.trim().split(' ');
  if (partes.length === 0) return '??';

  const primeiraLetra = partes[0][0] || '';
  const ultimaLetra = partes.length > 1 ? partes[partes.length - 1][0] || '' : '';

  return `${primeiraLetra}${ultimaLetra}`.toUpperCase();
}

function formatarXP(xp: number): string {
  if (xp >= 10000) {
    return `${(xp / 1000).toFixed(0)}k`;
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k`;
  }
  return xp.toString();
}

type Props = {
  users: RankingUsuarioDTO[];
  onVerMais?: () => void;
};

export default function RankingList({ users, onVerMais }: Props) {
  const navigate = useNavigate();

  const handleUserClick = (userId: number) => {
    navigate(`/perfil/${userId}`);
  };

  return (
    <aside className="rk-panel">
      <header className="rk-head">
        <span className="rk-trophy" aria-hidden />
        <div className="rk-headtxt">
          <h3>Top 10 Ranking</h3>
          <p>Os melhores desenvolvedores da comunidade</p>
        </div>
      </header>

      {users.length === 0 ? (
        <div className="rk-empty">
          <p>Nenhum usuário no ranking ainda</p>
        </div>
      ) : (
        <ul className="rk-list">
          {users.map((u) => {
            const pos = u.posicao;
            const topClass = pos <= 3 ? `rk-top rk-${pos}` : '';

            return (
              <li
                key={u.posicao}
                className={`rk-item ${topClass}`}
                onClick={() => handleUserClick(u.id)}
                style={{ cursor: 'pointer' }}
              >
                <span className="rk-pos">{pos}</span>

                <div className="rk-avatar">{gerarIniciais(u.nome)}</div>

                <div className="rk-main">
                  <strong className="rk-name" title={u.nome}>
                    {u.nome}
                  </strong>

                  <div className="rk-badges">
                    <span className="pill level-pill">Nvl. {u.nivel}</span>

                    <span className="pill token-pill">
                      <img src="/token_ico.svg" alt="" className="rk-token-ico" />
                      <span className="rk-token-val">{formatarXP(u.qntdXp)}</span>
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {onVerMais && users.length > 0 && (
        <button className="rk-more" onClick={onVerMais}>
          <span className="rk-more-plus">+</span>
          <span className="rk-more-text">Ver mais</span>
        </button>
      )}
    </aside>
  );
}