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
		<h1 className="my-9 animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-5xl font-black">Login</h1>
		
    <form>
		<div className="user-box">
			<input type="email" value={email}
        onChange={(e) => setEmail(e.target.value)}/>
			<label>Email</label>
		</div>
		<div className="user-box">
			<input type="password" value={password}
        onChange={(e) => setPassword(e.target.value)}/>
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

		</form>
      
      <button className="mx-3 my-3" type='button' onClick={handleLoginGoogle}>Google</button>
      <button className="mx-3 my-3" type='button' onClick={handleLoginFt}>42</button>
      <br></br>
      <a className='object-right mx-3 my-3' href='/signup'>Sign up</a>
	</div>
  );
}

export default Login;