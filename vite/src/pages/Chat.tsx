import Channel from '../components/chat/Channel';
import SearchChat from '../components/chat/SearchChat';
import ChatTab from '../components/chat/ChatTab';
import { useEffect, useState } from 'react';
import apiChannel from '../api/chat/channel';
import { io } from 'socket.io-client';
import ChatTabAdd from '../components/chat/ChatTabAdd';
import Navbar2 from '../components/NavBar2';
import LeaveChannelDialog from '../components/chat/dialog/LeaveChannelDialog';
import { useNavigate } from 'react-router-dom';
import apiUser from '../api/user';

function ChatPage() {
  const [channels, setChannels] = useState<any>([]);
  const [currentChannel, setCurrentChannel] = useState(0);
  const [messages, setMessages] = useState<any>([]);
  const [channelName, setChannelName] = useState('');
  const [socket, setSocket] = useState(io('/chat', { autoConnect: false }));
  const [leaveChannelDialog, setLeaveChannelDialog] = useState(false);
  const [userExist, setUserExist] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await apiUser.getMe();

        if (user) {
          setUserExist(true);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          error,
        );
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (userExist === false) return;
    const fetchChannels = async () => {
      const channels = await apiChannel.getChannels();
      setChannels(channels);
    };
    fetchChannels();
  }, [userExist]);

  useEffect(() => {
    if (userExist === false) return;
    const channelName = channels.find(
      (channel: any) => channel.id === currentChannel,
    )?.name;
    setChannelName(channelName || '');
  }, [currentChannel, userExist]);

  useEffect(() => {
    if (userExist === false) return;
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [userExist]);

  useEffect(() => {
    if (userExist === false) return;
    function handleIncomingMessage(message: any) {
      if (message.channelId === currentChannel) {
        setMessages([...messages, message]);
      }
    }
    function handleLeaveChannel(channelId: number) {
      const fetchChannels = async () => {
        const channels = await apiChannel.getChannels();
        setChannels(channels);
      };
      setCurrentChannel(0);
      fetchChannels();
    }
    function handleConnection() {
      console.log('connected');
    }
    function handleDisconnect() {
      console.log('disconnected');
    }
    socket.on('message', handleIncomingMessage);
    socket.on('Leave channel', handleLeaveChannel);
    socket.on('connect', handleConnection);
    socket.on('disconnect', handleDisconnect);
    return () => {
      socket.off('message', handleIncomingMessage);
      socket.off('Leave channel', handleLeaveChannel);
      socket.off('connect', handleConnection);
      socket.off('disconnect', handleDisconnect);
    };
  }, [currentChannel, messages, userExist]);

  const [search, setSearch] = useState('');
  const filteredTabs = channels.filter((tab: any) => {
    return tab.name.toLowerCase().includes(search.toLowerCase());
  });

  const sortedTabs = [...filteredTabs];
  sortedTabs.sort((a: any, b: any) => {
    return a.name.localeCompare(b.name);
  });
  if (userExist === false) return <div></div>;
  return (
    <div className="flex h-screen flex-col min-h-0 w-full">
      <div className="z-40 py-2 bg-gray-800">
        <Navbar2 />
      </div>
      <div className="flex-auto flex flex-col min-h-0 w-full">
        <div className="flex-auto flex flex-row min-h-0">
          <div className="sm:w-1/4 w-1/6 flex flex-col border-r-2 border-gray-950">
            <SearchChat search={search} setSearch={setSearch} />
            <div className="flex-col flex overflow-y-scroll overflow-y-auto no-scrollbar">
              <ChatTabAdd setChannels={setChannels} channels={channels} />
              {sortedTabs.map((tab: any) => {
                return (
                  <ChatTab
                    messages={messages}
                    key={tab.id}
                    name={tab.name}
                    id={tab.id}
                    avatar="https://img-02.stickers.cloud/packs/1da1c0da-9330-4d89-9700-8d75b9c62635/webp/65bb0543-f220-456a-ad64-2ae40431ec03.webp"
                    onClick={() => {
                      setCurrentChannel(tab.id);
                    }}
                    type={
                      tab.isPublic && !tab.isPasswordProtected
                        ? 'Public'
                        : tab.isPasswordProtected
                        ? 'Protected'
                        : !tab.isGroup
                        ? 'DM'
                        : 'Private'
                    }
                    createChannel={false}
                  />
                );
              })}
            </div>
          </div>
          <LeaveChannelDialog
            channelId={currentChannel}
            leaveChannelDialog={leaveChannelDialog}
            setLeaveChannelDialog={setLeaveChannelDialog}
          />
          {currentChannel ? (
            <Channel
              channelId={currentChannel}
              messages={messages}
              setMessages={setMessages}
              channelName={channelName || 'DM'}
              setChannelName={setChannelName}
              socket={socket}
              channels={channels}
              setChannels={setChannels}
              leaveChannelDialog={leaveChannelDialog}
              setLeaveChannelDialog={setLeaveChannelDialog}
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
