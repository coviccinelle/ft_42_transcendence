import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
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
          if (user.isTwoFAEnabled)
            return navigate('/registration');
          setUserEmail(user.email);
        } else {
          navigate('/registration');
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
      user: userEmail,
      totpToken: code,
    };

    axios
      .post(`http://${domainName}/api/auth/2fa/turn-on`, formData)
      .then((res) => {
        console.log(res);
        return navigate('/registration');
      })
      .catch((res) => {
        console.log(res);
        // return navigate('/');
      });
  }

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <img src={image} alt="Image" />
      <div className="user-box">
        <label>Enter The 2FA Code To Verify Association</label>
        <input
          type="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <button
        className="mx-3 px-2 py-2 rounded-md border border-transparent cursor-pointer hover:border-amber-200 focus:outline-4 focus:ring-amber-500 focus:border-amber-500 focus:ring-opacity-50"
        type="button"
        onClick={handleTurnOnTwoFA}
      >
        Activate 2FA
      </button>
    </div>
  );
}

export default EnableTwoFA;
