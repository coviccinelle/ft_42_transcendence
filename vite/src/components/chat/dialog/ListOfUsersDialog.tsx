import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import User from './User';

function ListOfUsersDialog(props: {
  listOfUsersDialog: any;
  setListOfUsersDialog: any;
}) {
  const [listOfUsers, setListOfUsers] = useState([
    {
      id: 1,
      name: 'John',
      avatar:
        'https://mellitahog.ly/en/wp-content/uploads/2021/09/randomUser.jpg',
    },
    {
      id: 2,
      name: 'Jane',
      avatar:
        'https://mellitahog.ly/en/wp-content/uploads/2021/09/randomUser.jpg',
    },
    {
      id: 3,
      name: 'John',
      avatar:
        'https://mellitahog.ly/en/wp-content/uploads/2021/09/randomUser.jpg',
    },
    {
      id: 4,
      name: 'John',
      avatar:
        'https://mellitahog.ly/en/wp-content/uploads/2021/09/randomUser.jpg',
    },
    {
      id: 5,
      name: 'John',
      avatar:
        'https://mellitahog.ly/en/wp-content/uploads/2021/09/randomUser.jpg',
    },
    {
      id: 5,
      name: 'John',
      avatar:
        'https://mellitahog.ly/en/wp-content/uploads/2021/09/randomUser.jpg',
    },
    {
      id: 5,
      name: 'John',
      avatar:
        'https://mellitahog.ly/en/wp-content/uploads/2021/09/randomUser.jpg',
    },
    {
      id: 5,
      name: 'John',
      avatar:
        'https://mellitahog.ly/en/wp-content/uploads/2021/09/randomUser.jpg',
    },
    {
      id: 5,
      name: 'John',
      avatar:
        'https://mellitahog.ly/en/wp-content/uploads/2021/09/randomUser.jpg',
    },
    {
      id: 5,
      name: 'John',
      avatar:
        'https://mellitahog.ly/en/wp-content/uploads/2021/09/randomUser.jpg',
    },
    {
      id: 5,
      name: 'John',
      avatar:
        'https://mellitahog.ly/en/wp-content/uploads/2021/09/randomUser.jpg',
    },
    {
      id: 5,
      name: 'John',
      avatar:
        'https://mellitahog.ly/en/wp-content/uploads/2021/09/randomUser.jpg',
    },
    {
      id: 5,
      name: 'John',
      avatar:
        'https://mellitahog.ly/en/wp-content/uploads/2021/09/randomUser.jpg',
    },
    {
      id: 5,
      name: 'John',
      avatar:
        'https://mellitahog.ly/en/wp-content/uploads/2021/09/randomUser.jpg',
    },
  ]);
  function closeDialog() {
    props.setListOfUsersDialog(false);
  }

  return (
    <>
      <Transition appear show={props.listOfUsersDialog} as={Fragment}>
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
              <div className="inline-block w-full h-96 max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform dark:bg-gray-800 bg-rose-100 shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 dark:text-gray-200 text-gray-900"
                >
                  List of users in this channel
                </Dialog.Title>
                <div className="mt-2 no-scrollbar h-full overflow-y-scroll">
                  {listOfUsers.map((user) => (
                    <User
                      key={user.id}
                      user={user}
                      onClick={() => {
                        console.log('go to profile');
                        props.setListOfUsersDialog(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default ListOfUsersDialog;
