import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

function CreateChannelDialog(props: {
  createChannelDialog: any;
  setCreateChannelDialog: any;
  channels: any;
  setChannels: any;
}) {
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [nameOfChannel, setNameOfChannel] = useState('');
  function closeDialog() {
    props.setCreateChannelDialog(false);
  }

  function handleChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }
  function handleChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    setNameOfChannel(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // console.log(props.nameOfChannel + " submitted");
    const newChannel = {
      name: nameOfChannel,
      id: props.channels.length + 1,
    };
    props.setChannels([...props.channels, newChannel]);
    // api.createChannel(nameOfChannel);!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    props.setCreateChannelDialog(false);
  }

  return (
    <>
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-200"
                >
                  Create a channel
                </Dialog.Title>
                <div className="mt-2">
                  <form action="submit" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none bg-blue-100"
                      placeholder="Name of channel"
                      value={nameOfChannel}
                      onChange={handleChangeName}
                    />
                  </form>
                  <div className="flex mt-2 justify-end">
                    <span className="px-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Private
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        checked={checked}
                        onChange={() => {
                          setChecked(!checked);
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  {checked ? (
                    <div className="mt-2">
                      <form action="submit" onSubmit={handleSubmit}>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none bg-blue-100"
                          placeholder="Password"
                          value={password}
                          onChange={handleChangePassword}
                        />
                      </form>
                    </div>
                  ) : null}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default CreateChannelDialog;
