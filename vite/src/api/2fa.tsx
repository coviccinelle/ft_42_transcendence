import axios from 'axios';

const API = '/api';

const getUrl2FA = async () => {
  try {
    const response = await axios.get(`${API}/auth/2fa/qrcode`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default {
  getUrl2FA,
};
