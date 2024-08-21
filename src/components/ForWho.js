import React from 'react';
import './ForWho.css';

function ForWho() {
  return (
    <section id="for-who" className="for-who-section">
      <div className="for-who-container">
        <div className="for-who-content">
          <span className="for-who-title">Para quem é o EGW STUDY?</span>
          <h2 className="for-who-subtitle">Espírito de Profecia não é um bicho de sete cabeças</h2>
          <p className="for-who-description">
          Este curso de leitura é ideal para aqueles que desejam aprofundar seus conhecimentos nos escritos proféticos de Ellen White, 
          seja para fortalecer sua fé, expandir sua compreensão espiritual ou buscar orientação para a vida cotidiana com base nas revelações divinas.
          </p>
        </div>
        <div className="for-who-items">
          <div className="for-who-item">
            <div className="item-icon check-icon"></div>
            <p>Para você que está começando do zero na leitura dos escritos proféticos de Ellen White</p>
          </div>
          <div className="for-who-item">
            <div className="item-icon check-icon"></div>
            <p>Para quem já está familiarizado com os escritos de Ellen White e deseja aprofundar ainda mais os fundamentos proféticos</p>
          </div>
          <div className="for-who-item">
            <div className="item-icon check-icon"></div>
            <p>Para quem deseja transformar sua vida, mas não sabe por onde iniciar sua jornada espiritual</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForWho;
