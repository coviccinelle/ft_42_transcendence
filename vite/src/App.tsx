import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import LeaderBoard from './pages/LeaderBoard';
import Game from './pages/Game';
import Chat from './pages/Chat';
import SignUp from './pages/SignUp';
import User from './pages/User';
import P404 from './pages/P404';
import './styles/App.css';
import { UserEntity, client } from './main';

export const getUser = async (): Promise<any> => {
  const { data } = await client.get('/users/me');
  if (!data)
    return (null);
  return (data);
}

export async function handleLogout() {
  await client.get(`/auth/logout`);
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    //load dark mode from local storage if it exists
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
      const htmlElement = document.querySelector('html');
      if (JSON.parse(savedDarkMode)) {
        htmlElement?.classList.add('dark'); // Apply dark mode class if savedDarkMode is true
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));

    const htmlElement = document.querySelector('html');

    if (newDarkMode) {
      htmlElement?.classList.add('dark'); // Apply dark mode class
    } else {
      htmlElement?.classList.remove('dark'); // Remove dark mode class
    }
  };



  return (
    <div>
    <div style={{zIndex: 9999}} //putting the dark mode toggle on top of everything
    className="top-4 fixed right-4 p-2 rounded-full cursor-pointer dark:bg-yellow-200 bg-gray-600" onClick={toggleDarkMode}>
      <span
        role="img"
        aria-label="dark"
        className="cursor-pointer"
      >
        {darkMode ? '🌻' : '🌙'}
      </span>
      <label htmlFor="darkModeToggle" className="cursor-pointer"/>
      <input
        type="checkbox"
        id="darkModeToggle"
        className="hidden"
        onChange={toggleDarkMode}
      />
    </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/game" element={<Game />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/user" element={<User />} />
          <Route path="*" element={<P404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
