import React from 'react';
import '../styles/DicasPosts.css';

export default function DicasPost() {
  return (
    <aside className="np-aside" aria-labelledby="dicas-title">
      <h3 id="dicas-title">Dicas para bons Posts:</h3>

      <ul className="np-tips">
        <li className="tip tip-green">
          <span aria-hidden="true" />
          Use um título claro e descritivo
        </li>
        <li className="tip tip-pink">
          <span aria-hidden="true" />
          Adicione tags relevantes para facilitar a descoberta
        </li>
        <li className="tip tip-purple">
          <span aria-hidden="true" />
          Inclua exemplos práticos ou código quando possível
        </li>
        <li className="tip tip-blue">
          <span aria-hidden="true" />
          Posts úteis e bem estruturados recebem mais upvotes
        </li>
        <li className="tip tip-red">
          <span aria-hidden="true" />
          Anexe imagens para mais esclarecimento
        </li>
      </ul>
    </aside>
  );
}
