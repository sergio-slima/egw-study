import React from 'react';
import './Footer.css';

import icon from '../assets/logo.png'; // Substitua com o caminho correto para sua logo

function Footer() {
  // Função para scrollar até o topo
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <img src={icon} alt="Logo" className="footer-logo" />
        <p className="footer-copyright">© 2024 DevApp. Todos os direitos reservados.</p>
      </div>
      {/* Botão Ir para o topo */}
      <button className="back-to-top" onClick={scrollToTop} title="Ir para o topo">
        <svg fill="none" height="12" viewBox="0 0 12 8" width="12" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.272 8L6 2.79868L10.728 8L12 6.60066L6 0L0 6.60066L1.272 8Z" fill="#E1E1E6"></path>
        </svg>
      </button>
    </footer>
  );
}

export default Footer;
