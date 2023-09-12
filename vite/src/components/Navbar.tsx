import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  return (
    <div className="z-40 py-4 bg-gray-800 px-4">
      
    <div className="flex mx-auto mr-2 justify-end">
    <ul className="flex items-center space-x-6">
        {/* Profile menu */}
        <li className="relative">
          <button
            className="p-2 bg-white text-green-400 align-middle rounded-full hover:text-white hover:bg-green-400 focus:outline-none"
            aria-label="Profile"
            aria-haspopup="true"
            onClick={() => {
              return navigate('/profile');
            }}
          >
            {/* Profile icon */}
            <div className="flex items-center">
            <span role="img" aria-label="profile" className='h-6 w-6'>
               👤
             </span>
            </div>
          </button>
        </li>

        {/* Settings menu */}
        <li className="relative">
          <button
            className="p-2 bg-white text-green-400 align-middle rounded-full hover:text-white hover:bg-green-400 focus:outline-none"
            aria-haspopup="true"
            onClick={() => {
              return navigate('/registration');
            }}
          >
            {/* Setiings icon */}
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {/* Settings paths */}
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


  );
}

export default Navbar;
