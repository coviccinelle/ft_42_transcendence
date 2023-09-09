import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import UserProfile from './components/profile/UserProfile';
import Game from './pages/Game';
import Chat from './pages/Chat';
import SignUp from './pages/SignUp';
import P404 from './pages/P404';
import Registration from './pages/Registration';
import Settings from './pages/Settings';
import './styles/App.css';
import { UserEntity, client } from './main';
import TwoFa from './pages/2fa';
import { io } from 'socket.io-client';

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
  const [socket, setSocket] = useState(io({ autoConnect: false }));

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

  useEffect(() => {
    function handleConnection() {
      console.log('Main socket connected');
    }
    function handleDisconnect() {
      console.log('Main socket disconnected');
    }
    socket.connect();
    socket.on('connect', handleConnection);
    socket.on('disconnect', handleDisconnect);
    return () => {
      socket.off('connect', handleConnection);
      socket.disconnect();
      socket.off('disconnect', handleDisconnect);
    };
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
          <Route
            path="/"
            element={
              <Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route
            path="/profile"
            element={
              <Profile darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            }
          />

          <Route
            path="/chat"
            element={
              <Chat darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            }
          />
          <Route
            path="/game"
            element={
              <Game darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/2fa" element={<TwoFa />} />
          <Route path="*" element={<P404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
