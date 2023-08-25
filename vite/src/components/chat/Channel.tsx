import { useEffect, useState } from 'react';
// import MessageOther from "./MessageOther";
import Messages from './Messages';
import api from '../../api/chat/message';
import MyMenu from './Menu';
import ChangeNameDialog from './dialog/ChangeNameDialog';
import AddSomeoneDialog from './dialog/AddSomeoneDialog';
import ListOfUsersDialog from './dialog/ListOfUsersDialog';
import LeaveChannelDialog from './dialog/LeaveChannelDialog';
import { Socket } from 'socket.io-client';

function Channel(props: {
  channelId: number;
  messages: any;
  setMessages: any;
  channelName: string;
  setChannelName: any;
  socket: Socket;
}) {
  const [message, setMessage] = useState('');
  const [addSomeoneDialog, setAddSomeoneDialog] = useState(false);
  const [changeNameDialog, setChangeNameDialog] = useState(false);
  const [leaveChannelDialog, setLeaveChannelDialog] = useState(false);
  const [listOfUsersDialog, setListOfUsersDialog] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await api.getMessages(props.channelId);
      props.setMessages(messages);
    };
    if (props.channelId) {
      fetchMessages();
    }
  }, [props.channelId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api.sendMessage(message, props.channelId, props.socket);
    // api.postMessage(message, props.channelId); // need to get channelId and authorId from server
    // console.log(messages);
    setMessage('');
  };

  // scroll to bottom of messages
  useEffect(() => {
    const messages = document.getElementById('messages');
    if (messages) {
      messages.scrollTop = messages.scrollHeight;
    }
  }, [props.messages]);

  return (
    <div className="sm:w-3/4 w-5/6 flex flex-col">
      <div className="flex border-b-2 border-t-2 border-gray-950 py-4 px-2 justify-between">
        <div className="py-2 px-3 text-lg font-semibold dark:text-gray-200 text-black overflow-hidden overflow-ellipsis">
          {props.channelName}
        </div>
        <MyMenu
          channelName={props.channelName}
          changeNameDialog={changeNameDialog}
          setChangeNameDialog={setChangeNameDialog}
          addSomeoneDialog={addSomeoneDialog}
          setAddSomeoneDialog={setAddSomeoneDialog}
          listOfUsersDialog={listOfUsersDialog}
          setListOfUsersDialog={setListOfUsersDialog}
          leaveChannelDialog={leaveChannelDialog}
          setLeaveChannelDialog={setLeaveChannelDialog}
        />
        <ChangeNameDialog
          changeNameDialog={changeNameDialog}
          setChangeNameDialog={setChangeNameDialog}
          nameOfChannel={props.channelName}
          setNameOfChannel={props.setChannelName}
          channelId={props.channelId}
        ></ChangeNameDialog>
        <AddSomeoneDialog
          addSomeoneDialog={addSomeoneDialog}
          setAddSomeoneDialog={setAddSomeoneDialog}
        ></AddSomeoneDialog>
        <ListOfUsersDialog
          listOfUsersDialog={listOfUsersDialog}
          setListOfUsersDialog={setListOfUsersDialog}
        ></ListOfUsersDialog>
        <LeaveChannelDialog
          leaveChannelDialog={leaveChannelDialog}
          setLeaveChannelDialog={setLeaveChannelDialog}
        ></LeaveChannelDialog>
      </div>
      <div
        id="messages"
        className="flex-col mt-5 mx-3 flex-auto overflow-y-auto overflow-y-scroll no-scrollbar"
      >
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
      <div className="pt-auto pb-3 px-4">
        <form action="submit" onSubmit={handleSubmit}>
          <input
            className="w-full dark:border dark:border-gray-700 dark:border-light-blue-300 dark:bg-gray-950 bg-rose-100 py-5 px-3 rounded-xl dark:text-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-sky-950 focus:border-transparent"
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
