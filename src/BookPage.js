import React, { useState, useEffect } from 'react';
import data from './dados.json'; 
import { useParams } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react"; // Obtenha o ID do usuário a partir do Clerk

import './BookPage.css'; 

import menuIcon from '../src/assets/menu.svg';
import closeIcon from '../src/assets/close.svg';
import logo from '../src/assets/logo.png'; 

const BookPage = () => {
  const { user } = useUser();
  const userId = user ? user.id : null; // Obtenha o ID do usuário do Clerk

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState({}); 
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [completedChapters, setCompletedChapters] = useState({});
  const [completedEvaluations, setCompletedEvaluations] = useState({});

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleToggleModule = (moduleIndex) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex],
    }));
  };

  const { id } = useParams();
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const book = data.books.find(book => book.id === parseInt(id));
    if (book) {
      setSelectedBook(book);
    }
    
    const savedChapters = JSON.parse(localStorage.getItem(`${userId}-completedChapters`)) || {};
    setCompletedChapters(savedChapters);

    const savedEvaluations = JSON.parse(localStorage.getItem(`${userId}-completedEvaluations`)) || {};
    setCompletedEvaluations(savedEvaluations);
  }, [id, userId]);

  const handleChapterComplete = (modIndex, chapIndex) => {
    if (!userId) return;

    const updatedChapters = {
      ...completedChapters,
      [selectedBook.id]: {
        ...completedChapters[selectedBook.id],
        [`${modIndex}-${chapIndex}`]: true
      }
    };
    setCompletedChapters(updatedChapters);
    localStorage.setItem(`${userId}-completedChapters`, JSON.stringify(updatedChapters));
  };  

  const handleSubmitEvaluation = () => {
    const evaluation = selectedBook.modules[selectedEvaluation].evaluation;
    let correctAnswers = 0;

    evaluation.questions.forEach((question, index) => {
      if (question.answer === selectedAnswers[index]) {
        correctAnswers += 1;
      }
    });

    const totalScore = correctAnswers * 2;
    setScore(totalScore);

    if (totalScore >= 8 && userId) {
      const updatedEvaluations = {
        ...completedEvaluations,
        [selectedBook.id]: {
          ...completedEvaluations[selectedBook.id],
          [selectedEvaluation]: totalScore
        }
      };
      setCompletedEvaluations(updatedEvaluations);
      localStorage.setItem(`${userId}-completedEvaluations`, JSON.stringify(updatedEvaluations));
    }
  };

  const handleSelectChapter = (modIndex, chapIndex) => {
    setSelectedChapter({ moduleIndex: modIndex, chapterIndex: chapIndex });
    setSelectedEvaluation(null); 
  };

  const handleSelectEvaluation = (modIndex) => {
    setSelectedEvaluation(modIndex);
    setSelectedChapter(null); 
  };

  const handleAnswerChange = (questionIndex, altIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: altIndex
    }));
  };

  const handleRetryEvaluation = () => {
    setSelectedAnswers({});
    setScore(null);
  };

  const handleNextChapterOrEvaluation = () => {
    const { moduleIndex, chapterIndex } = selectedChapter;
    handleChapterComplete(moduleIndex, chapterIndex);

    const nextChapterIndex = chapterIndex + 1;

    if (nextChapterIndex < selectedBook.modules[moduleIndex].chapters.length) {
      setSelectedChapter({ moduleIndex, chapterIndex: nextChapterIndex });
    } else {
      handleSelectEvaluation(moduleIndex);
    }
  };

  if (!selectedBook) return <div>Carregando...</div>;

  const evaluationCompleted = completedEvaluations[selectedBook.id]?.[selectedEvaluation];

  return (
    <div className="book-page-container">
      <div className={`sidebar ${isMenuOpen ? 'open' : 'closed'}`}>
        <div className='toggle-menu'>
          <div className="logo-page"><img src={logo} alt="Logo" /></div>
          
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
                      <button className='button-chapter' onClick={() => handleSelectChapter(modIndex, chapIndex)}>
                        {`Capítulo ${chapIndex + 1}`}
                      </button>
                    </li>
                  ))}
                  <li className='list-evaluation' onClick={() => handleSelectEvaluation(modIndex)}>
                    📝Avaliação
                  </li>
                </ul>
              )}
            </div>
          ))}
        </aside>

        <div className="bottom-buttons">
          <button className="back-button" onClick={() => window.history.back()}>
            Voltar
          </button>
        </div>
      </div>

      <main className={` content-page ${isMenuOpen ? '' : 'expanded'}`}>
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

            {selectedChapter.chapterIndex === selectedBook.modules[selectedChapter.moduleIndex].chapters.length - 1 ? (
              <button className='button-next' onClick={handleNextChapterOrEvaluation}>Realizar Avaliação</button>
            ) : (
              <button className='button-next' onClick={handleNextChapterOrEvaluation}>Próximo Capítulo</button>
            )}
          </div>
        ) : selectedEvaluation !== null ? (
          <div className="evaluation-content">
            <h2>Avaliação</h2>
            {evaluationCompleted ? (
              <p>Avaliação concluída com {evaluationCompleted} pontos.</p>
            ) : (
              <>
                {selectedBook.modules[selectedEvaluation].evaluation.questions.map((question, index) => (
                  <div key={index} className="question">
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
                  </div>
                ))}

                <button onClick={handleSubmitEvaluation}>Concluir Avaliação</button>
                {score !== null && (
                  <div className="result">
                    <h3>Resultado: {score} pontos</h3>
                    {score >= 8 ? (
                      <p>Você foi aprovado!</p>
                    ) : (
                      <>
                        <p>Você foi reprovado!</p>
                        <button onClick={handleRetryEvaluation}>Refazer Avaliação</button>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <p>Selecione um capítulo ou uma avaliação.</p>
        )}
      </main>
    </div>
  );
};

export default BookPage;
