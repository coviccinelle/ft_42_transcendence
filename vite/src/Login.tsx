import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';

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
      .post<LoginResponse>('http://127.0.0.1:8080/api/auth/login', formData)
      .then((response: AxiosResponse<LoginResponse>) => {
        const accessToken = response.data.accessToken;
        console.log('response: %s', accessToken);
        // stockage dans un cookie
      })
      .catch((error: AxiosError) => {
        console.log('error axios: ' + error);
      });
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
    </div>
  );
}

export default Login;
