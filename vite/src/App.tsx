import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
// import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);



  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
