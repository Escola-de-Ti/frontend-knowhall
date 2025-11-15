import React, { useState, useEffect } from 'react';
import '../styles/Ranking.css';
import NavBar from '../components/NavBar';
import { FaTrophy, FaStar } from 'react-icons/fa';
import { usuarioService, RankingUsuarioDTO } from '../services/usuarioService';

export default function Ranking() {
  const [rankingData, setRankingData] = useState<RankingUsuarioDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [userXpThisMonth, setUserXpThisMonth] = useState<number | null>(null);

  // Cores para os 3 primeiros lugares
  const getCorPorPosicao = (posicao: number): string => {
    switch (posicao) {
      case 1: return '#b14cb3'; // Roxo
      case 2: return '#2edba7'; // Verde
      case 3: return '#4562f0'; // Azul
      default: return '#666666'; // Cinza para os demais
    }
  };

  useEffect(() => {
    async function carregarRanking() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await usuarioService.buscarRanking();
        
        setRankingData(response.rankingList.slice(0, 50));
        setUserPosition(response.usuarioLogado.posicao);
        setUserXpThisMonth(response.usuarioLogado.xpRecebidoUltimos30Dias);
        
      } catch (err: any) {
        console.error('Erro ao carregar ranking:', err);
        setError('Não foi possível carregar o ranking.');
      } finally {
        setLoading(false);
      }
    }
    
    carregarRanking();
  }, []);

  if (loading) {
    return (
      <div className="ranking-page">
        <NavBar />
        <div className="ranking-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <p>Carregando ranking...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ranking-page">
        <NavBar />
        <div className="ranking-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ranking-page">
      <div className="navbar-wrapper">
        <NavBar />
      </div>
      <div className="ranking-container">
        <h1 className="ranking-title">Ranking de Usuários</h1>
        <p className="ranking-subtitle">Acompanhe sua posição na comunidade</p>

        <div className="ranking-stats">
          <div className="stat-card green">
            <div className="stat-icon">
              <FaTrophy color="#6ef7c3" />
            </div>
            <div>
              <h2>Ranking Atual</h2>
              <p>#{userPosition ?? '--'}</p>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">
              <FaStar color="#7da6ff" />
            </div>
            <div>
              <h2>XP esse mês</h2>
              <p>+{userXpThisMonth ?? '--'}</p>
            </div>
          </div>
        </div>

        <div className="ranking-list">
          <h3 className="ranking-global-title">
            <FaTrophy className="ranking-title-icon" /> Ranking Global
          </h3>
          {rankingData.map((user) => {
            const topThree = user.posicao <= 3;
            const cor = getCorPorPosicao(user.posicao);
            
            return (
              <div
                key={user.posicao}
                className={`ranking-card ${topThree ? 'top-three' : ''}`}
                style={{
                  borderLeft: `4px solid ${cor}`,
                  backgroundColor: topThree ? `${cor}22` : '#141417',
                }}
              >
                <div className="ranking-info">
                  <div className="ranking-left">
                    <div className="ranking-header">
                      {topThree && (
                        <FaTrophy
                          className="user-trophy"
                          style={{ color: cor }}
                        />
                      )}
                      <span className="ranking-position">#{user.posicao}</span>
                      <span className="ranking-name">{user.nome}</span>
                    </div>
                    <div className="ranking-level-tokens">
                      <span className="level-badge">Nvl. {user.nivel}</span>
                      <span className="token-badge">{user.qntdXp} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}