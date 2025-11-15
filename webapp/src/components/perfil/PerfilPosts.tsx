import React, { useEffect, useState } from 'react';
import '../../styles/perfil/PerfilAtividades.css';
import { postService, type PostResponseDTO } from '../../services/postService';

type Props = { idUsuario: number };

export default function PerfilPosts({ idUsuario }: Props) {
    const [posts, setPosts] = useState<PostResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    }, [idUsuario]);

    const formatarData = (iso: string) =>
        new Date(iso).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return (
        <section className="atividades-container" aria-labelledby="posts-title">
        <header className="atividades-head">
            <div className="atividades-ico" aria-hidden>
            📝
            </div>
            <h3 id="posts-title">Meus Posts</h3>
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

                <p className="atividade-snippet">
                    <strong>{post.titulo}</strong>
                    <br />
                    {post.descricao}
                </p>

                <div className="atividade-info">
                    <span>👍 {post.totalUpVotes}</span>
                    {post.tags && post.tags.length > 0 && (
                    <span className="tags-info">{post.tags.map((tag) => tag.name).join(', ')}</span>
                    )}
                </div>
                </article>
            ))}
            </div>
        )}
        </section>
    );
}
