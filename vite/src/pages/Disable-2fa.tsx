import { useEffect, useState } from 'react';
import apiUser from '../api/user';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { domainName } from '../main';

function DisableTwoFA() {
  const [code, setCode] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await apiUser.getMe();

        if (user) {
          if (!user.isTwoFAEnabled) return navigate('/settings');
          setUserEmail(user.email);
        } else {
          navigate('/settings');
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          error,
        );
      }
    };

    fetchUser();
  }, [navigate]);

  const handleTurnOffTwoFA = (event: any) => {
    event.preventDefault();
    const formData = {
      code: code,
    };

    axios
      .post(`http://${domainName}/api/auth/2fa/turn-off`, formData)
      .then((res) => {
        console.log(res);
        return navigate('/settings');
      })
      .catch((res) => {
        console.log(res);
        // return navigate('/');
      });
  };

  return (
    <>
      <div className="flex h-screen w-screen justify-center items-center text-center">
        <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 bg-opacity-5 relative">
          <button
            className="absolute top-0 right-0 mt-4 mr-4 m-5 w-8 h-8 bg-yellow-700 dark:bg-yellow-200 bg-opacity-40 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white dark:text-black"
            onClick={() => navigate('/profile')}
          >
            X
          </button>
          <div className="user-box">
            <label className="text-black dark:text-gray-200 py-8 text-lg font-semibold ">
              2FA Code To Verify Your Identity
            </label>
            <input
              type="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-1/2 mt-4 px-3 py-2 text-black dark:text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
        </div>
        <button
          className="mt-12 px-4 py-2 rounded-md bg-amber-500 text-black darK:text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
          type="button"
          onClick={handleTurnOffTwoFA}
        >
          Disable 2FA
        </button>
      </div>
    </div >
    </>
  );
}

export default DisableTwoFA;
