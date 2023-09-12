import axios from 'axios';

const API = '/api';

const getIdGame = async () => {
  try {
    const response = await axios.get(`${API}/game/newGame`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default {
  getIdGame,
};
