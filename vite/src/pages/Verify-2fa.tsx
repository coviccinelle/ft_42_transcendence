import { useEffect, useState } from 'react';
import '../styles/Login.css';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

function VerifyTwoFA() {
  const [code, setCode] = useState<string>('');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const emailInParams = searchParams.get('userEmail');

    if (emailInParams) localStorage.setItem('userEmail', emailInParams);
    if (!localStorage.getItem('userEmail')) return navigate('/login');
  });

  const handleLoginTotp = (event: any) => {
    event.preventDefault();
    const formData = {
      email: localStorage.getItem('userEmail'),
      code: code,
    };

    axios
      .post('/api/auth/2fa/login', formData)
      .then((res) => {
        return navigate('/');
      })
      .catch((res) => {
        return navigate('/login');
      });
    localStorage.removeItem('userEmail');
  };

  return (
    <div className="flex h-screen w-screen justify-center items-center text-center">
      <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 bg-opacity-5 relative">
        <button
          className="absolute top-0 right-0 mt-4 mr-4 m-5 w-8 h-8 bg-yellow-700 dark:bg-yellow-200 bg-opacity-40 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white dark:text-black"
          onClick={() => navigate('/profile')}
        >
          X
        </button>
        <div className="user-box">
          <label className="text-black dark:text-gray-200 py-4 text-lg font-semibold ">
            Enter The 2FA Code To Verify Association
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-1/2 mt-2 px-3 py-2 text-black dark:text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <button
          className="mt-12 px-4 py-2 rounded-md bg-amber-500 text-black darK:text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
          type="button"
          onClick={handleLoginTotp}
        >
          Send Code
        </button>
      </div>
    </div>
  );
}

export default VerifyTwoFA;
