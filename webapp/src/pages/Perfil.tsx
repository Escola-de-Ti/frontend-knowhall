import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Perfil.css';
import PerfilDetalhes from '../components/perfil/PerfilDetalhes';
import PerfilAtividades from '../components/perfil/PerfilAtividades';
import PerfilHistorico from '../components/perfil/PerfilHistorico';
import PerfilSlide from '../components/perfil/PerfilSlide';
import PerfilEstatisticas from '../components/perfil/PerfilEstatisticas';
import PerfilPosts from '../components/perfil/PerfilPosts';
import NavBar from '../components/NavBar';
import { getUsuario, getUsuarioDetalhes, getMyUser, type UsuarioDetalhesDTO, UsuarioDTO } from '../services/perfil.service';

const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const [aba, setAba] = useState('Posts');
  const [usuarioDetalhes, setUsuarioDetalhes] = useState<UsuarioDetalhesDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UsuarioDTO | null>(null);

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await getMyUser();
        setUser(userData);
        const dados = await getUsuarioDetalhes(userData.id);

        setUsuarioDetalhes(dados);
      } catch (err) {
        console.error('Erro ao carregar detalhes do usuário:', err);
        setError('Não foi possível carregar os dados do perfil.');
      } finally {
        setLoading(false);
      }
    };

    carregarDadosUsuario();
  }, []);

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
              id_usuario={user?.id!}
              email={user?.email || ''}
              nome={usuarioDetalhes.nome}
              biografia={usuarioDetalhes.biografia}
              id_imagem_perfil={usuarioDetalhes.imagemUrl}
              status_usuario="ATIVO"
              tipo_usuario="PADRAO"
              interesses={usuarioDetalhes.tags.map(tag => tag.name)}
              onEditar={() => navigate('/perfil/editar-perfil')}
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
            tabs={['Posts', 'Atividades', 'Estatísticas']}
            value={aba}
            onChange={setAba}
          />
        </div>

        {aba === 'Posts' && <PerfilPosts idUsuario={user?.id!} />}
        {aba === 'Atividades' && <PerfilAtividades idUsuario={user?.id!} />}
        {aba === 'Estatísticas' && <PerfilEstatisticas idUsuario={user?.id!} />}
      </div>
    </div>
  );
};

export default Perfil;
