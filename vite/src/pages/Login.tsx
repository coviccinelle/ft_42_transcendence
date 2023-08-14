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
		<a onClick={handleLogin}>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			Log in
		</a>
    <br></br>
      <button onClick={handleSignup}>Signup</button>
      <button onClick={handleLoginGoogle}>Google</button>
      <button onClick={handleLoginFt}>42</button>
		</form>
	</div>
  );
}

//     <div className="flex flex-col items-center justify-center h-screen bg-gray-00">
//       <div className="flex flex-col items-center justify-center w-96 h-96 bg-slate-400 dark:bg-slate-500 rounded-xl shadow-xl">
//         <div className="flex flex-col items-center justify-center h-96 w-full ">
//           <h1 className="text-4xl font-bold my-7">Login</h1>
//           <div className="flex flex-col items-center justify-center w-full h-1/2">
//             <input
//               className="w-3/4 h-15 px-3 mb-3 placeholder-gray-500 border rounded-lg focus:shadow-outline"
//               type="text"
//               placeholder="Email"
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <input
//               className="w-3/4 h-15 px-3 mb-3 placeholder-gray-500 border rounded-lg focus:shadow-outline"
//               type="password"
//               placeholder="Password"
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <button
//               className="w-3/4 h-10 px-3 mb-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//               onClick={handleLogin}
//             >
//               Login
//             </button>
//             <button
//               className="w-3/4 h-10 px-3 mb-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//               onClick={handleSignup}
//             >
//               Sign up
//             </button>

//             {/* <button
//               className="w-3/4 h-10 px-3 mb-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//               onClick={handleLoginGoogle}
//             >
//               Login with Google
//             </button> */}
//             {/* <button
//               className="w-3/4 h-10 px-3 mb-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//               onClick={handleLoginFt}
//             >
//               Login with 42
//             </button> */}
//           </div>

export default Login;
