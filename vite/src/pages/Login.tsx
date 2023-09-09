import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { domainName } from '../main';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event: any) => {
    event.preventDefault();
    const formData = {
      email: email,
      password: password,
    };

    axios.post(`http://${domainName}/api/auth/local/login`, formData)
      .then((res) => {
        console.log("POST OK");
        if (res.data.isTwoFAEnabled) {
          localStorage.removeItem('userEmail');
          localStorage.setItem('userEmail', res.data);
          return navigate('/login/verify-2fa');
        }
        return navigate('/profile');
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleLoginGoogle = () => {
    axios.get('/api/auth/google/login')
      .then((res) => {
        console.log("RES GOOGLE:");
        console.log(res);
        if (res.data.user.isTwoFAEnabled) {
          localStorage.removeItem('userEmail');
          localStorage.setItem('userEmail', res.data.user.email);
        }
          
      })
      .catch((res) => {
        console.log(res)
      });
    // location.href = `http://${domainName}/api/auth/google/login`;
  };

  const handleLoginFt = () => {
    axios.get('/api/auth/ft/login')
      .then((res) => {
        console.log("RES FT:");
        console.log(res);
        if (res.data.user.isTwoFAEnabled) {
          localStorage.removeItem('userEmail');
          localStorage.setItem('userEmail', res.data.user.email);
        }
      })
      .catch((res) => {
        console.log(res)
      });
    // location.href = `http://${domainName}/api/auth/ft/login`;
  };

  return (
    <div className="login-box">
      <h1 className="mb-9 py-2 animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-5xl font-black">
        Login
      </h1>

      <form>
        <div className="user-box">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>
        <div className="user-box">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>
        <a style={{ cursor: 'pointer' }} type="submit" onClick={handleLogin}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Log in
        </a>
        <br></br>
      </form>

      <button
        className="mx-3 px-2 py-2 rounded-md border border-transparent cursor-pointer hover:border-amber-200 focus:outline-4 focus:ring-amber-500 focus:border-amber-500 focus:ring-opacity-50"
        type="button"
        onClick={handleLoginGoogle}
      >
        Google
      </button>
      <button
        className="mx-3 px-2 py-2 rounded-md border border-transparent cursor-pointer hover:border-amber-200 focus:outline-4 focus:ring-amber-500 focus:border-amber-500 focus:ring-opacity-50"
        type="button"
        onClick={handleLoginFt}
      >
        42
      </button>
      <br></br>
      <div className="mt-12 flex items-center">
        <p className="mr-20">Don't have an account?</p>
        <a href="/signup" className="py-1 px-1 text-blue-500">
          Sign Up
        </a>
      </div>
    </div>
  );
}

export default Login;
