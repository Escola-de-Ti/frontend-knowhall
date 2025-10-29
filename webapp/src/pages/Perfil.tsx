import React from 'react';
import '../styles/Perfil.css';
import PerfilDetalhes from '../components/perfil/PerfilDetalhes';
import PerfilHistorico from '../components/perfil/PerfilHistorico';

const Perfil: React.FC = () => {
  return (
    <div className="perfil-page-container">
      <div className="perfil-grid">
        <PerfilDetalhes
          id_usuario={1}
          email="kauan.hb2004@gmail.com"
          nome="Kauan Henrique Bertalha"
          biografia="Desenvolvedor Full Stack com 8 anos de experiência..."
          id_imagem_perfil=""
          status_usuario="ATIVO"
          tipo_usuario="PADRAO"
          interesses={['MySQL', 'JavaScript']}
          onEditar={() => {}}
          onInteresseClick={() => {}}
        />

        <PerfilHistorico
          nivel={15}
          tokens={5680}
          ranking={3}
          xpAtual={27131}
          xpNecessario={30637}
          progresso={72}
          posts={15}
          upvotes={240}
          comentarios={47}
          workshops={8}
          medalSrc="/medalhaHistorico.png"
        />
      </div>
    </div>
  );
};

export default Perfil;
