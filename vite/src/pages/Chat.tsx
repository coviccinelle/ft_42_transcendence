import Channel from '../components/chat/Channel';
import SearchChat from '../components/chat/SearchChat';
import ChatTab from '../components/chat/ChatTab';
import { useEffect, useState } from 'react';
import api from '../api/chat';
import { Socket, io } from 'socket.io-client';
import ChatTabAdd from '../components/chat/ChatTabAdd';
import Navbar from '../components/Navbar';

function ChatPage(props: { darkMode: boolean; toggleDarkMode: any }) {
  const [channels, setChannels] = useState([]); // need to map channels from server
  const [currentChannel, setCurrentChannel] = useState(0);
  const [messages, setMessages] = useState([]);
  const [channelName, setChannelName] = useState('');
  const [socket, setSocket] = useState(io('/chat', { autoConnect: false }));

  useEffect(() => {
    const fetchChannels = async () => {
      const channels = await api.getChannels();
      setChannels(channels);
    };
    fetchChannels();
  }, []);

  useEffect(() => {
    const channelName = channels.find(
      (channel) => channel.id === currentChannel,
    )?.name;
    setChannelName(channelName || '');
  }, [currentChannel]);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    function handleIncomingMessage(message: any) {
      console.log(`New message : ${message.content}`);
      if (message.channelId === currentChannel) {
        setMessages([...messages, message]);
      }
    }
    function handleUpdate(channelId: number) {
      console.log(`Received update for channel ${channelId}`);
      //TODO trigger update for that channel
      //Maybe transmit new channel through websocket
    }
    function handleConnection() {
      console.log('Socket connected');
    }
    function handleDisconnect() {
      console.log('Socket disconnected');
    }
    socket.on('message', handleIncomingMessage);
    socket.on('update', handleUpdate);
    socket.on('connect', handleConnection);
    socket.on('disconnect', handleDisconnect);
    return () => {
      socket.off('message', handleIncomingMessage);
      socket.off('update', handleUpdate);
      socket.off('connect', handleConnection);
      socket.off('disconnect', handleDisconnect);
    };
  }, [currentChannel, messages]);

  const [search, setSearch] = useState('');
  const filteredTabs = channels.filter((tab) => {
    return tab.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex h-screen flex-col min-h-0">
      <Navbar darkMode={props.darkMode} toggleDarkMode={props.toggleDarkMode} />
      <div className="flex-auto flex flex-col min-h-0 w-full">
        <div className="flex-auto flex flex-row min-h-0">
          <div className="sm:w-1/4 w-1/6 flex flex-col border-r-2 border-gray-950 overflow-y-auto no-scrollbar">
            <SearchChat search={search} setSearch={setSearch} />
            <ChatTabAdd setChannels={setChannels} channels={channels} />
            {filteredTabs.map((tab: any) => {
              return (
                <ChatTab
                  name={tab.name}
                  lastMessage={'last message'}
                  avatar="https://img-02.stickers.cloud/packs/1da1c0da-9330-4d89-9700-8d75b9c62635/webp/65bb0543-f220-456a-ad64-2ae40431ec03.webp"
                  onClick={() => {
                    setCurrentChannel(tab.id);
                  }}
                />
              );
            })}
          </div>

          {currentChannel ? (
            <Channel
              channelId={currentChannel}
              messages={messages}
              setMessages={setMessages}
              channelName={channelName}
              setChannelName={setChannelName}
              socket={socket}
            />
          ) : (
            <div className="flex flex-col border-t-2 border-gray-950 items-center justify-center flex-auto">
              <div className="text-3xl font-semibold">Welcome to Chat!</div>
              <div className="text-xl font-semibold">
                Select a channel to start chatting
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
