import React, { useState, useEffect } from 'react';
import data from './dados.json';
import { useParams } from 'react-router-dom';
import './BookPage.css';

import menuIcon from '../src/assets/menu.svg';
import closeIcon from '../src/assets/close.svg';
import HomeIcon from '../src/assets/home.svg';
import logo from '../src/assets/logo.png';

const BookPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState({});

  const { id } = useParams();
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const book = data.books.find(book => book.id === parseInt(id));
    if (book) {
      setSelectedBook(book);
    }
  }, [id]);

  const handleToggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);//setIsMenuOpen(!isMenuOpen);
  };

  const handleToggleModule = (moduleIndex) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex],
    }));
  };

  const handleSelectChapter = (modIndex, chapIndex) => {
    setSelectedChapter({ moduleIndex: modIndex, chapterIndex: chapIndex });
    setSelectedAnswers({});
    setShowResults({});
  };

  const handleAnswerChange = (questionIndex, altIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: altIndex,
    }));
  };

  const handleCheckAnswers = () => {
    if (!selectedChapter) return;
    
    const { moduleIndex, chapterIndex } = selectedChapter;
    const questions = selectedBook.modules[moduleIndex].chapters[chapterIndex].evaluation.questions;

    const results = {};
    questions.forEach((question, index) => {
      results[index] = {
        correct: question.answer === selectedAnswers[index],
        justification: question.justificativa,
      };
    });

    setShowResults(results);
  };

  // Função para formatar texto e destacar palavras entre *asteriscos*
  const formatText = (text) => {
    const parts = text.split(/(\*[^*]+\*)/);

    return parts.map((part, idx) => 
      part.startsWith("*") && part.endsWith("*") ? (
        <span key={idx} style={{ color: '#4caf50' }}>
          {part.slice(1, -1)}
        </span>
      ) : (
        part
      )
    );
  };

  if (!selectedBook) return <div>Carregando...</div>;

  return (
    <div className="book-page-container">      

      <div className={`sidebar ${isMenuOpen ? 'open' : 'closed'}`}>
        <div className="toggle-menu">
          <div className="logo-page"><img src={logo} alt="Logo" /></div>          
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
                    <li key={chapIndex} onClick={() => handleSelectChapter(modIndex, chapIndex)}>
                      {`Capítulo ${chap.chapter}`}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </aside>        
      </div>

      <button className="toggle-menu-btn" onClick={handleToggleMenu}>
        {isMenuOpen ? <img src={closeIcon} alt="Fechar Menu" /> : <img src={menuIcon} alt="Abrir Menu" />}
      </button>          

      <main className={`content-page ${isMenuOpen ? '' : 'expanded'}`}>
        <div className="bottom-buttons">
          <button className="back-button" onClick={() => window.history.back()}><img src={HomeIcon} alt="Abrir Menu" /></button>
        </div> 
        
        <div className="book-title">{selectedBook.book}</div>         

        {selectedChapter ? (          
          <div className="chapter-content">
            <h3 className="chapter-subtitle">Capítulo: {selectedBook.modules[selectedChapter.moduleIndex].chapters[selectedChapter.chapterIndex].chapter}</h3>
            <h2 className="chapter-title">{selectedBook.modules[selectedChapter.moduleIndex].chapters[selectedChapter.chapterIndex].title}</h2>
            <ul>
              {selectedBook.modules[selectedChapter.moduleIndex].chapters[selectedChapter.chapterIndex].timeline.map((event, eventIndex) => (
                <li key={eventIndex} style={eventIndex === 2 ? { fontStyle: 'italic' } : {}}>
                  {/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i.test(event) ? (
                    <img src={event} alt="Imagem" className="chapter-image" />
                  ) : (
                    formatText(event) // Aplica a formatação de texto para palavras entre *
                  )}
                </li>
              ))}
            </ul>

            <h3 className="chapter-title">Avaliação</h3>
            {selectedBook.modules[selectedChapter.moduleIndex].chapters[selectedChapter.chapterIndex].evaluation.questions.map((question, index) => (
              <div key={index} className="question question-box">
                <p>{question.question}</p>
                <ul>
                  {question.alternatives.map((alt, altIndex) => (
                    <li key={altIndex}>
                      <label>
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={altIndex}
                          checked={selectedAnswers[index] === altIndex}
                          onChange={() => handleAnswerChange(index, altIndex)}
                        />
                        {alt}
                      </label>
                    </li>
                  ))}
                </ul>
                {showResults[index] !== undefined && (
                  <p className={showResults[index].correct ? "correct-answer" : "wrong-answer"} >
                    {showResults[index].correct ? "✅ Resposta correta!" : "❌ Resposta errada!"}
                    <br />
                    <strong>Justificativa:</strong> {showResults[index].justification}
                  </p>
                )}
              </div>
            ))}

            <button className="button-next" onClick={handleCheckAnswers}>Verificar respostas</button>
          </div>
        ) : (
          <p>Selecione um capítulo.</p>
        )}
      </main>
    </div>
  );
};

export default BookPage;
