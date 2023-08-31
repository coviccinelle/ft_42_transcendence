import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Game from './pages/Game';
import Chat from './pages/Chat';
import SignUp from './pages/SignUp';
import P404 from './pages/P404';
import Test from './pages/Test';
import './styles/App.css';
import { UserEntity, client } from './main';

export const getUser = async (): Promise<UserEntity | null> => {
  const { data } = await client.get('/users/me');
  if (!data) return null;
  return data;
};

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
    <div className="flex h-screen flex-col">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Home />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}/>
          <Route path="/chat" element={ <Chat darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}/>
          <Route path="/game" element={<Game />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/test" element={<Test darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}/>
          <Route path="*" element={<P404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
