import React, { useState, useEffect } from 'react';
import data from './dados.json'; // Importa o arquivo JSON
import { useParams } from 'react-router-dom';

import './BookPage.css'; // Separando o CSS

import menuIcon from '../src/assets/menu.svg';
import closeIcon from '../src/assets/close.svg';
import logo from '../src/assets/logo.png'; 

const BookPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState({}); // Estado para controle dos módulos expandidos
  const [selectedChapter, setSelectedChapter] = useState(null); // Controle do capítulo selecionado
  const [completedChapters, setCompletedChapters] = useState({}); // Capítulos concluídos pelo usuário

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Alterna a expansão/retração dos módulos
  const handleToggleModule = (moduleIndex) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex], // Expande ou retrai o módulo
    }));
  };

  const { id } = useParams(); // ID do livro passado via URL
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    // Encontra o livro pelo ID
    const book = data.books.find(book => book.id === parseInt(id));
    if (book) {
      setSelectedBook(book);
    }
    // Carregar capítulos concluídos do localStorage
    const savedChapters = JSON.parse(localStorage.getItem('completedChapters')) || {};
    setCompletedChapters(savedChapters);
  }, [id]);

  // Função para selecionar um capítulo
  const handleSelectChapter = (modIndex, chapIndex) => {
    setSelectedChapter({ moduleIndex: modIndex, chapterIndex: chapIndex });
  };

  // Função para marcar capítulo como concluído
  const handleChapterComplete = (modIndex, chapIndex) => {
    const updatedChapters = {
      ...completedChapters,
      [selectedBook.id]: {
        ...completedChapters[selectedBook.id],
        [`${modIndex}-${chapIndex}`]: true
      }
    };
    setCompletedChapters(updatedChapters);
    localStorage.setItem('completedChapters', JSON.stringify(updatedChapters));
  };

  // Função para navegar para o próximo capítulo
  const handleNextChapter = () => {
    const { moduleIndex, chapterIndex } = selectedChapter;
    handleChapterComplete(moduleIndex, chapterIndex); // Marcar capítulo atual como concluído
    const nextChapterIndex = chapterIndex + 1;
    
    // Verifica se ainda há capítulos no módulo
    if (nextChapterIndex < selectedBook.modules[moduleIndex].chapters.length) {
      setSelectedChapter({ moduleIndex, chapterIndex: nextChapterIndex });
    } else {
      // Verifica se há mais módulos
      const nextModuleIndex = moduleIndex + 1;
      if (nextModuleIndex < selectedBook.modules.length) {
        setSelectedChapter({ moduleIndex: nextModuleIndex, chapterIndex: 0 });
      } else {
        alert('Você completou todos os capítulos deste livro!');
      }
    }
  };

  if (!selectedBook) return <div>Carregando...</div>;

  return (
    <div className="book-page-container">
      <div className={`sidebar ${isMenuOpen ? 'open' : 'closed'}`}>
        <div className='toggle-menu'>
          <div className="logo"><img src={logo} alt="Logo" /></div>
          
          <button className="toggle-menu-btn" onClick={handleToggleMenu}>
            {isMenuOpen ? <img src={closeIcon} alt="Fechar Menu" /> : <img src={menuIcon} alt="Abrir Menu" />}
          </button>
        </div>

        <aside className="module-list">
          {selectedBook.modules.map((mod, modIndex) => (
            <div key={modIndex}>
              <h3 onClick={() => handleToggleModule(modIndex)}>
                <span className="module-arrow">{expandedModules[modIndex] ? '▼' : '▶'}</span>
                {mod.moduleTitle}
              </h3>
              {expandedModules[modIndex] && (
                <ul>
                  {mod.chapters.map((chap, chapIndex) => (
                    <li key={chapIndex}>
                      <label>
                        <input 
                          type="checkbox"
                          checked={!!completedChapters[selectedBook.id]?.[`${modIndex}-${chapIndex}`]}
                          onChange={() => handleChapterComplete(modIndex, chapIndex)}
                        />                        
                      </label>
                      <button onClick={() => handleSelectChapter(modIndex, chapIndex)}>
                        {chap.title.split(':')[0]}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </aside>

        {/* Botão Voltar movido para baixo */}
        <div className="bottom-buttons">
          <button className="back-button" onClick={() => window.history.back()}>
            Voltar
          </button>
        </div>
      </div>

      <main className={`content ${isMenuOpen ? '' : 'expanded'}`}>
        {selectedChapter ? (
          <div className="chapter-content">
            <h2>{selectedBook.modules[selectedChapter.moduleIndex].chapters[selectedChapter.chapterIndex].title}</h2>
            <p>{selectedBook.modules[selectedChapter.moduleIndex].chapters[selectedChapter.chapterIndex].content}</p>
            <a
              href={selectedBook.modules[selectedChapter.moduleIndex].chapters[selectedChapter.chapterIndex].image}
              alt="Chapter"
              target='_black'
            >LEIA O CAPITULO 1 AQUI</a>
            <ul>
              {selectedBook.modules[selectedChapter.moduleIndex].chapters[selectedChapter.chapterIndex].timeline.map((event, eventIndex) => (
                <li key={eventIndex}>{event}</li>
              ))}
            </ul>

            {/* Botão Próximo Capítulo */}
            <button onClick={handleNextChapter}>Próximo Capítulo</button>
          </div>
        ) : (
          <p>Selecione um capítulo ou uma avaliação.</p>
        )}
      </main>
    </div>
  );
};

export default BookPage;
