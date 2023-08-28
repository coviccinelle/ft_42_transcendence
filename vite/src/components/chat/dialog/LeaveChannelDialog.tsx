import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import apiChannel from '../../../api/chat/channel';

function LeaveChannelDialog(props: {
  leaveChannelDialog: any;
  setLeaveChannelDialog: any;
  channelId: number;
}) {
  function closeDialog() {
    props.setLeaveChannelDialog(false);
  }

  return (
    <>
      <Transition appear show={props.leaveChannelDialog} as={Fragment}>
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
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 dark:text-gray-300 text-gray-900"
                >
                  Leaving the channel
                </Dialog.Title>
                <div className="mt-2">
                  <div className="flex flex-col dark:text-white text-gray-900">
                    Are you sure you want to leave the channel?
                  </div>
                  <button
                    className="mt-4 bg-red-500 hover:bg-red-600 text-red-950 font-bold py-2 px-4 rounded"
                    onClick={async () => {
                      await apiChannel.leaveChannel(props.channelId);
                      closeDialog();
                    }}
                  >
                    Leave
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default LeaveChannelDialog;
