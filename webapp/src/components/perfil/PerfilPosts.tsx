import React, { useEffect, useState } from 'react';
import '../../styles/perfil/PerfilAtividades.css';
import { postService, type PostResponseDTO } from '../../services/postService';

type Props = { 
  idUsuario: number;
  isOwnProfile?: boolean;
  postsIniciais?: PostResponseDTO[];
};

export default function PerfilPosts({ idUsuario, isOwnProfile = false, postsIniciais }: Props) {
    const [posts, setPosts] = useState<PostResponseDTO[]>(postsIniciais || []);
    const [loading, setLoading] = useState(!postsIniciais);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [editando, setEditando] = useState<string | null>(null);
    const [tituloEditado, setTituloEditado] = useState('');
    const [descricaoEditada, setDescricaoEditada] = useState('');
    const [deletando, setDeletando] = useState<string | null>(null);

    useEffect(() => {
        if (postsIniciais) return;
        
        const carregarPosts = async () => {
        if (!idUsuario) return;
        
            try {
                setLoading(true);
                const postsUsuario = await postService.buscarPorUsuario(idUsuario.toString());
                setPosts(postsUsuario);
            } catch (err) {
                console.error('Erro ao carregar posts:', err);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        carregarPosts();
    }, [idUsuario, postsIniciais]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.atividade-actions')) {
                setOpenMenu(null);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpenMenu(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const formatarData = (iso: string) =>
        new Date(iso).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const handleEditar = (id: string) => {
        const post = posts.find((p) => p.id === id);
        if (post) {
            setEditando(id);
            setTituloEditado(post.titulo);
            setDescricaoEditada(post.descricao);
            setOpenMenu(null);
        }
    };

    const handleSalvarEdicao = async (id: string) => {
        if (!tituloEditado.trim() || !descricaoEditada.trim()) {
            alert('Título e descrição são obrigatórios');
            return;
        }

        if (tituloEditado.length < 10 || tituloEditado.length > 100) {
            alert('O título deve ter entre 10 e 100 caracteres');
            return;
        }

        if (descricaoEditada.length < 20 || descricaoEditada.length > 2500) {
            alert('A descrição deve ter entre 20 e 2500 caracteres');
            return;
        }

        try {
            await postService.atualizar(id, {
                titulo: tituloEditado,
                descricao: descricaoEditada,
            });

            setPosts((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, titulo: tituloEditado, descricao: descricaoEditada } : p
                )
            );

            setEditando(null);
            setTituloEditado('');
            setDescricaoEditada('');
        } catch (err) {
            console.error('Erro ao editar post:', err);
            alert('Não foi possível editar o post. Tente novamente.');
        }
    };

    const handleCancelarEdicao = () => {
        setEditando(null);
        setTituloEditado('');
        setDescricaoEditada('');
    };

    const handleExcluir = (id: string) => {
        setDeletando(id);
        setOpenMenu(null);
    };

    const handleConfirmarExclusao = async (id: string) => {
        try {
            await postService.deletar(id);
            setPosts((prev) => prev.filter((p) => p.id !== id));
            setDeletando(null);
        } catch (err) {
            console.error('Erro ao excluir post:', err);
            alert('Não foi possível excluir o post. Tente novamente.');
        }
    };

    const handleCancelarExclusao = () => {
        setDeletando(null);
    };

    return (
        <>
        <section className="atividades-container" aria-labelledby="posts-title">
        <header className="atividades-head">
            <div className="atividades-ico" aria-hidden>
            📝
            </div>
            <h3 id="posts-title">Posts</h3>
        </header>

        {loading ? (
            <p className="atividades-loading">Carregando posts...</p>
        ) : posts.length === 0 ? (
            <p className="atividades-empty">Nenhum post encontrado.</p>
        ) : (
            <div className="atividades-list">
            {posts.map((post) => (
                <article key={post.id} className="atividade-card">
                <div className="atividade-left">
                    <span className="dot" aria-hidden />
                    <div className="atividade-meta">
                    <strong className="atividade-tipo">Post</strong>
                    <span className="atividade-data">{formatarData(post.dataCriacao)}</span>
                    </div>
                </div>

                {editando === post.id ? (
                    <div className="atividade-edit-area">
                    <input
                        type="text"
                        value={tituloEditado}
                        onChange={(e) => setTituloEditado(e.target.value)}
                        placeholder="Título (10-100 caracteres)"
                        className="edit-textarea"
                        style={{ minHeight: '40px', resize: 'none' }}
                    />
                    <textarea
                        value={descricaoEditada}
                        onChange={(e) => setDescricaoEditada(e.target.value)}
                        placeholder="Descrição (20-2500 caracteres)"
                        className="edit-textarea"
                        rows={4}
                    />
                    <div className="edit-actions">
                        <button
                        className="edit-btn edit-btn-save"
                        onClick={() => handleSalvarEdicao(post.id)}
                        >
                        Salvar
                        </button>
                        <button
                        className="edit-btn edit-btn-cancel"
                        onClick={handleCancelarEdicao}
                        >
                        Cancelar
                        </button>
                    </div>
                    </div>
                ) : (
                    <p className="atividade-snippet">
                    <strong>{post.titulo}</strong>
                    <br />
                    {post.descricao}
                    </p>
                )}

                <div className="atividade-info">
                    {post.tags && post.tags.length > 0 && (
                    <span className="tags-info">{post.tags.map((tag) => tag.name).join(', ')}</span>
                    )}
                </div>

                {isOwnProfile && (
                    <div className="atividade-actions">
                    <button
                        className="kebab-btn"
                        onClick={() => setOpenMenu(openMenu === post.id ? null : post.id)}
                        aria-label="Mais opções"
                        aria-expanded={openMenu === post.id}
                    >
                        ⋮
                    </button>
                    {openMenu === post.id && (
                        <div className="kebab-menu" role="menu">
                        <button className="kebab-item" onClick={() => handleEditar(post.id)}>
                            Editar
                        </button>
                        <button className="kebab-item" onClick={() => handleExcluir(post.id)}>
                            Excluir
                        </button>
                        </div>
                    )}
                    </div>
                )}
                </article>
            ))}
            </div>
        )}
        </section>

        {deletando && (
            <div className="delete-modal-overlay" onClick={handleCancelarExclusao}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                <h4>Confirmar Exclusão</h4>
                <p>Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.</p>
                <div className="delete-modal-actions">
                <button className="delete-btn delete-btn-confirm" onClick={() => handleConfirmarExclusao(deletando)}>
                    Excluir
                </button>
                <button className="delete-btn delete-btn-cancel" onClick={handleCancelarExclusao}>
                    Cancelar
                </button>
                </div>
            </div>
            </div>
        )}
        </>
    );
}
