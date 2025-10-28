import React from 'react';
import '../styles/Perfil.css';
import PerfilDetalhes from '../components/perfil/PerfilDetalhes';

const Perfil: React.FC = () => {
  return (
    <div className="perfil-page-container">
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
        onInteresseClick={(t) => {}}
      />
    </div>
  );
};

export default Perfil;