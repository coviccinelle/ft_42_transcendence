import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { domainName } from './main';

type LoginResponse = {
  accessToken: string;
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const formData = {
      email: email,
      password: password,
    };

    axios
      .post<LoginResponse>(`http://${domainName}/api/auth/login`, formData)
      .then((response: AxiosResponse<LoginResponse>) => {
        const accessToken = response.data.accessToken;
        console.log('response: %s', accessToken);
        // ? stockage dans un cookie
      })
      .catch((error: AxiosError) => {
        console.log('error axios: ' + error);
      });
  };

  const handleLoginGoogle = () => {
    location.href = `http://${domainName}/api/auth/google/login`;
  };

  const handleLoginFt = () => {
    const redirect_uri = encodeURIComponent(`http://${domainName}/api/auth/ft/redirect`);
    const state = import.meta.env.VITE_FT_STATE;
    const client_id = import.meta.env.VITE_FT_CLIENT_ID;
    
    location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&response_type=code`
  };

  return (
    <div>
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
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLoginGoogle}>Login with Google</button>
      <button onClick={handleLoginFt}>Login with 42</button>
    </div>
  );
}

export default Login;
