import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

// const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
//     const [searchQuery, setSearchQuery] = useState('');

//     const handleSearch = () => {
//         onSearch(searchQuery);
//     };

//     return (
//         <div className="relative flex w-full flex-wrap items-stretch mb-3">
//             <input type="text"
//                 placeholder="Search..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="form-input px-3 py-2 placeholder-gray-400 text-gray-700 relative bg-white rounded-lg text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pr-10" />
//             <span
//                 className="z-10 h-full leading-snug font-normal  text-center text-gray-400 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 -mt-1" fill="none"
//                     viewBox="0 0 24 24" stroke="currentColor">
//                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
//                         d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//             </span>
//             {/* <button onClick={handleSearch} className="absolute right-0 top-0 mt-5 mr-4"> Search </button> */}
//         </div>
//     )
// }
function Navbar2() {

    return (
        <div className="flex items-center justify-between h-8 px-6 mx-auto">
            {/* <!-- Mobile hamburger --> */}
            <button className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple">
                {/* <x-heroicon-o-menu className="w-6 h-6 text-white" /> */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h7" />
                </svg>
            </button>
            {/* search bar */}
            <div className="flex justify-center mt-2 mr-4">
                {/* <SearchBar onSearch={(query) => console.log(query)} /> */}
            </div>

            <ul className="flex items-center flex-shrink-0 space-x-6">

                {/* <!-- Notifications menu --> */}
                <li className="relative">
                    <button
                        className="p-2 bg-white text-green-400 align-middle rounded-full hover:text-white hover:bg-green-400 focus:outline-none "
                        // @click="toggleNotificationsMenu" @keydown.escape="closeNotificationsMenu"
                        aria-label="Notifications" aria-haspopup="true">
                        <div className="flex items-cemter">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        {/* <!-- Notification badge --> */}
                        <span aria-hidden="true"
                            className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"></span>
                    </button>
                </li>

                {/* <!-- Profile menu --> */}
                <li className="relative">
                    <Link to="/registration">
                        <button
                            className="p-2 bg-white text-green-400 align-middle rounded-full hover:text-white hover:bg-green-400 focus:outline-none "
                            aria-haspopup="true">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </button>
                    </Link>
                </li>
            </ul>

        </div>

    );
}

export default Navbar2;