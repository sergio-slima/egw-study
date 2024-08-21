import React from 'react';

import './App.css';

import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer'; 
import ForWho from './components/ForWho';
import Certificate from './components/Certificate';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <ForWho />
        <Certificate />
      </main>
      <Footer /> 
    </div>
  );
}

export default App;
