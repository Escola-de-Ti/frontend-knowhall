import React, { useState, useEffect } from 'react';
import '../styles/Perfil.css';
import PerfilDetalhes from '../components/perfil/PerfilDetalhes';
import PerfilAtividades from '../components/perfil/PerfilAtividades';
import PerfilHistorico from '../components/perfil/PerfilHistorico';
import PerfilSlide from '../components/perfil/PerfilSlide';
import PerfilConquistas from '../components/perfil/PerfilConquistas';
import PerfilCertificados from '../components/perfil/PerfilCertificados';
import PerfilEstatisticas from '../components/perfil/PerfilEstatisticas';
import NavBar from '../components/NavBar';
import { getUsuarioDetalhes, type UsuarioDetalhesDTO } from '../services/perfil.service';

const Perfil: React.FC = () => {
  const [aba, setAba] = useState('Conquistas');
  const [usuarioDetalhes, setUsuarioDetalhes] = useState<UsuarioDetalhesDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const idUsuario = 3;

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const tokenFixo = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGkta25vdy1oYWxsIiwiaWF0IjoxNzYzMDAzMzcyLCJleHAiOjE3NjMwMDY5NzIsInN1YiI6ImdhYnJpZWwubWFyYXNzaUBlbWFpbC5jb20iLCJ0eXAiOiJhY2Nlc3MifQ.ts3zTdJ1OQheTrG4NiFGZVkKFhCS1kcjPwrZtcV8_zA';
        localStorage.setItem('kh_token', tokenFixo);
        
        const dados = await getUsuarioDetalhes(idUsuario);
        console.log('Dados do usuário:', dados);
        console.log('URL da imagem:', dados.imagemUrl);
        setUsuarioDetalhes(dados);
      } catch (err) {
        console.error('Erro ao carregar detalhes do usuário:', err);
        setError('Não foi possível carregar os dados do perfil.');
      } finally {
        setLoading(false);
      }
    };

    carregarDadosUsuario();
  }, [idUsuario]);

  if (loading) {
    return (
      <div className="perfil-page-container">
        <NavBar />
        <div className="perfil-wrap">
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !usuarioDetalhes) {
    return (
      <div className="perfil-page-container">
        <NavBar />
        <div className="perfil-wrap">
          <p>{error || 'Erro ao carregar perfil.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-page-container">
      <NavBar />
      <div className="perfil-wrap">
        <div className="perfil-grid">
          <div className="perfil-card perfil-detalhes-card">
            <PerfilDetalhes
              id_usuario={idUsuario}
              email="" // Email não vem na rota de detalhes
              nome={usuarioDetalhes.nome}
              biografia={usuarioDetalhes.biografia}
              id_imagem_perfil={usuarioDetalhes.imagemUrl}
              status_usuario="ATIVO"
              tipo_usuario="PADRAO"
              interesses={usuarioDetalhes.tags.map(tag => tag.name)}
              onEditar={() => {}}
              onInteresseClick={() => {}}
            />
          </div>

          <div className="perfil-card perfil-historico-card">
            <PerfilHistorico
              nivel={usuarioDetalhes.nivel}
              tokens={usuarioDetalhes.tokens}
              ranking={1} // Ranking não vem na API ainda
              xpAtual={usuarioDetalhes.xp}
              xpNecessario={1000} // XP necessário precisa ser calculado
              progresso={Math.round((usuarioDetalhes.xp / 1000) * 100)}
              posts={usuarioDetalhes.qtdPosts}
              upvotes={usuarioDetalhes.qtdUpVotes + usuarioDetalhes.qtdSuperVotes}
              comentarios={usuarioDetalhes.qtdComentarios}
              workshops={usuarioDetalhes.qtdWorkshops}
              medalSrc="/medalhaHistorico.png"
            />
          </div>
        </div>

        <div className="perfil-slide">
          <PerfilSlide
            tabs={['Conquistas', 'Atividades', 'Certificados', 'Estatísticas']}
            value={aba}
            onChange={setAba}
          />
        </div>

        {aba === 'Conquistas' && <PerfilConquistas />}
        {aba === 'Atividades' && <PerfilAtividades idUsuario={idUsuario} />}
        {aba === 'Certificados' && <PerfilCertificados />}
        {aba === 'Estatísticas' && <PerfilEstatisticas />}
      </div>
    </div>
  );
};

export default Perfil;
