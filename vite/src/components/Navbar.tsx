import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  return (
    <div className="z-40 py-4 bg-gray-800">
      
    <div className="flex mx-auto mr-2 justify-end">
      <ul className="flex items-center flex-shrink-0 space-x-6">
        {/* <!-- Notifications menu --> */}
        <li className="relative">
          <button
            className="p-2 bg-white text-green-400 align-middle rounded-full hover:text-white hover:bg-green-400 focus:outline-none "
            aria-label="Notifications"
            aria-haspopup="true"
          >
            <div className="flex items-cemter">
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            {/* <!-- Notification badge --> */}
            <span
              aria-hidden="true"
              className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
            ></span>
          </button>
        </li>

        {/* <!-- Profile menu --> */}
        <li className="relative">
          <button
            className="p-2 bg-white text-green-400 align-middle rounded-full hover:text-white hover:bg-green-400 focus:outline-none "
            aria-haspopup="true"
            onClick={() => {
              return navigate('/registration');
            }}
          >
            <div className="flex items-center">
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </button>
        </li>
      </ul>
    </div>
    </div>



    // <div className="flex flex-row h-12 w-full bg-gray-950 text-gray-200 justify-between">
    //   <div className="flex flex-row cursor-pointer">
    //     <Link to="/" className="flex px-4 py-3 text-sm items-center">
    //       <span role="img">🐱</span>
    //       <p className="text-xl font-bold py-2">Pong Game</p>
    //     </Link>
    //   </div>
    //     <div className="flex px-2 py-3 text-sm cursor-pointer">
    //       <Link to="/profile">
    //         <span role="img" aria-label="profile">
    //           👤
    //         </span>
    //       </Link>
    //     </div>
    // </div>

  );
}

export default Navbar;
