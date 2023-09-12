import { useEffect, useState } from 'react';
import apiTwoFA from '../api/2fa';
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
          if (!user.isTwoFAEnabled)
            return navigate('/settings');
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
      user: userEmail,
      totpToken: code,
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
  }

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <div className="user-box">
        <label>2FA Code To Verify Your Identity</label>
        <input
          type="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <button
        className="mx-3 px-2 py-2 rounded-md border border-transparent cursor-pointer hover:border-amber-200 focus:outline-4 focus:ring-amber-500 focus:border-amber-500 focus:ring-opacity-50"
        type="button"
        onClick={handleTurnOffTwoFA}
      >
        Disable 2FA
      </button>
    </div>
  );
}

export default DisableTwoFA;
