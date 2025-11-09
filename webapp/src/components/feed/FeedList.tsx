import React, { useEffect, useState } from 'react';
import Post, { PostModel } from './Post';

export default function FeedList() {
  const [posts, setPosts] = useState<PostModel[]>([]);

  useEffect(() => {
    async function carregar() {
      const MOCK: PostModel[] = [
        {
          id: 1,
          autor: { nome: 'Andre Jacob', iniciais: 'AJ', nivel: 13 },
          titulo: 'Como faço para integrar meu sistema com API de pagamento?',
          corpo:
            'Olá pessoal, tenho um sistema e preciso integrar com alguma API de pagamento, alguém já fez esse processo? é a minha primeira vez e estou um pouco perdido.',
          tags: ['BackEnd', 'MySQL'],
          metrica: { comentarios: 6, upvotes: 21 },
          tempo: '23h atrás',
        },
        {
          id: 2,
          autor: { nome: 'Kauan Bertalha', iniciais: 'KB', nivel: 11 },
          titulo: 'Dica de melhores práticas com Hooks',
          corpo: 'Quais padrões vocês usam para isolar efeitos e criar hooks reutilizáveis?',
          tags: ['React', 'Arquitetura'],
          metrica: { comentarios: 14, upvotes: 58 },
          tempo: '1 dia atrás',
        },
        {
          id: 3,
          autor: { nome: 'Lívia Martins', iniciais: 'LM', nivel: 8 },
          titulo: 'Problemas com CORS em APIs locais',
          corpo:
            'Estou desenvolvendo uma API local e o front está bloqueando as requisições por CORS. Já tentei várias configurações mas nada resolve.',
          tags: ['Node', 'API', 'CORS'],
          metrica: { comentarios: 4, upvotes: 17 },
          tempo: '2d atrás',
        },
      ];

      await new Promise((r) => setTimeout(r, 500));
      setPosts(MOCK);
    }

    carregar();
  }, []);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {posts.map((p) => (
        <Post key={p.id} post={p} />
      ))}
    </div>
  );
}
