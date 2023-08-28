import { useEffect, useState } from 'react';
// import MessageOther from "./MessageOther";
import Message from './Message';
import apiMessage from '../../api/chat/message';
import apiUser from '../../api/chat/user';
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
  setChannels: any;
}) {
  const [message, setMessage] = useState('');
  const [addSomeoneDialog, setAddSomeoneDialog] = useState(false);
  const [changeNameDialog, setChangeNameDialog] = useState(false);
  const [leaveChannelDialog, setLeaveChannelDialog] = useState(false);
  const [listOfUsersDialog, setListOfUsersDialog] = useState(false);
  const [userMe, setUserMe] = useState();
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const user = await apiUser.getMe();
      setUserMe(user);
    };
    const fetchUsersInChannel = async () => {
      const users = await apiUser.getUsersInChannel(props.channelId);
      const role = users.find((user: any) => user.id === userMe?.id)?.members[0]
        .role;
      setRole(role);
    };
    fetchUser();
    fetchUsersInChannel();
  }, [props.channelId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await apiMessage.getMessages(props.channelId);
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
    apiMessage.sendMessage(message, props.channelId, props.socket);
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
          setChannels={props.setChannels}
        ></ChangeNameDialog>
        <AddSomeoneDialog
          addSomeoneDialog={addSomeoneDialog}
          setAddSomeoneDialog={setAddSomeoneDialog}
        ></AddSomeoneDialog>
        <ListOfUsersDialog
          listOfUsersDialog={listOfUsersDialog}
          setListOfUsersDialog={setListOfUsersDialog}
          channelId={props.channelId}
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
            <Message
              role={role}
              message={message.content}
              author={message.author.user.firstName}
              avatar={message.author.user.picture}
              id={message.author.user.id}
            />
          );
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