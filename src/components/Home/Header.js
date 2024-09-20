import React from 'react';
import { UserButton } from '@clerk/clerk-react';

import logo from '../../assets/logo.png'; 
import fire from '../../assets/fire.svg'

import './Header.css'; // Importando o CSS

const Header = ({ dailyCount }) => {
  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="Logo" />
      </div>

      <div className="header-user">
        <div className="access-count" aria-haspopup="dialog">
            <img src={fire} alt="Fire" />

            <p>{dailyCount}</p>
        </div>
        <UserButton />
      </div>
    </header>
  );
};

export default Header;
