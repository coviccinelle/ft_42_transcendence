import { useEffect, useState } from 'react';
import apiMessage from '../../api/chat/message';

function ChatTab(props: {
  messages: any;
  name: string;
  id: any;
  avatar: string;
  onClick: any;
  type: string;
  createChannel: boolean;
}) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      console.log('props.id : ', props.id);
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
        <p className="dark:text-gray-300 text-gray-800 hidden sm:flex">
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
        <img
          src={props.avatar} // image from group chat or other user
          className="h-12 w-12 rounded-full"
        />
      </div>
      <div className="sm:w-32">
        <div className="text-lg font-semibold hidden sm:flex">
          <p className="overflow-hidden overflow-ellipsis hover:underline">
            {props.name}
          </p>
        </div>
        <div className="dark:text-gray-300 text-gray-800 hidden sm:flex">
          {displayMessageOrType()}
        </div>
      </div>
    </div>
  );
}

export default ChatTab;
