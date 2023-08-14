import axios, { AxiosError, AxiosResponse } from 'axios';

const API = '/api';

const postMessage = async (
  message: string,
  channelId: number,
) => {
  try {
    const response = await axios.post(`${API}/chat/${channelId}/message`, {
      content: message,
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

const getChannels = async () => {
  try {
    const response = await axios.get(`${API}/chat/mychannels`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const putChannelName = async (channelId: number, name: string) => {
  try {
    const response = await axios.patch(`${API}/chat/${channelId}`, {
      name: name,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default { postMessage, getMessages, getChannels, putChannelName };
