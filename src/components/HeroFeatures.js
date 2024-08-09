import React from 'react';
import './HeroFeatures.css';
import iconLevel from '../assets/icon-level.png'; // Ícone para Nível Iniciante
import iconTime from '../assets/icon-time.png'; // Ícone para 5h de Conteúdo
import iconCertificate from '../assets/icon-certificate.png'; // Ícone para Com Certificado

function HeroFeatures() {
  return (
    <div className="hero-features">
      <div className="feature">
        <img src={iconCertificate} alt="Com Certificado" className="feature-icon" />
        <span className="feature-text">Aprendizado Grátis Com Certificado</span>
      </div>
    </div>
  );
}

export default HeroFeatures;
