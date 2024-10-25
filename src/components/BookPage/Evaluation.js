import React, { useState, useEffect } from 'react';

const Evaluation = ({ evaluation, moduleId, bookId, userId }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const evaluationKey = `${userId}-evaluation-${bookId}-${moduleId}`;

  useEffect(() => {
    if (!userId) return;
    const storedEvaluation = localStorage.getItem(evaluationKey);
    if (storedEvaluation) {
      const { savedScore } = JSON.parse(storedEvaluation);
      if (savedScore >= 8) {
        setIsCompleted(true);
        setScore(savedScore);
      }
    }
  }, [evaluationKey, userId]);

  const handleAnswerChange = (questionIndex, alternativeIndex) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: alternativeIndex,
    }));
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    evaluation.questions.forEach((question, questionIndex) => {
      if (question.answer === selectedAnswers[questionIndex]) {
        correctAnswers += 1;
      }
    });

    const totalScore = correctAnswers * 2;
    setScore(totalScore);

    if (totalScore >= 8) {
      localStorage.setItem(evaluationKey, JSON.stringify({ savedScore: totalScore }));
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return (
      <div className="evaluation-content">
        <h2>Avaliação Concluída</h2>
        <p>Você já foi aprovado nesta avaliação com {score} pontos.</p>
      </div>
    );
  }

  return (
    <div className="evaluation-content">
      <h2>Avaliação</h2>
      {evaluation.questions.map((question, index) => (
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
                    disabled={isCompleted}
                  />
                  {alt}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button onClick={handleSubmit}>Concluir Avaliação</button>

      {score !== null && (
        <div className="result">
          <h3>Resultado: {score} pontos</h3>
          {score >= 8 ? (
            <p>Você foi aprovado!</p>
          ) : (
            <p>Você foi reprovado! Tente novamente.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Evaluation;
