import { domainName } from '../main';
import '../styles/Login.css';

function Login() {
  const handleLoginFt = () => {
    location.href = `http://${domainName}/api/auth/ft/login`;
  };

  return (
    <div className="login-box">
      <h1 className="mb-9 py-2 animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-5xl font-black">
        Login
      </h1>

      <button
        className="mx-3 px-2 py-2 rounded-md border border-transparent cursor-pointer hover:border-amber-200 focus:outline-4 focus:ring-amber-500 focus:border-amber-500 focus:ring-opacity-50"
        type="button"
        onClick={handleLoginFt}
      >
        42
      </button>
      <br></br>
    </div>
  );
}

export default Login;
