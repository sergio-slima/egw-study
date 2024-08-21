import React from 'react';

import './Certificate.css';

import SkillsCarousel from './SkillsCarousel';

function Certificate() {
  return (
    <section className="certificate-section">
      <div className="certificate-container">
        <span className="certificate-span">Seu futuro após a Leitura</span>

        <h3 className="certificate-title">O que você vai conquistar depois de estudar nesse curso</h3>

        <div className="certificate-grid">
          <div className='certificate-left'>
            <div className="certificate-item know">            
              <h4 className="item-title">Conhecimentos das Profecias</h4>
              <div className='item-books'>
                <SkillsCarousel />
              </div>
            </div>
          </div>

          <div className='certificate-right'>
            <div className="certificate-item">            
              <h4 className="item-title">Certificado de Conclusão</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Certificate;
