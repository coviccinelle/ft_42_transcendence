import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import apiUser from '../../api/user';
import User from './User';
import { useNavigate } from 'react-router-dom';

function FriendsListDialog(props: {
  friendsListDialog: any;
  setFriendsListDialog: any;
}) {
  const [listOfFriends, setListOfFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      const response = await apiUser.getFriends();
      setListOfFriends(response);
    };
    fetchFriends();
  }, [props.friendsListDialog]);

  function closeDialog() {
    props.setFriendsListDialog(false);
  }

  return (
    <>
      <Transition appear show={props.friendsListDialog} as={Fragment}>
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
                  <button></button>
                  List of Friends
                </Dialog.Title>
                <div className="mt-2 no-scrollbar h-full overflow-y-scroll">
                  {listOfFriends.map((user: any) => (
                    <User
                      key={user.id}
                      user={user}
                      onClick={() => {
                        props.setFriendsListDialog(false);
                        return navigate('/profile/' + user.id);
                      }}
                      setFriendsListDialog={props.setFriendsListDialog}
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

export default FriendsListDialog;
