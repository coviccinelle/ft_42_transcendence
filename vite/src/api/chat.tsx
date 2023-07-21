import axios, { AxiosError, AxiosResponse } from 'axios';

const API = '/api';

const postMessage = async (
  message: string,
  channelId: number,
  authorId: number,
) => {
  try {
    const response = await axios.post(`${API}/chat/${channelId}/message`, {
      content: message,
      authorId: authorId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getMessages = async (channelId: number) => {
  try {
    const response = await axios.get(`${API}/chat/${channelId}/messages`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getChannels = async (userId: number) => {
  try {
    const response = await axios.get(`${API}/users/${userId}/channels`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default { postMessage, getMessages, getChannels };
