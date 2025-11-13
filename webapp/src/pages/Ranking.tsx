import React from 'react';
import '../styles/Ranking.css';
import NavBar from '../components/NavBar';
import { FaTrophy, FaStar } from 'react-icons/fa';

export default function Ranking() {
  const rankingData = [
    {
      id: 1,
      nome: 'Matheus Rossini',
      posicao: 1,
      cor: '#b14cb3',
      xp: 940,
      nivel: 15,
      tokens: 2780,
    },
    {
      id: 2,
      nome: 'Kauan Bertalha',
      posicao: 2,
      cor: '#2edba7',
      xp: 910,
      nivel: 14,
      tokens: 2510,
    },
    {
      id: 3,
      nome: 'Andre Jacob',
      posicao: 3,
      cor: '#4562f0',
      xp: 880,
      nivel: 13,
      tokens: 2480,
    },
    {
      id: 4,
      nome: 'Gabriel Marassi',
      posicao: 4,
      cor: '#a65bf7',
      xp: 850,
      nivel: 12,
      tokens: 2250,
    },
    {
      id: 5,
      nome: 'Willyan Tomaz',
      posicao: 5,
      cor: '#d36d6d',
      xp: 810,
      nivel: 12,
      tokens: 2180,
    },
  ];

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
              <p>#03</p>
            </div>
          </div>

          <div className="stat-card blue">
            <div className="stat-icon">
              <FaStar color="#7da6ff" />
            </div>
            <div>
              <h2>XP esse mês</h2>
              <p>+800</p>
            </div>
          </div>
        </div>

        <div className="ranking-list">
          <h3 className="ranking-global-title">
            <FaTrophy className="ranking-title-icon" /> Ranking Global
          </h3>

          {rankingData.map((user) => {
            const topThree = user.posicao <= 3;

            return (
              <div
                key={user.id}
                className={`ranking-card ${topThree ? 'top-three' : ''}`}
                style={{
                  borderLeft: `4px solid ${user.cor}`,
                  backgroundColor: topThree ? `${user.cor}22` : '#141417',
                }}
              >
                <div className="ranking-info">
                  <div className="ranking-left">
                    <div className="ranking-header">
                      {topThree && (
                        <FaTrophy
                          className="user-trophy"
                          style={{ color: user.cor }}
                        />
                      )}
                      <span className="ranking-position">#{user.posicao}</span>
                      <span className="ranking-name">{user.nome}</span>
                    </div>

                    <div className="ranking-level-tokens">
                      <span className="level-badge">Nvl. {user.nivel}</span>
                      <span className="token-badge">{user.tokens} tokens</span>
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
