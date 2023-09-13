import { useEffect, useState } from 'react';
import apiUser from '../../api/user';

function User(props: { user: any; onClick: any; setFriendsListDialog: any }) {
  if (!props.user.picture) {
    props.user.picture = 'https://i.imgur.com/6VBx3io.png';
  }
  const [isMe, setIsMe] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<number>(0);

  useEffect(() => {
    const fetchUserMe = async () => {
      const userMe = await apiUser.getMe();
      if (userMe.id === props.user.id) setIsMe(true);
    };
    const fetchUserOnline = async () => {
      const res = await apiUser.getConnectionStatus(props.user.id);
      setIsOnline(res.status);
    };
    fetchUserMe();
    fetchUserOnline();
  }, []);

  return (
    <div className="flex flex-row">
      <div
        className="flex flex-row py-4 px-2 rounded-2xl items-center dark:hover:bg-gray-600 cursor-pointer dark:text-white text-gray-900 hover:bg-rose-300 w-full"
        onClick={props.onClick}
      >
        <div className="w-1/4 relative">
          <img
            src={props.user.picture}
            className="object-cover h-12 w-12 rounded-full"
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
        <div className="w-full">
          <div className="textLg font-semibold">{props.user.nickname}</div>
        </div>
      </div>
      <div
        className="flex w-1/5 items-center justify-center cursor-pointer text-red-500 hover:text-red-700"
        onClick={async () => {
          await apiUser.removeFriend(props.user.id);
          props.setFriendsListDialog(false);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  );
}

export default User;
