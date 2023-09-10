import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import apiURL from '../api/2fa';

function TwoFa() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const fetchUrl = async () => {
      const res = await apiURL.getUrl2FA();
      setUrl(res);
    };
    fetchUrl();
  }, []);

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <QRCode value={url} />
    </div>
  );
}

export default TwoFa;
