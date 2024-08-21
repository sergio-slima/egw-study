import React, { useState } from 'react';
import './SkillsCarousel.css';

import livro1 from '../assets/1.png';
import livro2 from '../assets/2.png';
import livro3 from '../assets/3.png';
import livro4 from '../assets/4.png';
import livro5 from '../assets/5.png';

function SkillsCarousel() {
  // Array de imagens
  const images = [
    { src: livro1, alt: 'Livro 1' },
    { src: livro2, alt: 'Livro 2' },
    { src: livro3, alt: 'Livro 3' },
    { src: livro4, alt: 'Livro 4' },
    { src: livro5, alt: 'Livro 5' }
  ];

  // Estado para armazenar a imagem atual
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Função para mudar a imagem
  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  // Funções para navegar no carrossel no mobile
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="skills-carousel">
      {/* Imagem Grande */}
      <div className="carousel-image-container">
        <img src={images[currentImageIndex].src} alt={images[currentImageIndex].alt} className="carousel-image" />
      </div>

      {/* Miniaturas na versão desktop */}
      <div className="carousel-thumbnails">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => handleThumbnailClick(index)}
          />
        ))}
      </div>

      {/* Navegação por setas no mobile */}
      <div className="carousel-controls">
        <button onClick={prevImage} className="carousel-button prev">&lt;</button>
        <button onClick={nextImage} className="carousel-button next">&gt;</button>
      </div>
    </div>
  );
}

export default SkillsCarousel;
