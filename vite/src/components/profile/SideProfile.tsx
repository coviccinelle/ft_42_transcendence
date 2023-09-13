import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiUser from '../../api/user';
import apiChannel from '../../api/chat/channel';
import FriendsListDialog from './FriendsListDialog';

// if it's your profile, you can't see the add friend + send message button
function SideProfile(props: { user: any; userMe: any }) {
  const [isOnline, setIsOnline] = useState(0);
  const navigate = useNavigate();
  const [isFriend, setIsFriend] = useState(false);
  const [friendsListDialog, setFriendsListDialog] = useState(false);
  const [isNotBlocked, setIsNotBlocked] = useState(true);

  useEffect(() => {
    //check if the user is online
    const fetchUserOnline = async () => {
      const res = await apiUser.getConnectionStatus(props.user.id);
      setIsOnline(res.status);
    };
    const fetchIsFriend = async () => {
      const res = await apiUser.getFriends();
      if (res) {
        res.forEach((friend: any) => {
          if (friend.id === props.user.id) {
            setIsFriend(true);
          } else {
            setIsFriend(false);
          }
        });
      }
    };
    const fetchIsNotBlocked = async () => {
      const res = await apiUser.isBlocked(props.user.id);
      setIsNotBlocked(!res);
    };
    fetchIsNotBlocked();
    fetchIsFriend();
    fetchUserOnline();
  }, [props.user.id]);

  const isMe = props.userMe.id === props.user.id;

  return (
    <aside className="z-20 flex-shrink-0 hidden w-64 pl-2 overflow-y-auto bg-gray-800 md:block no-scrollbar">
      <div className="text-white">
        <div className="flex p-3 py-4 bg-gray-800">
          <div className="flex py-4 px-2 items-center">
            <Link className="text-3xl text-yellow-500 font-bold" to="/">
              42
            </Link>
            <Link
              className="animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-2xl font-black"
              to="/"
            >
              Duckie Pooong
            </Link>
          </div>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <div>
          <div className="flex justify-center relative">
            <img
              className="hidden h-24 w-24 rounded-full sm:block object-cover mr-2 border-4 border-yellow-300"
              src={
                isMe
                  ? props.userMe.picture ||
                    'https://img-02.stickers.cloud/packs/1da1c0da-9330-4d89-9700-8d75b9c62635/webp/65bb0543-f220-456a-ad64-2ae40431ec03.webp'
                  : props.user.picture ||
                    'https://img-02.stickers.cloud/packs/1da1c0da-9330-4d89-9700-8d75b9c62635/webp/65bb0543-f220-456a-ad64-2ae40431ec03.webp'
              }
              alt="Your avatar"
            />
            {!isMe &&
              (isOnline === 1 ? (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800"></div>
              ) : isOnline === 2 ? (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-yellow-400 rounded-full border-2 border-gray-800"></div>
              ) : (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-red-400 rounded-full border-2 border-gray-800"></div>
              ))}
          </div>
          <div className="font-bold text-base text-gray-400 pt-2 text-center w-24">
            {isMe ? (
              <p className="font-bold text-base text-gray-400 pt-2 text-center w-24">
                {props.userMe.nickname}
              </p>
            ) : (
              <p>{props.user.nickname}</p>
            )}
          </div>
        </div>
      </div>
      <div>
        {!isMe && !isFriend && (
          <div className="w-full lg:order-3 lg:self-center">
            <button
              className="bg-yellow-100 active:bg-green-300 uppercase text-black font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded-2xl hover:text-blue-400 hover:animate-pulse sm:mr-2 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={async () => {
                await apiUser.addFriend(props.user.id);
                setIsFriend(true);
              }}
            >
              Add Friend
            </button>
          </div>
        )}
        {!isMe && isFriend && (
          <div className="w-full lg:order-3 lg:self-center">
            <button
              className="bg-yellow-100 active:bg-green-300 uppercase text-black font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded-2xl hover:text-blue-400 hover:animate-pulse sm:mr-2 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={async () => {
                await apiUser.removeFriend(props.user.id);
                setIsFriend(false);
              }}
            >
              Remove Friend
            </button>
          </div>
        )}

        {/* //if this user is not you, you can block him */}
        {!isMe && isNotBlocked && (
          <div className="w-full lg:order-3 lg:self-center">
            <button
              className="bg-yellow-100 active:bg-green-300 uppercase text-black font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded-2xl hover:text-blue-400 hover:animate-pulse sm:mr-2 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={async () => {
                await apiUser.blockUser(props.user.id);
                setIsNotBlocked(false);
              }}
            >
              Block
            </button>
          </div>
        )}
        {/* //if this user is not you, and he's blocked you can unblock him */}
        {!isMe && !isNotBlocked && (
          <div className="w-full lg:order-3 lg:self-center">
            <button
              className="bg-yellow-100 active:bg-green-300 uppercase text-black font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded-2xl hover:text-blue-400 hover:animate-pulse sm:mr-2 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={async () => {
                await apiUser.unblockUser(props.user.id);
                setIsNotBlocked(true);
              }}
            >
              Unblock
            </button>
          </div>
        )}

        <ul className="mt-5 leading-10">
          <li className="relative px-2 py-1">
            <div
              className="inline-flex items-center w-full text-sm font-semibold text-white transition-colors duration-150 cursor-pointer hover:text-green-500"
              onClick={() => {
                return navigate('/');
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </div>
          </li>
          {!isMe && (
            <li className="relative px-2 py-1" x-data="{ Open : false  }">
              <div
                className="inline-flex items-center justify-between w-full text-base font-semibold transition-colors duration-150 text-gray-500  hover:text-yellow-400 cursor-pointer"
                x-on:click="Open = !Open"
                onClick={async () => {
                  const channel = await apiChannel.createDm(props.user.id);
                  return navigate(`/chat/${channel}`);
                }}
              >
                <span className="inline-flex items-center  text-sm font-semibold text-white hover:text-green-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
                    />
                  </svg>
                  Send Message
                </span>
              </div>
            </li>
          )}
          <FriendsListDialog
            friendsListDialog={friendsListDialog}
            setFriendsListDialog={setFriendsListDialog}
          />
          {isMe && (
            <li className="relative px-2 py-1" x-data="{ Open : false  }">
              <div
                className="inline-flex items-center justify-between w-full text-base font-semibold transition-colors duration-150 text-gray-500  hover:text-yellow-400 cursor-pointer"
                x-on:click="Open = !Open"
                onClick={() => {
                  setFriendsListDialog(true);
                }}
              >
                <span className="inline-flex items-center  text-sm font-semibold text-white hover:text-green-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  Friends
                </span>
              </div>
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
}

export default SideProfile;
