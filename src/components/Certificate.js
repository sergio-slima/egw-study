import React from 'react';

import './Certificate.css';

import SkillsCarousel from './SkillsCarousel';

import imgCertificate from '../assets/certificado.png'

function Certificate() {
  return (
    <section className="certificate-section">
      <div className="certificate-container">
        <span className="certificate-span">Seu futuro após a Leitura</span>

        <h3 className="certificate-title">O que você vai conquistar depois de estudar nesse curso</h3>

        <div className="certificate-grid">
          <div className='certificate-left'>
            <div className="certificate-item know">            
              <h4 className="item-title">Domínio das Profecias</h4>
              <p>Conhecimentos valiosos dos livros da Série Conflito que irão enriquecer sua jornada espiritual</p>
              <div className='item-books'>
                <SkillsCarousel />
              </div>
            </div>
          </div>

          <div className='certificate-right'>
            <div className="certificate-item">            
              <h4 className="item-title">Certificado de Conclusão</h4>
              <p>Certificação reconhecida para destacar seus conhecimentos espirituais e enriquecer sua trajetória de crescimento pessoal</p>
              <div className='item-certificate'>
                <img src={imgCertificate} alt='Certificado de conclusão' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Certificate;
