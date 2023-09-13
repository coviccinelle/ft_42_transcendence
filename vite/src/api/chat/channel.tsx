import axios from 'axios';

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

const getChannel = async (channelId: number) => {
  try {
    const response = await axios.get(`${API}/chat/${channelId}`);
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
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const leaveChannel = async (channelId: number) => {
  try {
    const response = await axios.get(`${API}/chat/${channelId}/leave`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const deleteChannel = async (channelId: number) => {
  try {
    const response = await axios.delete(`${API}/chat/${channelId}`);
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
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const createDm = async (userId: number) => {
  try {
    const response = await axios.post(`${API}/chat/newDM`, {
      id: userId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default {
  getChannels,
  deleteChannel,
  getChannel,
  putChannelName,
  createChannel,
  getAllChannels,
  joinChannel,
  leaveChannel,
  changePassword,
  createDm,
};
