import React, { useState, useEffect } from 'react';
import data from './dados.json';
import { useParams } from 'react-router-dom';
import './BookPage.css';

import menuIcon from '../src/assets/menu.svg';
import closeIcon from '../src/assets/close.svg';
import homeIcon from '../src/assets/home.svg';
import upArrow from '../src/assets/up-arrow.svg';
import logo from '../src/assets/logo.png';

const BookPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      setSelectedChapter({ moduleIndex: 0, chapterIndex: 0 });
    }
  }, [id]);

  const handleToggleMenu = () => {
    setIsMenuOpen(prev => !prev);
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
    setIsMenuOpen(false);
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

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!selectedBook) return <div>Carregando...</div>;

  return (
    <div className="book-page-container">
      
      {/* Barra de menu no topo */}
      <div className="top-menu">
        <button className="toggle-menu-btn" onClick={handleToggleMenu}>
          <img src={isMenuOpen ? closeIcon : menuIcon} alt="Menu" />
        </button>
        <button className="home-button" onClick={() => window.history.back()}>
          <img src={homeIcon} alt="Voltar" />
        </button>
      </div>

      {/* Menu lateral abaixo da barra de menu */}
      <div className={`sidebar ${isMenuOpen ? 'open' : 'closed'}`}>
        {/* Logo no topo do menu lateral */}
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" />
        </div>

        <div className="module-list">
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
        </div>
      </div>

      {/* Conteúdo */}
      <main className="content-page">
        {selectedChapter && (
          <div className="chapter-content">
            <h2 className="book-title">{selectedBook.book}</h2> 
            <h3 className="chapter-subtitle">Capítulo: {selectedBook.modules[selectedChapter.moduleIndex].chapters[selectedChapter.chapterIndex].chapter}</h3>
            <h2 className="chapter-title">{selectedBook.modules[selectedChapter.moduleIndex].chapters[selectedChapter.chapterIndex].title}</h2>
            <ul>
              {selectedBook.modules[selectedChapter.moduleIndex].chapters[selectedChapter.chapterIndex].timeline.map((event, eventIndex) => (
                <li key={eventIndex}>
                  {/\.jpg|\.jpeg|\.png|\.gif$/i.test(event) ? (
                    <img src={event} alt="Imagem do capítulo" className="chapter-image" />
                  ) : (
                    event
                  )}
                </li>
              ))}
            </ul>

            {/* Avaliação */}
            <h3 className="chapter-title">Avaliação</h3>
            {selectedBook.modules[selectedChapter.moduleIndex].chapters[selectedChapter.chapterIndex].evaluation.questions.map((question, index) => (
              <div key={index} className="question-box">
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
                {showResults[index] && (
                  <p className={showResults[index].correct ? "correct-answer" : "wrong-answer"}>
                    {showResults[index].correct ? "✅ Resposta correta!" : "❌ Resposta errada!"}
                    <br />
                    <strong>Justificativa:</strong> {showResults[index].justification}
                  </p>
                )}
              </div>
            ))}

            <button className="button-next" onClick={handleCheckAnswers}>Verificar respostas</button>
            <button className="back-to-top" onClick={handleScrollToTop}>
              <img src={upArrow} alt="Topo" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookPage;
