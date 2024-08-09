import React from 'react';
import './Footer.css';
import icon from '../assets/icon.png'; // Substitua com o caminho correto para sua logo

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <img src={icon} alt="Logo" className="footer-logo" />
        <p className="footer-copyright">© 2024 DevApp. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
