import { useEffect, useState } from 'react';
// import MessageOther from "./MessageOther";
import Messages from './Messages';
import api from '../api/chat';

function Channel(props: {
  channelId: number;
  messages: any;
  setMessages: any;
}) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await api.getMessages(props.channelId);
      props.setMessages(messages);
    };
    fetchMessages();
  }, [props.channelId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(message + " submitted"); // send message to server
    const newMessage = {
      content: message,
      authorId: 1,
    };
    // props.setMessages([...props.messages, newMessage]); // send message to database
    api.postMessage(message, props.channelId, 1); // need to get channelId and authorId from server
    // console.log(messages);
    setMessage('');
  };

  return (
    <div className="w-full px-5 flex flex-col justify-between">
      <div className="flex flex-col mt-5">
        {props.messages.map((message: any) => {
          return (
            <Messages
              message={message.content}
              author={'you'}
              avatar="https://img-02.stickers.cloud/packs/1da1c0da-9330-4d89-9700-8d75b9c62635/webp/af435734-4fe8-4c6f-a37e-1ac423e849b3.webp"
            />
          ); // need author and avatar from server
        })}
      </div>
      <div className="py-5">
        <form action="submit" onSubmit={handleSubmit}>
          <input
            className="w-full bg-gray-300 py-5 px-3 rounded-xl"
            type="text"
            value={message}
            onChange={handleChange}
            placeholder="type your message here..."
          />
        </form>
      </div>
    </div>
  );
}

export default Channel;
