import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../../dados.json';

import './Books.css';

import livro1 from '../../assets/1.png';
import livro2 from '../../assets/2.png';
import livro3 from '../../assets/3.png';
import livro4 from '../../assets/4.png';
import livro5 from '../../assets/5.png';

function Books({ userId }) {
  const navigate = useNavigate();

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const books = [
    { id: 1, title: "Livro 1", image: livro1 },
    { id: 2, title: "Livro 2", image: livro2 },
    { id: 3, title: "Livro 3", image: livro3 },
    { id: 4, title: "Livro 4", image: livro4 },
    { id: 5, title: "Livro 5", image: livro5 },
  ];

  const [unlockedBooks, setUnlockedBooks] = useState(1);
  const [userProgress, setUserProgress] = useState(0);

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

  const unlockNextBook = () => {
    if (unlockedBooks < books.length) {
      const nextBook = unlockedBooks + 1;
      setUnlockedBooks(nextBook);
      localStorage.setItem(`${userId}-bookProgress`, nextBook);
    }
  };

  return (
    <div>
      <div className="books-container">
        {books.map((book, index) => (
          <div key={book.id} className="book-item" onClick={() => index < unlockedBooks && handleBookClick(book.id)}>
            <img
              src={book.image}
              alt={book.title}
              className={index < unlockedBooks ? "book-image" : "book-image locked"}
            />
            {index >= unlockedBooks && (
              <div className="lock-overlay">
                <span role="img" aria-label="locked">🔒</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Books;


{/* Botão para desbloquear o próximo livro
{unlockedBooks < books.length && (
  <div className="unlock-button-container">
    <button className="unlock-button" onClick={unlockNextBook}>
      Desbloquear Próximo Livro
    </button>
  </div>
)} */}