import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './Books.css';
import data from '../../dados.json'; // Importa o arquivo JSON com os livros e módulos

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
  const [userProgress, setUserProgress] = useState(0); // Adiciona o estado para o progresso do usuário

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

  // Função para salvar progresso e desbloquear o próximo livro
  const unlockNextBook = () => {
    if (unlockedBooks < books.length) {
      const nextBook = unlockedBooks + 1;
      setUnlockedBooks(nextBook);
      localStorage.setItem('bookProgress', nextBook);
    }
  };

  return (
    <div>
      {/* Mostra o progresso do usuário */}
      {/* <div className="progress-container">
        <p>Progresso: {userProgress}%</p>
        <progress value={userProgress} max="100"></progress>
      </div> */}

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

      {/* Botão para desbloquear o próximo livro
      {unlockedBooks < books.length && (
        <div className="unlock-button-container">
          <button className="unlock-button" onClick={unlockNextBook}>
            Desbloquear Próximo Livro
          </button>
        </div>
      )} */}
    </div>
  );
}

export default Books;
