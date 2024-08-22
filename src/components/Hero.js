import React from 'react';
import './Hero.css';

import backgroundImage from '../assets/background.jpg'; 
import illustration from '../assets/ellen.png';
import smallIcon from '../assets/iasd.png';

import HeroFeatures from './HeroFeatures';
import ScrollToNext from './ScrollToNext';

function Hero() {
  return (
    <section className="hero" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-left">
          <div className="hero-badge">
            <img src={smallIcon} alt="Icon" className="badge-icon" />
            <span className="badge-text">Curso de Leitura do <br/> Espírito de Profecia</span>
          </div>

          <h1>Aprenda as profecias bíblicas com os escritos de Ellen White</h1>

          <p>Complete os módulos e realize os questionários para receber seu certificado no final.</p>

          <HeroFeatures />
        </div>
        <div className="hero-right">
          <img src={illustration} alt="Ilustração" className="hero-illustration" />
        </div>
      </div>

      <ScrollToNext />
    </section>
  );
}

export default Hero;
