import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import User from './User';
import apiUser from '../../../api/user';

function AdminDialog(props: {
  channelId: number;
  adminDialog: any;
  setAdminDialog: any;
  userMe: any;
  role: string;
}) {
  const [listOfUsers, setListOfUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await apiUser.getUsersInChannel(props.channelId);
      setListOfUsers(response);
    };
    fetchUsers();
  }, [props.adminDialog]);

  function closeDialog() {
    props.setAdminDialog(false);
  }

  return (
    <>
      <Transition appear show={props.adminDialog} as={Fragment}>
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
                  Manage admins
                  <button></button>
                </Dialog.Title>
                <div className="mt-2 no-scrollbar h-64 overflow-y-scroll ">
                  {listOfUsers.map((user: any) => (
                    <User
                      key={user.id}
                      user={user}
                      onClick={() => {}}
                      adminDialog={true}
                      listOfUsersDialog={false}
                      channelId={props.channelId}
                      userMe={props.userMe}
                      role={props.role}
                      dialog={props.setAdminDialog}
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

export default AdminDialog;
