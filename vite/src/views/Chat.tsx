import Channel from '../components/Channel';
import SearchChat from '../components/SearchChat';
import ChatTab from '../components/ChatTab';
import { useEffect, useState } from 'react';
import api from '../api/chat';

function ChatPage() {
  const [channels, setChannels] = useState([]); // need to map channels from server
  useEffect(() => {
    const fetchChannels = async () => {
      const channels = await api.getChannels(1);
      setChannels(channels);
    };
    fetchChannels();
  }, []);
  const [currentChannel, setCurrentChannel] = useState(1);
  // const [tabs, setTabs] = useState([
  //   'Anniv',
  //   'Noel',
  //   'Test',
  //   'Blabla',
  //   'Salut a tous',
  //   'Anniv',
  //   'Noel',
  //   'Test',
  //   'Blabla',
  //   'Salut a tous',
  //   'Anniv',
  //   'Noel',
  // ]); // need to map chats from server
  const [tabsFiltered, setTabsFiltered] = useState([...channels]); // need to map chats from server
  const [search, setSearch] = useState('');

  const filteredTabs = channels.filter((tab) => {
    return tab.name.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    if (search === '') {
      setTabsFiltered(channels);
    } else setTabsFiltered(filteredTabs);
  }, [search]);

  // display only the tabs that match the search

  return (
    <>
      <div className="flex flex-row h-screen">
        <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
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
        <Channel channelId={currentChannel} />
      </div>
    </>
  );
}

export default ChatPage;
