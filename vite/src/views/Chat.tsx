import Channel from '../components/Channel';
import SearchChat from '../components/SearchChat';
import ChatTab from '../components/ChatTab';
import { useEffect, useState } from 'react';
import api from '../api/chat';
import { Socket, io } from 'socket.io-client';
import ChatTabAdd from '../components/ChatTabAdd';

function ChatPage() {
  const [channels, setChannels] = useState([]); // need to map channels from server
  const [currentChannel, setCurrentChannel] = useState(channels[0]);
  const [messages, setMessages] = useState([]);
  // const [socket, setSocket] = useState<Socket | undefined>();
  const [channelName, setChannelName] = useState('');

  const socket = io('/chat', { autoConnect: false });

  useEffect(() => {
    const fetchChannels = async () => {
      const channels = await api.getChannels();
      setChannels(channels);
      if (channels && channels[0]) {
        setCurrentChannel(channels[0].id);
      } else {
        setCurrentChannel(undefined);
      }
    };
    fetchChannels();
  }, []);

  useEffect(() => {
    const channelName = channels.find(
      (channel) => channel.id === currentChannel,
    )?.name;
    setChannelName(channelName || '');
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [channels, currentChannel, socket]);

  useEffect(() => {
    function handleIncomingMessage(message: any) {
      console.log(`New message : ${message}`);
      if (message.channelId === currentChannel) {
        setMessages([...messages, message]);
      }
    };
    function handleConnection() {
      console.log('Socket connected');
    }
    function handleDisconnect() {
      console.log('Socket disconnected');
    }
    socket.on('message', handleIncomingMessage);
    socket.on('connect', handleConnection);
    socket.on('disconnect', handleDisconnect);
    return () => {
      socket.off('message', handleIncomingMessage);
      socket.off('connect', handleConnection);
      socket.off('disconnect', handleDisconnect);
    };
  }, [currentChannel, messages]);

  const [search, setSearch] = useState('');
  const filteredTabs = channels.filter((tab) => {
    return tab.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <div className="flex flex-row h-screen bg-gray-950">
        <div className="flex flex-col w-2/5 border-r-2 border-gray-700 overflow-y-auto">
          <SearchChat search={search} setSearch={setSearch} />
          {filteredTabs.map((tab) => {
            return (
              <ChatTab
                name={tab.name}
                lastMessage={'last message'}
                avatar="https://img-02.stickers.cloud/packs/1da1c0da-9330-4d89-9700-8d75b9c62635/webp/65bb0543-f220-456a-ad64-2ae40431ec03.webp"
                id={tab.id}
                setCurrentChannel={setCurrentChannel}
              />
            );
          })}
          <ChatTabAdd setChannels={setChannels} channels={channels} />
        </div>
        <Channel
          channelId={currentChannel}
          messages={messages}
          setMessages={setMessages}
          channelName={channelName}
          setChannelName={setChannelName}
        />
      </div>
    </>
  );
}

export default ChatPage;
