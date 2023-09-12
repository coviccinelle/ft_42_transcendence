import axios, { AxiosError, AxiosResponse } from 'axios';

const API = '/api';

const getUsers = async () => {
  try {
    const response = await axios.get(`${API}/users`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getUser = async (id: number) => {
  try {
    const response = await axios.get(`${API}/users/${id}`);
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

const promoteAdmin = async (channelId: number, userId: number) => {
  try {
    const response = await axios.post(`${API}/chat/${channelId}/promoteAdmin`, {
      id: userId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const demoteAdmin = async (channelId: number, userId: number) => {
  try {
    const response = await axios.post(`${API}/chat/${channelId}/demoteAdmin`, {
      id: userId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const transferOwnership = async (channelId: number, userId: number) => {
  try {
    const response = await axios.patch(`${API}/chat/${channelId}/owner`, {
      id: userId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getMatchHistory = async (userId: number) => {
  try {
    const response = await axios.get(`${API}/users/${userId}/matchHistory`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getStats = async (userId: number) => {
  try {
    const response = await axios.get(`${API}/users/${userId}/stats`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getConnectionStatus = async (userId: number) => {
  try {
    const response = await axios.get(`${API}/users/${userId}/connectionStatus`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const addFriend = async (userId: number) => {
  try {
    const response = await axios.post(`${API}/users/friends`, {
      id: userId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const removeFriend = async (userId: number) => {
  try {
    const response = await axios.delete(`${API}/users/friends`, {
      data: {
        id: userId,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getFriends = async () => {
  try {
    const response = await axios.get(`${API}/users/friends`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const blockUser = async (userId: number) => {
  try {
    const response = await axios.post(`${API}/users/block`, {
      id: userId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const unblockUser = async (userId: number) => {
  try {
    const response = await axios.delete(`${API}/users/block`, {
      data: {
        id: userId,
      },
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
  getUser,
  muteUser,
  kickUser,
  banUser,
  addSomeoneToChannel,
  promoteAdmin,
  demoteAdmin,
  transferOwnership,
  getMatchHistory,
  getStats,
  getConnectionStatus,
  addFriend,
  removeFriend,
  getFriends,
  blockUser,
  unblockUser,
};
