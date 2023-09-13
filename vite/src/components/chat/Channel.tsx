import { useEffect, useState } from 'react';
import Message from './Message';
import apiMessage from '../../api/chat/message';
import apiUser from '../../api/user';
import apiChannel from '../../api/chat/channel';
import MyMenu from './Menu';
import ChangeNameDialog from './dialog/ChangeNameDialog';
import AddSomeoneDialog from './dialog/AddSomeoneDialog';
import ListOfUsersDialog from './dialog/ListOfUsersDialog';
import { Socket } from 'socket.io-client';
import AdminDialog from './dialog/AdminDialog';
import apiGame from '../../api/game';
import { useNavigate } from 'react-router-dom';

function Channel(props: {
  channelId: number;
  messages: any;
  setMessages: any;
  channelName: string;
  setChannelName: any;
  socket: Socket;
  channels: any;
  setChannels: any;
  leaveChannelDialog: any;
  setLeaveChannelDialog: any;
}) {
  const [message, setMessage] = useState('');
  const [addSomeoneDialog, setAddSomeoneDialog] = useState(false);
  const [changeNameDialog, setChangeNameDialog] = useState(false);
  const [listOfUsersDialog, setListOfUsersDialog] = useState(false);
  const [adminDialog, setAdminDialog] = useState(false);
  const [userMe, setUserMe] = useState<any>();
  const [role, setRole] = useState('');
  const [type, setType] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchChannel = async () => {
      const channel = await apiChannel.getChannel(props.channelId);
      if (channel.isPublic && !channel.passwordProtected) {
        setType('public');
      } else if (channel.isPublic && channel.passwordProtected) {
        setType('protected');
      } else if (
        !channel.isPublic &&
        !channel.passwordProtected &&
        channel.isGroup
      ) {
        setType('private');
      } else {
        setType('DM');
      }
    };
    fetchChannel();
  }, [props.channelId]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await apiUser.getMe();
      setUserMe(user);
    };
    fetchUser();
  }, [props.channelId]);

  useEffect(() => {
    const fetchUsersInChannel = async () => {
      const users = await apiUser.getUsersInChannel(props.channelId);
      const role = users.find((user: any) => user.id === userMe?.id)?.members[0]
        .role;
      setRole(role);
    };
    fetchUsersInChannel();
  }, [props.channelId, userMe]);

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
    if (e.target.value.length > 1000) {
      return;
    }
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.length === 0) {
      return;
    }
    apiMessage.sendMessage(message, props.channelId, props.socket, 'REGULAR');
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
          leaveChannelDialog={props.leaveChannelDialog}
          setLeaveChannelDialog={props.setLeaveChannelDialog}
          setAdminDialog={setAdminDialog}
          role={role}
          channel={props.channels.find(
            (channel: any) => channel.id === props.channelId,
          )}
          type={type}
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
          channelId={props.channelId}
          addSomeoneDialog={addSomeoneDialog}
          setAddSomeoneDialog={setAddSomeoneDialog}
        ></AddSomeoneDialog>
        <ListOfUsersDialog
          listOfUsersDialog={listOfUsersDialog}
          setListOfUsersDialog={setListOfUsersDialog}
          channelId={props.channelId}
          userMe={userMe}
          role={role}
        ></ListOfUsersDialog>
        <AdminDialog
          adminDialog={adminDialog}
          setAdminDialog={setAdminDialog}
          channelId={props.channelId}
          userMe={userMe}
          role={role}
        ></AdminDialog>
      </div>
      <div
        id="messages"
        className="flex-col mt-5 mx-3 flex-auto overflow-y-auto overflow-y-scroll no-scrollbar overflow-x-hidden"
      >
        {props.messages.map((message: any) => {
          return (
            <Message
              key={message.id}
              role={role}
              message={message.content}
              author={message.author.user.nickname}
              avatar={message.author.user.picture}
              id={message.author.user.id}
              user={userMe}
              type={message.type}
            />
          );
        })}
      </div>
      <div className="flex flex-row w-full">
        <div className="mx-2 flex flex-row">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={async () => {
              const idGame = await apiGame.getIdGame();
              apiMessage.sendMessage(
                `/game/${idGame.uuid}`,
                props.channelId,
                props.socket,
                'INVITE',
              );
              navigate(`/game/${idGame.uuid}`);
            }}
          >
            Invite for game
          </button>
        </div>
        <div className="pt-auto pb-3 px-4 w-full">
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
    </div>
  );
}

export default Channel;
