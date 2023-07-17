import Channel from '../components/Channel';
import SearchChat from '../components/SearchChat';
import ChatTabs from '../components/ChatTabs';
import { useEffect, useState } from 'react';

function ChatPage() {
  const [tabs, setTabs] = useState([
    'Anniv',
    'Noel',
    'Test',
    'Blabla',
    'Salut a tous',
    'Anniv',
    'Noel',
    'Test',
    'Blabla',
    'Salut a tous',
    'Anniv',
    'Noel',
  ]); // need to map chats from server
  const [tabsFiltered, setTabsFiltered] = useState([
    'Anniv',
    'Noel',
    'Test',
    'Blabla',
    'Salut a tous',
    'Anniv',
    'Noel',
    'Test',
    'Blabla',
    'Salut a tous',
    'Anniv',
    'Noel',
  ]); // need to map chats from server

  const [search, setSearch] = useState('');

  const filteredTabs = tabs.filter((tab) => {
    return tab.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    if (search === '') {
      setTabsFiltered(tabs);
    } else setTabsFiltered(filteredTabs);
  }, [search]);

  // display only the tabs that match the search

  return (
    <>
      <div className="flex flex-row h-screen">
        <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
          <SearchChat search={search} setSearch={setSearch} />
          {tabsFiltered.map((tab) => {
            return (
              <ChatTabs
                name={tab}
                lastMessage={'last message'}
                avatar="https://img-02.stickers.cloud/packs/1da1c0da-9330-4d89-9700-8d75b9c62635/webp/65bb0543-f220-456a-ad64-2ae40431ec03.webp"
              />
            );
          })}
        </div>
        <Channel />
      </div>
    </>
  );
}

export default ChatPage;
