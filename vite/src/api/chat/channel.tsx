import axios, { AxiosError, AxiosResponse } from 'axios';

const API = '/api';

const getChannels = async () => {
  try {
    const response = await axios.get(`${API}/chat/mychannels`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getAllChannels = async () => {
  try {
    const response = await axios.get(`${API}/chat`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const putChannelName = async (channelId: number, name: string) => {
  try {
    const response = await axios.patch(`${API}/chat/${channelId}/name`, {
      name: name,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const leaveChannel = async (channelId: number) => {
  try {
    const response = await axios.get(`${API}/chat/${channelId}/leave`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const createChannel = async (
  name: string,
  isPublic: boolean,
  password: string,
) => {
  try {
    const response = await axios.post(`${API}/chat`, {
      name: name,
      isPublic: isPublic,
      password: password,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const joinChannel = async (channelId: number, password: string) => {
  try {
    const response = await axios.post(`${API}/chat/join`, {
      id: channelId,
      password: password,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const changePassword = async (channelId: number, newPassword: string) => {
  try {
    const response = await axios.patch(`${API}/chat/${channelId}/password`, {
      password: newPassword,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default {
  getChannels,
  putChannelName,
  createChannel,
  getAllChannels,
  joinChannel,
  leaveChannel,
  changePassword,
};
