import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  //function toggleDarkMode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`container mx-auto p-4 ${darkMode ? 'dark' : ''}`}>
      <div className="flex iteam-center justify-center mb-4">
        <span role="img" aria-label='night' className="text-2x1 mr-2">
          🌙
        </span>
        <label htmlFor='darkModeToggle' className="cursor-pointer">
          Dark Mode
        </label>
        <input
          type='checkbox'
          id='darkModeToggle'
          className='hidden'
          onChange={toggleDarkMode}
          checked={darkMode}
        />
        <span role="img" aria-label='sun' className="text-2x1 ml-2">
        🌻
        </span>
      </div>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
