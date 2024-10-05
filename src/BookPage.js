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
    // Carrega as avaliações já concluídas do localStorage
    const savedEvaluations = JSON.parse(localStorage.getItem('completedEvaluations')) || {};
    setCompletedEvaluations(savedEvaluations);
  }, [id]);

  // Função para selecionar um capítulo
  const handleSelectChapter = (modIndex, chapIndex) => {
    if (selectedChapter?.moduleIndex === modIndex && selectedChapter?.chapterIndex === chapIndex) {
      // Se o usuário clicar no mesmo capítulo, não faz nada
      return;
    }
    setSelectedChapter({ moduleIndex: modIndex, chapterIndex: chapIndex });
    setSelectedEvaluation(null); // Limpa a avaliação quando um capítulo é selecionado
    setScore(null); // Reseta a pontuação
  };

  // Função para selecionar uma avaliação
  const handleSelectEvaluation = (modIndex) => {
    if (selectedEvaluation === modIndex) {
      // Se o usuário clicar na mesma avaliação, não faz nada
      return;
    }
    setSelectedEvaluation(modIndex);
    setSelectedChapter(null); // Limpa o capítulo quando uma avaliação é selecionada
    setScore(null); // Reseta a pontuação
    setSelectedAnswers({}); // Limpa as respostas selecionadas
  };

  const handleAnswerChange = (questionIndex, altIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: altIndex,
    }));
  };

  // Função para concluir a avaliação
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

  // Função para refazer a avaliação
  const handleRetryEvaluation = () => {
    setSelectedAnswers({});
    setScore(null);
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
                    <li key={chapIndex} onClick={() => handleSelectChapter(modIndex, chapIndex)}>
                      {chap.title}
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

        <button className="back-button" onClick={() => window.history.back()}>
          Voltar
        </button>
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
            {/* <img
              src={`path_to_images/${selectedBook.modules[selectedChapter.moduleIndex].chapters[selectedChapter.chapterIndex].image}`}
              alt="Chapter"
            /> */}
            <ul>
              {selectedBook.modules[selectedChapter.moduleIndex].chapters[selectedChapter.chapterIndex].timeline.map((event, eventIndex) => (
                <li key={eventIndex}>{event}</li>
              ))}
            </ul>
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
          <p>Selecione um capítulo ou avaliação para visualizar o conteúdo</p>
        )}
      </main>
    </div>
  );
};

export default BookPage;
