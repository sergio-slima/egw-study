import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './Books.css';

import livro1 from '../../assets/1.png';
import livro2 from '../../assets/2.png';
import livro3 from '../../assets/3.png';
import livro4 from '../../assets/4.png';
import livro5 from '../../assets/5.png';

function Books() {
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

      // Carregar progresso do local storage
  useEffect(() => {
    const progress = localStorage.getItem("bookProgress");
    if (progress) {
      setUnlockedBooks(Number(progress));
    }
  }, []);

  // Salvar progresso no local storage
  const unlockNextBook = () => {
    if (unlockedBooks < books.length) {
      const nextBook = unlockedBooks + 1;
      setUnlockedBooks(nextBook);
      localStorage.setItem("bookProgress", nextBook);
    }
  };

  return (
    <div>
      <div className="books-container">
        {books.map((book, index) => (
          <div key={book.id} className="book-item" onClick={() => handleBookClick(book.id)}>
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
      {/* Botão para desbloquear o próximo livro */}
      {unlockedBooks < books.length && (
        <div className="unlock-button-container">
          <button className="unlock-button" onClick={unlockNextBook}>
            Concluir
          </button>
        </div>
      )}
    </div>
  );
}

export default Books;
