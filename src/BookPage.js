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
  const [selectedEvaluation, setSelectedEvaluation] = useState(null); // Controle da avaliação selecionada
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Respostas do usuário
  const [score, setScore] = useState(null); // Pontuação da avaliação
  const [completedChapters, setCompletedChapters] = useState({}); // Capítulos concluídos pelo usuário
  const [completedEvaluations, setCompletedEvaluations] = useState({}); // Avaliações já concluídas

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
    // Carregar capítulos concluídos e avaliações do localStorage
    const savedChapters = JSON.parse(localStorage.getItem('completedChapters')) || {};
    setCompletedChapters(savedChapters);
    const savedEvaluations = JSON.parse(localStorage.getItem('completedEvaluations')) || {};
    setCompletedEvaluations(savedEvaluations);
  }, [id]);

  // Função para selecionar um capítulo
  const handleSelectChapter = (modIndex, chapIndex) => {
    setSelectedChapter({ moduleIndex: modIndex, chapterIndex: chapIndex });
    setSelectedEvaluation(null); // Limpa a avaliação quando um capítulo é selecionado
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

  // Função para selecionar uma avaliação
  const handleSelectEvaluation = (modIndex) => {
    setSelectedEvaluation(modIndex);
    setSelectedChapter(null); // Limpa o capítulo quando uma avaliação é selecionada
  };

  // Função para submeter a avaliação
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

    if (totalScore >= 8) {
      const updatedEvaluations = {
        ...completedEvaluations,
        [selectedBook.id]: {
          ...completedEvaluations[selectedBook.id],
          [selectedEvaluation]: totalScore
        }
      };
      setCompletedEvaluations(updatedEvaluations);
      localStorage.setItem('completedEvaluations', JSON.stringify(updatedEvaluations));
    }
  };

  // Função para registrar a mudança de resposta em uma pergunta
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

  // Função para navegar para o próximo capítulo ou abrir a avaliação
  const handleNextChapterOrEvaluation = () => {
    const { moduleIndex, chapterIndex } = selectedChapter;
    handleChapterComplete(moduleIndex, chapterIndex); // Marcar capítulo atual como concluído

    const nextChapterIndex = chapterIndex + 1;

    if (nextChapterIndex < selectedBook.modules[moduleIndex].chapters.length) {
      // Se houver mais capítulos, abre o próximo
      setSelectedChapter({ moduleIndex, chapterIndex: nextChapterIndex });
    } else {
      // Se não houver mais capítulos, abre a avaliação
      handleSelectEvaluation(moduleIndex);
    }
  };

  if (!selectedBook) return <div>Carregando...</div>;

  const evaluationCompleted = completedEvaluations[selectedBook.id]?.[selectedEvaluation];

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
                        {/* Mostrar somente 'Capítulo X' */}
                        {`Capítulo ${chapIndex + 1}`}
                      </label>
                      <button onClick={() => handleSelectChapter(modIndex, chapIndex)}>
                        Acessar Capítulo
                      </button>
                    </li>
                  ))}
                  <li onClick={() => handleSelectEvaluation(modIndex)}>
                    Avaliação
                  </li>
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

            {/* Botão Próximo Capítulo ou Realizar Avaliação */}
            {selectedChapter.chapterIndex === selectedBook.modules[selectedChapter.moduleIndex].chapters.length - 1 ? (
              <button onClick={handleNextChapterOrEvaluation}>Realizar Avaliação</button>
            ) : (
              <button onClick={handleNextChapterOrEvaluation}>Próximo Capítulo</button>
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
