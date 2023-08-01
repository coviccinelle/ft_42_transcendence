import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    //load dark mode from local storage if it exists
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    const htmlElement = document.querySelector('html');
    htmlElement?.classList.toggle('dark');
  };


  return (
    <div>
    <div className="p-2 rounded cursor-pointer dark:bg-blue-200 bg-red-200">
      <span
        role="img"
        aria-label="dark mode"
        className="text-2xl mr-2 cursor-pointer"
        onClick={toggleDarkMode}
      >
        {darkMode ? '🌻' : '🌙'}
      </span>
      <label htmlFor="darkModeToggle" className="cursor-pointer">
        Dark Mode
      </label>
      <input
        type="checkbox"
        id="darkModeToggle"
        className="hidden"
        onChange={toggleDarkMode}
        checked={darkMode}
      />
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
