/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Perfil.css';
import PerfilDetalhes from '../components/perfil/PerfilDetalhes';
import PerfilAtividades from '../components/perfil/PerfilAtividades';
import PerfilHistorico from '../components/perfil/PerfilHistorico';
import PerfilSlide from '../components/perfil/PerfilSlide';
import PerfilEstatisticas from '../components/perfil/PerfilEstatisticas';
import PerfilPosts from '../components/perfil/PerfilPosts';
import NavBar from '../components/NavBar';
import {
  getUsuario,
  getUsuarioDetalhes,
  getMyUser,
  type UsuarioDetalhesDTO,
  UsuarioDTO,
} from '../services/perfil.service';

const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [aba, setAba] = useState('Posts');
  const [usuarioDetalhes, setUsuarioDetalhes] = useState<UsuarioDetalhesDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UsuarioDTO | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        setLoading(true);
        setError(null);

        if (id) {
          const userId = parseInt(id);

          const userData = await getUsuario(userId);
          setUser(userData);

          try {
            const myUserData = await getMyUser();
            setIsOwnProfile(myUserData.id === userId);
          } catch (err) {
            setIsOwnProfile(false);
          }

          const dados = await getUsuarioDetalhes(userId);
          setUsuarioDetalhes(dados);
        } else {
          const userData = await getMyUser();
          setUser(userData);
          setIsOwnProfile(true);

          const dados = await getUsuarioDetalhes(userData.id);
          setUsuarioDetalhes(dados);
        }
      } catch (err: any) {
        console.error('Erro ao carregar detalhes do usuário:', err);
        setError(err?.message || 'Não foi possível carregar os dados do perfil.');
      } finally {
        setLoading(false);
      }
    };

    carregarDadosUsuario();
  }, [id]);

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
              interesses={usuarioDetalhes.tags.map((tag) => tag.name)}
              onEditar={isOwnProfile ? () => navigate('/perfil/editar-perfil') : undefined}
              onInteresseClick={() => {}}
            />
          </div>

          <div className="perfil-card perfil-historico-card">
            <PerfilHistorico
              nivel={usuarioDetalhes.nivel}
              tokens={usuarioDetalhes.tokens}
              ranking={1}
              xpAtual={usuarioDetalhes.xp}
              xpNecessario={1000}
              progresso={Math.round((usuarioDetalhes.xp / 1000) * 100)}
              posts={usuarioDetalhes.qtdPosts}
              upvotes={usuarioDetalhes.qtdUpVotes + usuarioDetalhes.qtdSuperVotes}
              comentarios={usuarioDetalhes.qtdComentarios}
              workshops={usuarioDetalhes.qtdWorkshops}
              medalSrc="/medalhaHistorico.png"
              isOwnProfile={isOwnProfile}
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
        {aba === 'Atividades' && (
          <PerfilAtividades idUsuario={user?.id!} isOwnProfile={isOwnProfile} />
        )}
        {aba === 'Estatísticas' && <PerfilEstatisticas idUsuario={user?.id!} />}
      </div>
    </div>
  );
};

export default Perfil;
