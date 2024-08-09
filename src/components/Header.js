import React, { useEffect, useState } from 'react';
import './Header.css';
import logo from '../assets/logo.png'; 

function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <a href="#" className="logo">
          <img src={logo} alt="Logo" />
        </a>
        <div className="nav-buttons">
          <a href="#" className="button enter">ENTRAR</a>
          <a href="#" className="button register">CRIAR CONTA</a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
