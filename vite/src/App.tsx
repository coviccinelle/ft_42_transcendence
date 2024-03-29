import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Game from './pages/Game';
import Chat from './pages/Chat';
import P404 from './pages/P404';
import Registration from './pages/Registration';
import Settings from './pages/Settings';
import './styles/App.css';
import { UserEntity, client, domainName } from './main';
import TwoFa from './pages/Enable-2fa';
import { io } from 'socket.io-client';
import VerifyTwoFA from './pages/Verify-2fa';
import EnableTwoFA from './pages/Enable-2fa';
import DisableTwoFA from './pages/Disable-2fa';

export const getUser = async (): Promise<UserEntity | null> => {
  const { data } = await client.get('/users/me');
  if (!data) return null;
  return data;
};

export async function handleLogout() {
  await client.get(`/auth/logout`);
}

function App() {
  if (!domainName || domainName == undefined) {
    console.log("ERROR DOMAIN NAME IS UNDEFINED");
    return;
  }
  // set darkmode to true by default
  const [darkMode, setDarkMode] = useState(false);
  // const location = useLocation();
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
      console.log('connected main');
    }
    function handleDisconnect() {
      console.log('disconnected main');
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

  // const showDarkModeButton = location.pathname === '/login' || location.pathname === '/';

  return (
    <div className="flex h-screen flex-col">
      <div
        style={{ zIndex: 2 }}
        className="top-4 fixed right-4 p-2 rounded-full cursor-pointer dark:bg-yellow-200 bg-gray-600"
        onClick={toggleDarkMode}
      >
        <span role="img" aria-label="dark mode" className="cursor-pointer">
          {darkMode ? '🌻' : '🌙'}
        </span>
        <label htmlFor="darkModeToggle" className="cursor-pointer" />
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
          <Route
            path="/"
            element={
              <Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            }
          />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/profile/:id" element={<UserProfile />} /> */}
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/login/enable-2fa" element={<EnableTwoFA />} />
          <Route path="/login/disable-2fa" element={<DisableTwoFA />} />
          <Route path="/login/verify-2fa" element={<VerifyTwoFA />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/game" element={<Game />} />
          <Route path="/game/:uuid" element={<Game />} />
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
