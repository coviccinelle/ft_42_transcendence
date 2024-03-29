import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

function PasswordDialog(props: {
  passwordDialog: any;
  setPasswordDialog: any;
  channelId: number;
  handleSubmit: any;
  password: any;
  setPassword: any;
}) {
  function closeDialog() {
    props.setPasswordDialog(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    props.setPassword(e.target.value);
  }

  return (
    <>
      <Transition appear show={props.passwordDialog} as={Fragment}>
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
                  className="text-lg font-medium leading-6 dark:text-gray-200 text-gray-900"
                >
                  Password protected
                </Dialog.Title>
                <div className="mt-2">
                  <form action="submit" onSubmit={(e) => props.handleSubmit(e)}>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none dark:bg-blue-100 bg-white"
                      placeholder="password"
                      value={props.password}
                      onChange={handleChange}
                    />
                  </form>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default PasswordDialog;
