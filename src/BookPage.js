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
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [completedChapters, setCompletedChapters] = useState({}); // Estado para capítulos concluídos
  const [timer, setTimer] = useState(600); // 10 minutos (600 segundos)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const { id } = useParams();
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const book = data.books.find(book => book.id === parseInt(id));
    if (book) {
      setSelectedBook(book);
      setSelectedChapter({ moduleIndex: 0, chapterIndex: 0 });
    }

    // Carregar tamanho da fonte do localStorage
    const savedFontSize = localStorage.getItem("fontSize");
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize, 10));
    }

    // Carregar progresso do localStorage
    const savedProgress = JSON.parse(localStorage.getItem("completedChapters")) || {};
    setCompletedChapters(savedProgress);
  }, [id]);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

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
    setShowEvaluation(false);
    setIsMenuOpen(false);
  };

  // Ajuste do tamanho da fonte
  const handleFontSizeChange = (change) => {
    setFontSize(prevSize => {
      const newSize = prevSize + change;
      if (newSize >= 12 && newSize <= 24) {
        localStorage.setItem("fontSize", newSize);
        return newSize;
      }
      return prevSize;
    });
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
        correctAnswer: question.alternatives[question.answer], // Exibe a resposta correta
      };
    });

    setShowResults(results);

    // Marcar o capítulo como concluído no localStorage
    const updatedChapters = { ...completedChapters };
    if (!updatedChapters[selectedBook.id]) {
      updatedChapters[selectedBook.id] = {};
    }
    updatedChapters[selectedBook.id][`${moduleIndex}-${chapterIndex}`] = true;
    setCompletedChapters(updatedChapters);
    localStorage.setItem("completedChapters", JSON.stringify(updatedChapters));
  };

  const handleStartEvaluation = () => {
    const confirmEvaluation = window.confirm("Você tem 10 minutos para concluir a avaliação. Deseja iniciar agora?");
    if (confirmEvaluation) {
      setShowEvaluation(true);
      setTimer(600);
      setIsTimerRunning(true);
    }
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

        {/* Botões de aumentar/diminuir fonte centralizados */}
        <div className="font-controls">
          <button onClick={() => handleFontSizeChange(-2)}>
            {/* <img src={decreaseFontIcon} alt="Diminuir Fonte" /> */}
            A-
          </button>
          <button onClick={() => handleFontSizeChange(2)}>
            {/* <img src={increaseFontIcon} alt="Aumentar Fonte" /> */}
            A+
          </button>
        </div>

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
                      <input 
                        type="checkbox"
                        checked={!!completedChapters[selectedBook.id]?.[`${modIndex}-${chapIndex}`]} 
                        // disabled
                      />
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
            <ul className="timeline-content" style={{ fontSize: `${fontSize}px` }}>
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

            {/* Botão para iniciar a avaliação */}
            {!showEvaluation && (
              <button className="button-next" onClick={handleStartEvaluation}>
                Realizar Avaliação
              </button>
            )}

            {/* Avaliação (só aparece depois de clicar em "Realizar Avaliação") */}
            {showEvaluation && (
              <>
                <h3 className="chapter-title">Avaliação</h3>
                <p className="timer">Tempo restante: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
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
                        {showResults[index].correct ? "✅ Resposta correta!" : `❌ Resposta errada! A resposta correta era: ${showResults[index].correctAnswer}`}
                        <br />
                        <strong>Justificativa:</strong> {showResults[index].justification}
                      </p>
                    )}
                  </div>
                ))}
                <button className="button-next" onClick={handleCheckAnswers}>Verificar respostas</button>
              </>
            )}

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