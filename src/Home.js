import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

import Header from './components/Home/Header';
import Books from './components/Home/Books';
import data from './dados.json';

import './Home.css';

function Home() {
  const { user } = useUser();
  const userId = user ? user.id : null; // Obter o ID do usuário do Clerk
  const [dailyCount, setDailyCount] = useState(0);
  const [unlockedBooks, setUnlockedBooks] = useState(1);
  const [userProgress, setUserProgress] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const currentDate = new Date().toDateString();
    const lastAccess = localStorage.getItem(`${userId}-lastAccess`);
    const storedCount = parseInt(localStorage.getItem(`${userId}-dailyCount`), 10) || 0;

    if (lastAccess === currentDate) {
      setDailyCount(storedCount);
    } else if (lastAccess && new Date(lastAccess) < new Date(currentDate)) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (new Date(lastAccess).toDateString() === yesterday.toDateString()) {
        setDailyCount(storedCount + 1);
        localStorage.setItem(`${userId}-dailyCount`, storedCount + 1);
      } else {
        setDailyCount(1);
        localStorage.setItem(`${userId}-dailyCount`, 1);
      }
    } else {
      setDailyCount(1);
      localStorage.setItem(`${userId}-dailyCount`, 1);
    }

    localStorage.setItem(`${userId}-lastAccess`, currentDate);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const completedEvaluations = JSON.parse(localStorage.getItem(`${userId}-completedEvaluations`)) || {};
    const totalModules = data.books.reduce((acc, book) => acc + book.modules.length, 0);
    let completedModules = 0;

    Object.keys(completedEvaluations).forEach(bookId => {
      const evaluations = completedEvaluations[bookId];
      completedModules += Object.keys(evaluations).length;
    });

    const progressPercentage = Math.round((completedModules / totalModules) * 100);
    setUserProgress(progressPercentage);

    const savedProgress = parseInt(localStorage.getItem(`${userId}-bookProgress`), 10) || 1;
    setUnlockedBooks(savedProgress);
  }, [userId]);

  return (
    <div>
      <Header dailyCount={dailyCount} />
      <div className="content">
        <div className='userName'>
          <h1>Olá, {user.fullName}</h1>
        </div>
        <div className="progress-container">
          <p>Seu progresso de estudos:</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${userProgress}%` }}>
              {userProgress}%
            </div>
          </div>
        </div>
      </div>
      <Books userId={userId} />
    </div>
  );
}

export default Home;
