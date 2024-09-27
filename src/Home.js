import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

import Header from './components/Home/Header';
import Books from './components/Home/Books';

import playIcon from '../src/assets/play.svg';

import './Home.css';

function Home() {
  const { user } = useUser();
  const [dailyCount, setDailyCount] = useState(0);

  const [progress, setProgress] = useState(0); // Progresso do estudo

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

  // Aqui pegamos o usuário logado pelo Clerk
  useEffect(() => {    
    // Simula progresso de estudos (pode vir de um banco de dados no futuro)
    const savedProgress = localStorage.getItem('studyProgress');
    setProgress(savedProgress ? Number(savedProgress) : 0);
  }, []);

  return (
    <div>      
      <Header dailyCount={dailyCount} /> 

      <div className="content">
        <div className='userName'>
          <h1>Olá, {user.fullName}</h1>

          {/* BOTÃO TESTE */}
          <button onClick={() => {
            const newProgress = progress + 10;
            if (newProgress <= 100) {
              setProgress(newProgress);
              localStorage.setItem('studyProgress', newProgress);
            }
          }}><img src={playIcon} alt="Play" /></button>
        </div>

        <div className="progress-container">
          <p>Seu progresso de estudos:</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
        </div>
      </div>
      
      <Books />
    </div>
  );
}

export default Home;
