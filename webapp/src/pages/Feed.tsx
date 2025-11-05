import React, { useState } from 'react';
import '../styles/Feed.css';
import NavBar from '../components/NavBar';
import FeedActions from '../components/feed/FeedActions';
import PostCard, { Post } from '../components/feed/Post';

export default function Feed() {
  const [posts] = useState<Post[]>([
    {
      id: 1,
      autor: { nome: 'Andre Jacob', iniciais: 'AJ', nivel: 13 },
      titulo: 'Como faço para integrar meu sistema com API de pagamento?',
      corpo:
        'Olá pessoal, tenho um sistema e preciso integrar com alguma API de pagamento, alguém já fez esse processo? é a minha primeira vez e estou um pouco perdido.',
      tags: ['BackEnd', 'MySQL'],
      metrica: { comentarios: 21, upvotes: 6 },
      tempo: '23h atrás',
    },
    {
      id: 2,
      autor: { nome: 'Willyan Tomaz', iniciais: 'WT', nivel: 11 },
      titulo: 'Como faço para desenvolver um sistema de gestão de pessoas?',
      corpo:
        'Fui contratado por uma nova empresa e percebi um problema operacional, as coisas são muito manuais e eu queria tornar o processo mais ágil. Tenho certa experiência em...',
      tags: ['BackEnd', 'MySQL'],
      metrica: { comentarios: 21, upvotes: 6 },
      tempo: '23h atrás',
    },
    {
      id: 3,
      autor: { nome: 'Matheus Rossini', iniciais: 'MR', nivel: 12 },
      titulo: 'Como integrar meu sistema com API de pagamento?',
      corpo:
        'Sou novo na área mas tenho interesse em aprender do zero como desenvolver sistemas e aplicativos, mas tenho dúvida sobre qual linguagem é melhor. Alguém tem dicas de como...',
      tags: ['BackEnd', 'MySQL'],
      metrica: { comentarios: 21, upvotes: 6 },
      tempo: '23h atrás',
    },
  ]);

  return (
    <div className="feed-page">
      <NavBar />
      <main className="feed-container">
        <aside className="feed-left" />
        <section className="feed-center">
          <FeedActions onCriarPost={() => {}} onFiltros={() => {}} />
          <div className="posts-stack">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
        <aside className="feed-right" />
      </main>
    </div>
  );
}
