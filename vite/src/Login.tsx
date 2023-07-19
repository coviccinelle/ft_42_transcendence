import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { domainName } from './main';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };

    axios
      .post(`http://${domainName}/api/auth/local/signup`, formData)
      .then((res) => {
        console.log("Sign up OK !")
        return navigate("/login");
      })
      .catch((e) => {
        // * when user is already in db (conflictException) or other errors
        console.log(e);
      });
  };

  const handleLogin = () => {
    const formData = {
      email: email,
      password: password,
    };

    axios
      .post(`http://${domainName}/api/auth/local/login`, formData)
      .then((res) => {
        console.log("GOGOGOGOGOGOGO TO PROFILE")
        return navigate("/profile");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleLoginGoogle = () => {
    location.href = `http://${domainName}/api/auth/google/login`;
  };

  const handleLoginFt = () => {
    location.href = `http://${domainName}/api/auth/ft/login`;
  };

  return (
    <div>
      <input
        type="firstName"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="lastName"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Signup</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLoginGoogle}>Login with Google</button>
      <button onClick={handleLoginFt}>Login with 42</button>
    </div>
  );
}

export default Login;
