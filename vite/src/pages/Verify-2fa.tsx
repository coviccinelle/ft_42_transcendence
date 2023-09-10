import { useState } from 'react';
import '../styles/Login.css';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

function VerifyTwoFA() {
  const [code, setCode] = useState<string>();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const emailInParams = searchParams.get('userEmail');
  if (emailInParams)
    localStorage.setItem('userEmail', emailInParams);
  if (!localStorage.getItem('userEmail'))
    return navigate('/login');


  const handleLoginTotp = (event: any) => {
    event.preventDefault();
    const formData = {
      user: localStorage.getItem('userEmail'),
      totpToken: code,
    };

    axios.post('/api/auth/2fa/login', formData)
      .then((res) => {
        console.log(res);
        return navigate('/');
      })
      .catch((res) => {
        console.log(res);
        return navigate('/login');
      });
    localStorage.removeItem('userEmail');
  }

  return (
    <>
      <div className="user-box">
        <input
          type="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <label>2FA Code</label>
      </div>
      <button
        className="mx-3 px-2 py-2 rounded-md border border-transparent cursor-pointer hover:border-amber-200 focus:outline-4 focus:ring-amber-500 focus:border-amber-500 focus:ring-opacity-50"
        type="button"
        onClick={handleLoginTotp}
      >
        Send Code
      </button>
    </>
  )
}

export default VerifyTwoFA;
