import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import Login from './views/Login';
import Profile from './views/Profile';
import Chat from './views/Chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
