import { Dialog, Tab, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import ChatTab from '../ChatTab';
import apiChannel from '../../../api/chat/channel';
import PasswordDialog from './PasswordDialog';

function CreateChannelDialog(props: {
  createChannelDialog: any;
  setCreateChannelDialog: any;
  channels: any;
  setChannels: any;
}) {
  const [allChannels, setAllChannels] = useState([]);
  const [selected, setSelected] = useState('public');
  const [passwordCreate, setPasswordCreate] = useState('');
  const [nameOfChannel, setNameOfChannel] = useState('');
  const [passwordDialog, setPasswordDialog] = useState(false);

  useEffect(() => {
    const fetchAllChannels = async () => {
      const allChannels = await apiChannel.getAllChannels();
      setAllChannels(allChannels);
    };
    const fetchChannels = async () => {
      const channels = await apiChannel.getChannels();
      props.setChannels(channels);
    };
    fetchChannels();
    fetchAllChannels();
    setSelected('public');
    setPasswordCreate('');
  }, [props.createChannelDialog, passwordDialog]);

  function closeDialog() {
    props.setCreateChannelDialog(false);
  }

  function handleChangePasswordCreate(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswordCreate(e.target.value);
  }
  function handleChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    setNameOfChannel(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await apiChannel.createChannel(
      nameOfChannel,
      selected !== 'private',
      passwordCreate,
    );
    props.setCreateChannelDialog(false);
  }
  const [channelId, setChannelId] = useState(0);
  const [passwordGuess, setPasswordGuess] = useState('');
  return (
    <>
      <PasswordDialog
        passwordDialog={passwordDialog}
        setPasswordDialog={setPasswordDialog}
        channelId={channelId}
        handleSubmit={async (e: any) => {
          e.preventDefault();
          const res = await apiChannel.joinChannel(channelId, passwordGuess);
          if (res === 'wrong password') {
            setPasswordGuess('');
            alert('wrong password');
            return;
          }
          console.log(res);
          setPasswordGuess('');
          setPasswordDialog(false);
        }}
        password={passwordGuess}
        setPassword={setPasswordGuess}
      />
      <Transition appear show={props.createChannelDialog} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeDialog}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform dark:bg-gray-800 bg-rose-100 shadow-xl rounded-2xl">
                <Tab.Group as="div" className="flex flex-col h-full">
                  <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
                    <Tab
                      className={({ selected }) =>
                        `${
                          selected
                            ? 'dark:bg-blue-900 bg-rose-300 shadow dark:text-blue-100 text-amber-900'
                            : 'text-blue-400 dark:hover:text-blue-100 hover:text-gray-800'
                        } relative flex items-center justify-center flex-1 p-2 text-sm font-medium leading-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200`
                      }
                    >
                      <span>Create a channel</span>
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        `${
                          selected
                            ? 'dark:bg-blue-900 bg-rose-300 shadow dark:text-blue-100 text-amber-900'
                            : 'text-blue-400 dark:hover:text-blue-100 hover:text-gray-800'
                        } relative flex items-center justify-center flex-1 p-2 text-sm font-medium leading-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200`
                      }
                    >
                      <span>Join a channel</span>
                    </Tab>
                  </Tab.List>
                  <Tab.Panels>
                    <Tab.Panel>
                      <div className="mt-2">
                        <form action="submit" onSubmit={handleSubmit}>
                          <input
                            type="text"
                            className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none dark:bg-blue-100 bg-white"
                            placeholder="Name of channel"
                            value={nameOfChannel}
                            onChange={handleChangeName}
                          />
                        </form>

                        {selected === 'protected' ? (
                          <div className="mt-2">
                            <form action="submit" onSubmit={handleSubmit}>
                              <input
                                type="password"
                                className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none dark:bg-blue-100 bg-white"
                                placeholder="PasswordCreate"
                                value={passwordCreate}
                                onChange={handleChangePasswordCreate}
                              />
                            </form>
                          </div>
                        ) : null}
                        <div className="mt-2">
                          <label className="flex cursor-pointer">
                            <select
                              className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none dark:bg-blue-100 bg-white"
                              onChange={(e) => setSelected(e.target.value)}
                            >
                              <option value="public">Public</option>
                              <option value="private">Private</option>
                              <option value="protected">Protected</option>
                            </select>
                          </label>
                        </div>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel
                      as="div"
                      className="flex flex-col overflow-y-auto overflow-y-scroll no-scrollbar h-96"
                    >
                      {allChannels.map((channel: any) => {
                        let type = 'Public';
                        console.log(channel);
                        if (!channel.isPublic) {
                          type = 'Private';
                        } else if (channel.isPasswordProtected) {
                          type = 'Protected';
                        }
                        return (
                          <ChatTab
                            messages={[]}
                            key={channel.id}
                            name={channel.name}
                            id={channel.id}
                            type={type}
                            createChannel={true}
                            avatar="https://img-02.stickers.cloud/packs/1da1c0da-9330-4d89-9700-8d75b9c62635/webp/65bb0543-f220-456a-ad64-2ae40431ec03.webp"
                            onClick={async () => {
                              if (channel.isPasswordProtected) {
                                closeDialog();
                                setChannelId(channel.id);
                                setPasswordDialog(true);
                                return;
                              }
                              await apiChannel.joinChannel(channel.id, '');
                              closeDialog();
                            }}
                          />
                        );
                      })}
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default CreateChannelDialog;
