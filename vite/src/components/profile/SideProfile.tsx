import apiUser from '../../api/user';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// if it's your profile, you can't see the add friend + send message button
function SideProfile() {
  const [firstName, setFirstName] = useState('');
  const [img, setImg] = useState('/assets/duckie_bg_rm/sticker1.png');

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await apiUser.getMe();
      if (user) {
        setFirstName(user.firstName);
        if (user.picture && user.picture !== '') {
          setImg(user.picture);
        }
      } else {
        navigate('/login');
      }
    };
    fetchUser();
    //check if the user is online
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
    return (
        <aside className="z-20 flex-shrink-0 hidden w-64 pl-2 overflow-y-auto bg-gray-800 md:block">
        <div>
          <div className="text-white">
            <div className="flex p-2 bg-gray-800">
              <div className="flex py-3 px-2 items-center">
                <a className="text-3xl text-yellow-500 font-bold" href="/">
                  42{' '}
                </a>
                <a
                  className="animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-2xl font-black"
                  href="/"
                >
                  Duckie Pooong
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div>
            <div className="flex justify-center relative">
              <img
                className="hidden h-24 w-24 rounded-full sm:block object-cover mr-2 border-4 border-yellow-300"
                src={img}
                alt="Your avatar"
              />
              {isOnline ? (
                <span className="absolute top-0 right-0 flex w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
              ) : (
                <span className="absolute top-0 right-0 flex w-3.5 h-3.5 bg-gray-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
              )}
            </div>
            <p className="font-bold text-base text-gray-400 pt-2 text-center w-24">
              {' '}
              {firstName}{' '}
            </p>
          </div>
        </div>
        <div>
          <div className="w-full px-4 lg:order-3 lg:self-center">
            <div className="py-6 px-3">
              <button
                className="bg-yellow-100 active:bg-green-300 uppercase text-black font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded-2xl hover:text-blue-400 hover:animate-pulse sm:mr-2 mb-1 ease-linear transition-all duration-150"
                type="button"
              >
                Add Friend
              </button>
            </div>
          </div>
          <ul className="mt-5 leading-10">
            <li className="relative px-2 py-1">
              <div
                className="inline-flex items-center w-full text-sm font-semibold text-white transition-colors duration-150 cursor-pointer hover:text-green-500"
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <a className="ml-4" href="/">
                  Home
                </a>
              </div>
            </li>
            <li className="relative px-2 py-1" x-data="{ Open : false  }">
              <div
                className="inline-flex items-center justify-between w-full text-base font-semibold transition-colors duration-150 text-gray-500  hover:text-yellow-400 cursor-pointer"
                x-on:click="Open = !Open"
              >
                <span className="inline-flex items-center  text-sm font-semibold text-white hover:text-green-400">
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
                      d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
                    />
                  </svg>
                  <span className="ml-4">Send Message</span>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </aside>
        
    );
}

export default SideProfile;