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
import Loading from '../components/Loading';
import { getUsuario, getUsuarioDetalhes, getMyUser, type UsuarioDetalhesDTO, UsuarioDTO } from '../services/perfil.service';
import { useUser } from '../contexts/UserContext';
import { postService, type PostResponseDTO } from '../services/postService';
import { comentarioService, type ComentarioUsuarioDTO } from '../services/comentarios.service';
import { buscarResumoTransacoes } from '../services/historicoService';

const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [aba, setAba] = useState('Posts');
  const [usuarioDetalhes, setUsuarioDetalhes] = useState<UsuarioDetalhesDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UsuarioDTO | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { user: loggedUser } = useUser();
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);
  const [comentarios, setComentarios] = useState<ComentarioUsuarioDTO[]>([]);
  const [estatisticas, setEstatisticas] = useState<{
    contrib: { posts: number; comentarios: number; upvotesDados: number; workshops: number };
    tokens: { ganhos_total: number; gastos_total: number; saldo_atual: number; total_transacoes: number };
  } | null>(null);

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        setLoading(true);
        setError(null);

        let userId: number;

        if (id) {
          userId = parseInt(id);
          
          // Verifica se é o próprio perfil usando o contexto
          const isSelf = loggedUser?.id === userId;
          setIsOwnProfile(isSelf);
          
          // Se for o próprio perfil, usa os dados do contexto para email
          if (isSelf && loggedUser) {
            setUser(loggedUser);
          }
        } else {
          // Se não tiver ID na URL, usa o usuário logado
          if (loggedUser) {
            setUser(loggedUser);
            userId = loggedUser.id;
            setIsOwnProfile(true);
          } else {
            // Fallback caso o contexto ainda não tenha carregado
            const userData = await getMyUser();
            setUser(userData);
            userId = userData.id;
            setIsOwnProfile(true);
          }
        }

        // Determinar se deve carregar resumo de transações (apenas para próprio perfil)
        const isSelf = !id || (loggedUser?.id === userId);
        
        // Carregar detalhes, posts, comentários em paralelo
        const [dados, postsData, comentariosData] = await Promise.all([
          getUsuarioDetalhes(userId),
          postService.buscarPorUsuario(userId.toString()).catch(err => {
            console.error('Erro ao carregar posts:', err);
            return [];
          }),
          comentarioService.listarPorUsuario(userId).catch(err => {
            console.error('Erro ao carregar comentários:', err);
            return [];
          })
        ]);
        
        // Carregar resumo de transações apenas se for o próprio perfil
        let resumoData = null;
        if (isSelf) {
          resumoData = await buscarResumoTransacoes().catch(err => {
            console.error('Erro ao carregar resumo de transações:', err);
            return null;
          });
        }

        setUsuarioDetalhes(dados);
        setPosts(postsData);
        setComentarios(comentariosData);
        
        // Sempre criar as estatísticas de contribuição
        const estatisticasData: any = {
          contrib: {
            posts: dados.qtdPosts,
            comentarios: dados.qtdComentarios,
            upvotesDados: dados.qtdUpVotes + dados.qtdSuperVotes,
            workshops: dados.qtdWorkshops,
          }
        };
        
        // Adicionar tokens apenas se for o próprio perfil e houver dados
        if (resumoData) {
          estatisticasData.tokens = {
            ganhos_total: resumoData.totalRecebido,
            gastos_total: resumoData.totalGasto,
            saldo_atual: resumoData.saldoAtual,
            total_transacoes: resumoData.totalTransacoes,
          };
        }
        
        setEstatisticas(estatisticasData);
      } catch (err: any) {
        console.error('Erro ao carregar detalhes do usuário:', err);
        setError(err?.message || 'Não foi possível carregar os dados do perfil.');
      } finally {
        setLoading(false);
      }
    };

    carregarDadosUsuario();
  }, [id, loggedUser]);

  if (loading) {
    return (
      <div className="perfil-page-container">
        <NavBar />
        <Loading fullscreen message="Carregando perfil..." />
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
          <PerfilHistorico
            nivel={usuarioDetalhes.nivel}
            tokens={usuarioDetalhes.tokens}
            ranking={usuarioDetalhes.posicaoRanking}
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

        <div className="perfil-slide">
          <PerfilSlide
            tabs={['Posts', 'Comentários', 'Estatísticas']}
            value={aba}
            onChange={setAba}
          />
        </div>

        {aba === 'Posts' && <PerfilPosts idUsuario={user?.id!} isOwnProfile={isOwnProfile} postsIniciais={posts} />}
        {aba === 'Comentários' && (
          <PerfilAtividades idUsuario={user?.id!} isOwnProfile={isOwnProfile} comentariosIniciais={comentarios} />
        )}
        {aba === 'Estatísticas' && <PerfilEstatisticas idUsuario={user?.id!} estatisticasIniciais={estatisticas || undefined} />}
      </div>
    </div>
  );
};

export default Perfil;
