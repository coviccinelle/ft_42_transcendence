import { useEffect, useState } from 'react';
import apiURL from '../api/2fa';
import apiUser from '../api/user';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import { domainName } from '../main';

function EnableTwoFA() {
  const [code, setCode] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await apiUser.getMe();

        if (user) {
          if (user.isTwoFAEnabled) return navigate('/settings');
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
  }, []);

  useEffect(() => {
    const fetchUrl = async () => {
      const res = await apiURL.getQrCode();
      setImage(res);
    };

    fetchUrl();
  }, []);

  const handleTurnOnTwoFA = (event: any) => {
    event.preventDefault();
    const formData = {
      code: code,
    };

    axios
      .post(`http://${domainName}/api/auth/2fa/turn-on`, formData)
      .then((res) => {
        return navigate('/settings');
      })
      .catch((res) => {
        // return navigate('/');
      });
  };

  return (
    <div className="flex h-screen w-screen justify-center items-center text-center">
      <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 bg-opacity-5 relative">
        <button
          className="absolute top-0 right-0 mt-4 mr-4 m-5 w-8 h-8 bg-yellow-300 bg-opacity-40 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white"
          onClick={() => navigate('/profile')}
        >
          X
        </button>
        <img src={image} alt="Image" className="w-24 h-24 mb-8" />
        <div className="user-box">
          <label className="text-gray-200 py-4 text-lg font-semibold ">
            Enter The 2FA Code To Verify Association
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-1/2 mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <button
          className="mt-12 px-4 py-2 rounded-md bg-amber-500 text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
          type="button"
          onClick={handleTurnOnTwoFA}
        >
          Activate 2FA
        </button>
      </div>
    </div>
  );
}

export default EnableTwoFA;
