import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

function GameFinishedDialog(props: {
  gameFinishedDialog: any;
  setGameFinishedDialog: any;
  score: string;
}) {
  function closeDialog() {
    props.setGameFinishedDialog(false);
  }
  return (
    <>
      <Transition appear show={props.gameFinishedDialog} as={Fragment}>
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
              <div className="inline-block max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform dark:bg-gray-800 bg-rose-100 shadow-xl rounded-2xl">
                {props.score === 'WIN' ? (
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 dark:text-gray-200 text-gray-900 text-center"
                  >
                    You won
                  </Dialog.Title>
                ) : (
                  <div className="flex flex-col items-center">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 dark:text-gray-200 text-gray-900 text-center"
                    >
                      You lost
                    </Dialog.Title>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => window.location.reload()}
                    >
                      Play again
                    </button>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default GameFinishedDialog;
