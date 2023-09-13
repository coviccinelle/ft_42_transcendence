import { useEffect, useState } from 'react';
import apiMessage from '../../api/chat/message';
import apiUser from '../../api/user';

function ChatTab(props: {
  messages: any;
  name: string;
  id: any;
  avatar: string;
  onClick: any;
  type: string;
  createChannel: boolean;
}) {
  const [messages, setMessages] = useState<any>([]);
  const [name, setName] = useState(props.name);

  useEffect(() => {
    const fetchUser = async () => {
      const userMe = await apiUser.getMe();
      const users = await apiUser.getUsersInChannel(props.id);
      const name = users.find((user: any) => user.id !== userMe.id)?.firstName;
      setName(name);
    };
    if (props.type === 'DM') {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await apiMessage.getMessages(props.id);
      setMessages(messages);
    };
    if (props.id && props.createChannel === false) {
      fetchMessages();
    }
  }, [props.id, props.messages]);

  function displayMessageOrType() {
    if (props.type === 'Public' && messages.length > 0) {
      return (
        <p className="dark:text-gray-300 text-gray-800 hidden sm:flex truncate">
          {messages[messages.length - 1].content}
        </p>
      );
    } else {
      return (
        <p className="dark:text-gray-300 text-gray-800 hidden sm:flex">
          {props.type}
        </p>
      );
    }
  }
  return (
    <div
      className="flex flex-row py-4 px-2 items-center dark:text-white text-black dark:hover:bg-gradient-to-r hover:bg-gradient-to-r dark:hover:from-sky-950 hover:from-amber-300 dark:hover:to-violet-900 hover:to-rose-300 cursor-pointer"
      onClick={props.onClick}
    >
      <div className="sm:w-1/4">
        <img src={props.avatar} className="h-12 w-12 rounded-full" />
      </div>
      <div className="sm:w-3/4 flex flex-col">
        <div className="text-lg font-semibold hidden sm:flex">
          <p className="overflow-hidden overflow-ellipsis hover:underline">
            {props.name ? props.name : name}
          </p>
        </div>
        <div className="dark:text-gray-300 text-gray-800 truncate">
          {displayMessageOrType()}
        </div>
      </div>
    </div>
  );
}

export default ChatTab;
