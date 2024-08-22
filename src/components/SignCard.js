import React from 'react';
import './SignCard.css';

import logoIcon from '../assets/icon.png';
import userPlus from '../assets/user-plus.svg';

function SignCard() {
  return (
    <div className="discover-card-wrapper">
      <div className="discover-card-container">
        <div className="discover-card-content">
          {/* Logo e Título */}
          <div className="discover-card-header">
            <img 
              src={logoIcon} 
              alt="Discover" 
              className="Logo" 
              width="55" 
              height="55" 
            />
            <h3 className="discover-title">
              Inicie seus estudos nos livros da Série Conflito agora mesmo
            </h3>
          </div>

          {/* Botão de Criar Conta */}
          <a 
            href="#" 
            className="discover-button"
          >
            <img 
              src={userPlus} 
              alt="User Plus Icon" 
              className="discover-button-icon" 
              width="24" 
              height="24" 
            />
            CRIAR CONTA GRÁTIS
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignCard;
