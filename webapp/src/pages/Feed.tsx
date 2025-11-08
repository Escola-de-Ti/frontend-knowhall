import React, { useState } from 'react';
import '../styles/Feed.css';

import NavBar from '../components/NavBar';
import PostCard, { Post } from '../components/feed/Post';
import WorkshopList, { WorkshopItem } from '../components/feed/WorkshopList';
import RankingList, { RankUser } from '../components/feed/RankingList';

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

  const workshops: WorkshopItem[] = [
    {
      id: 1,
      titulo: 'Introdução ao React Hooks',
      data: '15 Set 2025',
      vagas: '12/20',
      duracao: '2h',
    },
    {
      id: 2,
      titulo: 'Clean Architecture na Prática',
      data: '15 Set 2025',
      vagas: '12/20',
      duracao: '2h',
    },
    { id: 3, titulo: 'Introdução ao MySQL', data: '15 Set 2025', vagas: '12/20', duracao: '2h' },
    { id: 4, titulo: 'SpringBoot + React', data: '15 Set 2025', vagas: '12/20', duracao: '2h' },
  ];

  const ranking: RankUser[] = [
    { id: 1, nome: 'Matheus Rossini', iniciais: 'MR', nivel: 18, tokens: '5.650' },
    { id: 2, nome: 'Kauan Bertalha', iniciais: 'KB', nivel: 17, tokens: '5.450' },
    { id: 3, nome: 'Andre Jacob', iniciais: 'AJ', nivel: 15, tokens: '5.630' },
    { id: 4, nome: 'Gabriel Marassi', iniciais: 'GM', nivel: 14, tokens: '4.860' },
    { id: 5, nome: 'Willyan Tomaz', iniciais: 'WT', nivel: 13, tokens: '4.560' },
    { id: 6, nome: 'Fulano Beltrano', iniciais: 'FB', nivel: 12, tokens: '4.310' },
    { id: 7, nome: 'Ciclano Souza', iniciais: 'CS', nivel: 12, tokens: '4.200' },
    { id: 8, nome: 'Bruno Dias', iniciais: 'BD', nivel: 11, tokens: '3.990' },
    { id: 9, nome: 'Lari Santos', iniciais: 'LS', nivel: 11, tokens: '3.820' },
    { id: 10, nome: 'Gabi Ferreira', iniciais: 'GF', nivel: 10, tokens: '3.600' },
  ];

  return (
    <div className="feed-page">
      <NavBar />

      <main className="feed-container">
        <aside className="feed-left">
          <div className="feed-left-head">
            <button className="btn-create" type="button" onClick={() => {}}>
              <span className="ico-plus" aria-hidden />
              <span className="lbl-grad">Criar Post</span>
            </button>
          </div>

          <WorkshopList itens={workshops} onVerMais={() => {}} />
        </aside>

        <section className="feed-center">
          <div className="feed-filters-bar">
            <button className="btn-filter" type="button" onClick={() => {}}>
              <span className="ico-filter" aria-hidden />
              <span className="lbl-filter">Filtros</span>
            </button>
          </div>

          <div className="posts-stack">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>

        <aside className="feed-right">
          <RankingList users={ranking} onVerMais={() => {}} />
        </aside>
      </main>
    </div>
  );
}
