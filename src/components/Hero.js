import React from 'react';
import './Hero.css';

import backgroundImage from '../assets/background.jpg'; 
import illustration from '../assets/ellen.png';
import smallIcon from '../assets/iasd.png';
import icondown from '../assets/down.svg';

import HeroFeatures from './HeroFeatures';

function Hero() {
  const scrollToNextSection = () => {
    const headerHeight = document.querySelector('header').offsetHeight; // Altura do cabeçalho fixo
    const nextSection = document.querySelector('.for-who-section');
    if (nextSection) {
      window.scrollTo({
        top: nextSection.offsetTop - headerHeight,
        behavior: 'smooth'
      });
    }
  };

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

      <div className="scroll-down" onClick={scrollToNextSection}>
        <div className="scroll-line"></div>
        <div>
          <button aria-label='Ir para próxima seção' className='button-down'>
            <img alt='' loading='lazy' decoding='async' data-nimg='1' className='bt-img-1' src={icondown} />
            <img alt='' loading='lazy' decoding='async' data-nimg='1' className='bt-img-2' src={icondown} />
          </button>  
        </div>
      </div>
    </section>
  );
}

export default Hero;
