import React, { useState } from 'react';
import '../styles/Perfil.css';
import PerfilDetalhes from '../components/perfil/PerfilDetalhes';
import PerfilAtividades from '../components/perfil/PerfilAtividades';
import PerfilHistorico from '../components/perfil/PerfilHistorico';
import PerfilSlide from '../components/perfil/PerfilSlide';
import PerfilConquistas from '../components/perfil/PerfilConquistas';
import PerfilCertificados from '../components/perfil/PerfilCertificados';
import PerfilEstatisticas from '../components/perfil/PerfilEstatisticas';

const Perfil: React.FC = () => {
  const [aba, setAba] = useState('Conquistas');
  const idUsuario = 1;

  return (
    <div className="perfil-page-container">
      <div className="perfil-wrap">
        <div className="perfil-grid">
          <PerfilDetalhes
            id_usuario={idUsuario}
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

        <PerfilSlide
          tabs={['Conquistas', 'Atividades', 'Certificados', 'Estatísticas']}
          value={aba}
          onChange={setAba}
        />

        {aba === 'Conquistas' && <PerfilConquistas />}
        {aba === 'Atividades' && <PerfilAtividades />}
        {aba === 'Certificados' && <PerfilCertificados />}
        {aba === 'Estatísticas' && <PerfilEstatisticas />}
      </div>
    </div>
  );
};

export default Perfil;
