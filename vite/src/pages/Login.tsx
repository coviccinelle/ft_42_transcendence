import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { domainName } from '../main';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  const handleSignup = (event: any) => {
    event.preventDefault();
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

  const handleLogin = (event: any) => {
    event.preventDefault();
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
    <div className="login-box">
		<h2>Login</h2>
		<form>
		<div className="user-box">
			<input type="text" name="" required=""/>
			<label>Username</label>
		</div>
		<div className="user-box">
			<input type="password" name="" required=""/>
			<label>Password</label>
		</div>
		<a type='submit' onClick={handleLogin}>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			Log in
		</a>
    <br></br>
    <button type='submit' onClick={handleSignup}>Signup</button>
		</form>
      <button type='button' onClick={handleLoginGoogle}>Google</button>
      <button type='button' onClick={handleLoginFt}>42</button>
	</div>
  );
}

export default Login;