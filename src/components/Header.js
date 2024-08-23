import React, { useEffect, useState } from 'react';
import './Header.css';

import logo from '../assets/logo.png'; 
import userIcon from '../assets/user.svg'

function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <a href="#" className="logo">
          <img src={logo} alt="Logo" />
        </a>
        <div className="nav-buttons">
          <a href="#" className="button enter">
            <img 
              src={userIcon} 
              alt="User Icon" 
              className="button-icon" 
              width="18" 
              height="18" 
            />
            ENTRAR
          </a>
          <a href="#" className="button register">CRIAR CONTA</a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
