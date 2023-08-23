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
  const [currentChannel, setCurrentChannel] = useState(channels[0]);
  const [messages, setMessages] = useState([]);
  const [channelName, setChannelName] = useState('');
  const [socket, setSocket] = useState(io('/chat', { autoConnect: false }));

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
    };
    function handleConnection() {
      console.log('Socket connected');
    };
    function handleDisconnect() {
      console.log('Socket disconnected');
    };
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
    <div className="flex h-screen flex-col min-h-0">
      <Navbar darkMode={props.darkMode} toggleDarkMode={props.toggleDarkMode} />
      <div className="flex-auto flex flex-col min-h-0 w-full">
        <div className="flex-auto flex flex-row min-h-0">
          <div className="flex flex-col w-2/5 border-r-2 border-gray-950 overflow-y-auto">
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
            socket={socket}
            />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
