import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { domainName } from '../main';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function SignUp() {
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

  const handleLoginGoogle = () => {
    location.href = `http://${domainName}/api/auth/google/login`;
  };

  const handleLoginFt = () => {
    location.href = `http://${domainName}/api/auth/ft/login`;
  };

  return (
    <>
      <div className="login-box">
        <h1 className="mb-9 py-2 animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-5xl font-black">
          Sign Up</h1>
        <form>
          <div className="user-box">
            <input type="firstName" value={firstName}
              onChange={(e) => setFirstName(e.target.value)} />
            <label>First Name</label>
          </div>
          <div className="user-box">
            <input type="lastName" value={lastName}
              onChange={(e) => setLastName(e.target.value)} />
            <label>Last Name</label>
          </div>
          <div className="user-box">
            <input type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} />
            <label>Email</label>
          </div>
          <div className="user-box">
            <input type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <label>Password</label>
          </div>
          <a type='submit' onClick={handleSignup}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Sign Up
          </a>
          {/* <a className='object-right mx-3 my-3' href='/signup'>Sign up</a> */}

        </form>

        {/* <button className="mx-3 px-2 py-2 rounded-md border border-transparent cursor-pointer hover:border-amber-200 focus:outline-4 focus:ring-amber-500 focus:border-amber-500 focus:ring-opacity-50"
          type='button' onClick={handleLoginGoogle}>Google</button>
        <button className="mx-3 px-2 py-2 rounded-md border border-transparent cursor-pointer hover:border-amber-200 focus:outline-4 focus:ring-amber-500 focus:border-amber-500 focus:ring-opacity-50"
          type='button' onClick={handleLoginFt}>42</button>
        <br></br> */}
        <div className="mt-12 flex items-center">
          <p className="mr-16">Already have an account?</p>
          <a href="/login" className="py-1 px-1 text-blue-500">Log in</a>
        </div>

      </div>
    </>
  );
}

export default SignUp;