import axios, { AxiosError, AxiosResponse } from 'axios';
import { Socket } from 'socket.io-client';

const API = '/api';

const getUsers = async () => {
  try {
    const response = await axios.get(`${API}/users`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getMe = async () => {
  try {
    const response = await axios.get(`${API}/users/me`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getUsersInChannel = async (channelId: number) => {
  try {
    const response = await axios.get(`${API}/chat/${channelId}/users`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default {
  getUsers,
  getUsersInChannel,
  getMe,
};
