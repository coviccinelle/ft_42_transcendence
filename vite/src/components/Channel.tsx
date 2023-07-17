import { useState } from 'react';
// import MessageOther from "./MessageOther";
import Messages from './Messages';

function Channel() {
  const [messages, setMessages] = useState([]); // need to map messages from server
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(message + " submitted"); // send message to server
    setMessages([...messages, message]); // send message to database
    // console.log(messages);
    setMessage('');
  };

  return (
    <div className="w-full px-5 flex flex-col justify-between">
      <div className="flex flex-col mt-5">
        {messages.map((message) => {
          return (
            <Messages
              message={message}
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
