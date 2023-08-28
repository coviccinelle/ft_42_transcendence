import axios, { AxiosError, AxiosResponse } from 'axios';
import { Socket } from 'socket.io-client';

const API = '/api';

const postMessage = async (message: string, channelId: number) => {
  try {
    const response = await axios.post(`${API}/chat/${channelId}/message`, {
      content: message,
      channelId: channelId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const sendMessage = (message: string, channelId: number, socket: Socket) => {
  console.log(`Sending message ${message}`);
  socket.emit('message', {
    content: message,
    channelId: channelId,
  });
};

const getMessages = async (channelId: number) => {
  try {
    const response = await axios.get(`${API}/chat/${channelId}/messages`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default { postMessage, sendMessage, getMessages };
