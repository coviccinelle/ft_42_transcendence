import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface MessageInterface {
  channel: string,
  text: string,
};

const socket = io('/chat');

function Chat() {
  const [room, setRoom] = useState('general');
  useEffect(() => {
    var messages = document.getElementById('messages')!;

    socket.on('message', (msg : MessageInterface) => {
      console.log(msg.text);
      var item = document.createElement('li');
      item.textContent = msg.text;
      messages.appendChild(item);
    });
    return () => {
      socket.off('message');
    }
  })

  function handleSendMessage(e : any) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    socket.emit("message", {channel: room, text: formJson.message});
  }

  function handleChangeRoom(e : any) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson.room);
    socket.emit("join", room, formJson.room);
    setRoom(formJson.room.toString());
    console.log('Joined: ' + room);
  }

  return (
    <div>
      <ul id="messages"></ul>
      <form onSubmit={handleSendMessage}>
        <input name="message"/>
        <button type="submit">Send</button>
      </form>
      <form onSubmit={handleChangeRoom}>
        <input name="room" defaultValue='general'/>
        <button type="submit">Join room</button>
      </form>
    </div>
  );
}

export default Chat;
