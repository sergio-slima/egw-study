import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

import Header from './components/Home/Header';
import Books from './components/Home/Books';

import data from './dados.json'; // Importa o arquivo JSON

import './Home.css';

function Home() {
  const { user } = useUser();
  const [dailyCount, setDailyCount] = useState(0);

  const [unlockedBooks, setUnlockedBooks] = useState(1);
  const [userProgress, setUserProgress] = useState(0); // Adiciona o estado para o progresso do usuário

  useEffect(() => {
    const currentDate = new Date().toDateString();
    const lastAccess = localStorage.getItem("lastAccess");
    const storedCount = parseInt(localStorage.getItem("dailyCount"), 10) || 0;

    if (lastAccess === currentDate) {
      // Mesmo dia, mantém a contagem
      setDailyCount(storedCount);
    } else if (lastAccess && new Date(lastAccess) < new Date(currentDate)) {
      // Dia consecutivo, soma 1
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (new Date(lastAccess).toDateString() === yesterday.toDateString()) {
        setDailyCount(storedCount + 1);
        localStorage.setItem("dailyCount", storedCount + 1);
      } else {
        // Mais de um dia sem acessar, zera a contagem
        setDailyCount(1);
        localStorage.setItem("dailyCount", 1);
      }
    } else {
      // Primeiro acesso ou nova contagem
      setDailyCount(1);
      localStorage.setItem("dailyCount", 1);
    }

    // Atualiza o último acesso com a data atual
    localStorage.setItem("lastAccess", currentDate);
  }, []);

  // Carregar progresso do localStorage e calcular o progresso do usuário
  useEffect(() => {
    const completedEvaluations = JSON.parse(localStorage.getItem('completedEvaluations')) || {};
    const totalModules = data.books.reduce((acc, book) => acc + book.modules.length, 0); // Total de módulos
    let completedModules = 0;

    Object.keys(completedEvaluations).forEach(bookId => {
      const evaluations = completedEvaluations[bookId];
      completedModules += Object.keys(evaluations).length; // Contar quantas avaliações foram concluídas
    });

    const progressPercentage = Math.round((completedModules / totalModules) * 100); // Calcula a porcentagem
    setUserProgress(progressPercentage); // Atualiza o estado com o progresso do usuário

    // Carrega o progresso de livros desbloqueados
    const savedProgress = parseInt(localStorage.getItem('bookProgress'), 10) || 1;
    setUnlockedBooks(savedProgress);
  }, []);

  return (
    <div>      
      <Header dailyCount={dailyCount} /> 

      <div className="content">
        <div className='userName'>
          <h1>Olá, {user.fullName}</h1>

          {/* BOTÃO TESTE */}
          {/* <button onClick={() => {
            const newProgress = progress + 10;
            if (newProgress <= 100) {
              setProgress(newProgress);
              localStorage.setItem('studyProgress', newProgress);
            }
          }}><img src={playIcon} alt="Play" /></button> */}
        </div>

        {/* <div className="progress-container">
          <p>Seu progresso de estudos:</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
        </div> */}
         {/* Mostra o progresso do usuário */}
        <div className="progress-container">
          <p>Seu progresso de estudos:</p>
          {/* <progress value={userProgress} max="100"></progress> */}
          <div className="progress-bar">
            <div className="progress" style={{ width: `${userProgress}%` }}>
              {userProgress}%
            </div>
          </div>
        </div>
      </div>
      
      <Books />
    </div>
  );
}

export default Home;
