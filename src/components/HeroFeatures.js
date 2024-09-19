import React from 'react';
import './HeroFeatures.css';
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
