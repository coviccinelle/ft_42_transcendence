import Channel from '../components/Channel';
import SearchChat from '../components/SearchChat';
import ChatTab from '../components/ChatTab';
import { useEffect, useState } from 'react';
import api from '../api/chat';
import { Socket, io } from 'socket.io-client';

function ChatPage() {
  const [channels, setChannels] = useState([]); // need to map channels from server
  const [currentChannel, setCurrentChannel] = useState(1);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState<Socket | undefined>();

  useEffect(() => {
    const fetchChannels = async () => {
      const channels = await api.getChannels(1);
      setChannels(channels);
    };
    fetchChannels();
  }, []);

  const handleIncomingMessage = (message: any) => {
    if (message.channelId === currentChannel) {
      setMessages([...messages, message]);
    }
  };

  useEffect(() => {
    setSocket(io('/chat'));
    if (!socket) return;
    let newSocket = socket;
    newSocket.on('connect', () => {
      for (const channel of channels) {
        newSocket.emit('join', channel.id);
      }
    });
    setSocket(newSocket);
    return () => {
      socket.disconnect();
      setSocket(undefined);
    };
  }, [channels]);

  useEffect(() => {
    if (!socket) return;
    let newSocket = socket;
    newSocket.on('message', handleIncomingMessage);
    setSocket(newSocket);
    return () => {
      let newSocket = socket;
      newSocket.off('message', handleIncomingMessage);
      setSocket(newSocket);
    };
  }, [socket, currentChannel, messages, handleIncomingMessage]);
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
        </div>
        <Channel
          channelId={currentChannel}
          messages={messages}
          setMessages={setMessages}
          channelName={
            channels.find((channel) => channel.id === currentChannel)?.name
          }
        />
      </div>
    </>
  );
}

export default ChatPage;
