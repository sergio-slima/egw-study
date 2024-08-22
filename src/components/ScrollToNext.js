import React from "react";
import './ScrollToNext.css';

import icondown from '../assets/down.svg';

function ScrollToNext() {
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
        <div className="scroll-down" onClick={scrollToNextSection}>
            <div className="scroll-line"></div>
            <div>
                <button aria-label='Ir para próxima seção' className='button-down'>
                    <img alt='' loading='lazy' decoding='async' data-nimg='1' className='bt-img-1' src={icondown} />
                    <img alt='' loading='lazy' decoding='async' data-nimg='1' className='bt-img-2' src={icondown} />
                </button>  
            </div>
        </div>
    )
}

export default ScrollToNext;