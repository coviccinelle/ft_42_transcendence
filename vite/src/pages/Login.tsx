import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { domainName } from '../main';
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
    //wrapper
    <div className="transform -translate-y-1/2 -translate-x-1/2 absolute top-1/2 left-1/2 max-h-full max-w-[980px] mx-auto">
      {/* container */}
      <div className="bg-fuchsia-200 rounded-2xl p-10 box-border box-content box-border box-content pointer-events-auto">
        {/* exit cross button */}
        <button className="absolute top-2 right-2 bg-blue-300 hover:bg-blue-200 p-1 rounded-full w-8 h-8">X</button>
        {/* Contents : upper and bottom */}
        <div className="w-430 mx-auto px-40 py-40 box-border">
          <div className="mb-20 flex items-center flex-col text-gray-700 box-border">
            Upper
            <p className="text-2xl">Welcome! Are you ready for the pong battle?</p>
          
          </div>
          <div className="flex items-center flex-col text-gray-700 box-border">Bottom</div>
          <button className="bg-blue-300 hover:bg-blue-200 p-3 rounded-xl w-72 transform transition-transform hover:scale-105" onClick={handleSignup}>Signup</button>
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleLoginGoogle}>Login with Google</button>
          <button onClick={handleLoginFt}>Login with 42</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
