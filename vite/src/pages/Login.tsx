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
      .then((res: AxiosResponse) => {
        console.log(res);
        return navigate('/profile');
      })
      .catch((e: AxiosError) => {
        console.log(e);
      });

    const handleLoginGoogle = () => {
      location.href = `http://${domainName}/api/auth/google/login`;
    };

    const handleLoginFt = () => {
      location.href = `http://${domainName}/api/auth/ft/login`;
    };
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-00">
      <div className="flex flex-col items-center justify-center w-96 h-96 bg-slate-400 dark:bg-slate-500 rounded-xl shadow-xl">
        <div className="flex flex-col items-center justify-center h-96 w-full ">
          <h1 className="text-4xl font-bold my-7">Login</h1>
          <div className="flex flex-col items-center justify-center w-full h-1/2">
            <input
              className="w-3/4 h-15 px-3 mb-3 placeholder-gray-500 border rounded-lg focus:shadow-outline"
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-3/4 h-15 px-3 mb-3 placeholder-gray-500 border rounded-lg focus:shadow-outline"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-3/4 h-10 px-3 mb-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              onClick={handleLogin}
            >
              Login
            </button>
            <button
              className="w-3/4 h-10 px-3 mb-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              onClick={handleSignup}
            >
              Sign up
            </button>
              <a href="/">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Home
              </a>
            {/* <button
              className="w-3/4 h-10 px-3 mb-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              onClick={handleLoginGoogle}
            >
              Login with Google
            </button> */}
            {/* <button
              className="w-3/4 h-10 px-3 mb-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              onClick={handleLoginFt}
            >
              Login with 42
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

//   return (
//     //wrapper
//     <div className="transform -translate-y-1/2 -translate-x-1/2 absolute top-1/2 left-1/2 max-h-full max-w-[980px] mx-auto">
//       {/* container */}
//       <div className="bg-fuchsia-200 rounded-2xl p-10 box-border box-content box-border box-content pointer-events-auto">
//         {/* exit cross button */}

//         <button className="absolute top-2 right-2 bg-blue-300 hover:bg-blue-200 p-1 rounded-full w-8 h-8">X</button>
//         {/* Contents : upper and bottom */}
//         <div className="w-430 mx-auto px-40 py-40 box-border">
//           <div className="absolute top-1/2 left-1/2 w-96 p-10 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 box-border shadow-xl rounded-lg">
//             <h2>Login euhhhhh</h2>
//             <form>
//               <div className="relative">
//                 <input type="text" name="" required className="w-full p-2 text-lg border-b border-gray-300 bg-transparent outline-none focus:border-blue-400" />
//                 <label>Username</label>
//                 {/* <input type="text" name="" required="">
//                   <label>Username</label>
//                 </input> */}
//               </div>
//               {/* <div className="user-box">
//                 <input type="password" name="" required="">
//                   <label>Password</label>
//                 </input>
//               </div> */}
//               <a href="/">
//                 <span></span>
//                 <span></span>
//                 <span></span>
//                 <span></span>
//                 Home
//               </a>
//             </form>
//           </div>
//           {/* <div className="mb-10 my-8 bg-slate-300 flex items-center flex-col text-gray-700 box-border">
//             Upper
//             <p className="text-2xl">Welcome back! Happy to see you back</p>

//             <label
//               for="Username"
//               className="relative my-2 block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
//             >
//               <input
//                 type="text"
//                 id="Username"
//                 className="peer my-2 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
//                 placeholder="Username"
//               />
//               <span
//                 className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
//               >
//                 Username
//               </span>
//             </label>

//             <label
//               for="Password"
//               className="relative my-2 block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
//             >
//               <input
//                 type="text"
//                 id="Password"
//                 className="peer my-2 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
//                 placeholder="Password"
//               />
//               <span
//                 className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
//               >
//                 password
//               </span>
//             </label>

//           </div> */}
//           {/* <div className="flex items-center flex-col text-gray-700 box-border">Bottom</div>
//           <div className="mb-10 relative text-center py-4 px-12 cursor-pointer block transition-all duration-300">
//             <button className="mb-5 bg-blue-300 hover:bg-blue-200 p-3 rounded-xl w-72 transform transition-transform hover:scale-105"
//               onClick={handleSignup}>Signup</button>
//             <button className="mx-1.5" onClick={handleLogin}>Login</button>
//             <button className="mx-1.5" onClick={handleLoginGoogle}>Google</button>
//             <button className="mx-1.5" onClick={handleLoginFt}>42</button>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// }

export default Login;
