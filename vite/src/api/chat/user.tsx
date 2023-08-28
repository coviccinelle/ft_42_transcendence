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

const muteUser = async (channelId: number, userId: number, time: number) => {
  try {
    const response = await axios.post(`${API}/chat/${channelId}/mute`, {
      userId: userId,
      time: time,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const kickUser = async (channelId: number, userId: number) => {
  try {
    const response = await axios.post(`${API}/chat/${channelId}/kick`, {
      id: userId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const addSomeoneToChannel = async (channelId: number, userId: number) => {
  try {
    const response = await axios.patch(`${API}/chat/${channelId}/adduser`, {
      id: userId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const banUser = async (channelId: number, userId: number) => {
  try {
    const response = await axios.post(`${API}/chat/${channelId}/ban`, {
      id: userId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default {
  getUsers,
  getUsersInChannel,
  getMe,
  muteUser,
  kickUser,
  banUser,
  addSomeoneToChannel,
};
