import { useEffect, useState } from 'react';
import { getUser, handleLogout } from '../App';
import Navbar2 from '../components/NavBar2';

function Profile(props: { darkMode: boolean; toggleDarkMode: any }) {
    const [firstName, setFirstName] = useState(String);
    const [lastName, setLastName] = useState(String);
    const [img, setImg] = useState(String);

    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);


    useEffect(() => {
        getUser().then((data) => {
            setFirstName(data.firstName);
            setLastName(data.lastName);
            if (data.picture === null) {
                setImg('../assets/duckie_bg_rm/sticker1.png');
            } else {
                setImg(data.picture);
            }
        });

        //check if the user is online
        const handleOnline = () => {
            setIsOnline(true);
        }

        const handleOffline = () => {
            setIsOnline(false);
        }

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        }


    }, []);

     //if the user is not logged in, redirect to login page


    return (
        <>
            <body className="bg-gray-200" data-new-gr-c-s-check-loaded="14.1121.0" data-gr-ext-installed>
                {/* //all screen */}
                <div className="flex h-screen bg-gray-800"> 
                {/* //left side bar */}
                    <aside className="z-20 flex-shrink-0 hidden w-64 pl-2 overflow-y-auto bg-white dark:bg-gray-800 md:block">
                        <div>
                            <div className="text-white">
                                <div className="flex p-2 bg-gray-800">
                                    <div className="flex py-3 px-2 items-center">
                                        <p className="text-2xl text-yellow-500 font-semibold">42</p>
                                         Pooong
                                        <p></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div>
                              <div className="flex justify-center relative">
                                <img className="hidden h-24 w-24 rounded-full sm:block object-cover mr-2 border-4 border-yellow-300" src={img} alt="Your avatar"/>
                                {isOnline ? (
                                  <span className="absolute top-0 right-0 flex w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                ) : (
                                  <span className="absolute top-0 right-0 flex w-3.5 h-3.5 bg-gray-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                )}
                                </div>
                              <p className="font-bold text-base text-gray-400 pt-2 text-center w-24"> {firstName} </p>
                            </div>
                        </div>
                        <div>
                        <div className="w-full px-4 lg:order-3 lg:self-center">
                    <div className="py-6 px-3">
                      <button className="bg-yellow-100 active:bg-green-300 uppercase text-black font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded-2xl hover:text-blue-400 hover:animate-pulse sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
                        Add Friend
                      </button>
                    </div>
                  </div>
                            <ul className="mt-5 leading-10">
                                <li className="relative px-2 py-1">
                                    <a className="inline-flex items-center w-full text-sm font-semibold text-white transition-colors duration-150 cursor-pointer hover:text-green-500"
                                        href=" #">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <a className="ml-4" href="/">Home</a>
                                    </a>
                                </li>
                                <li className="relative px-2 py-1" x-data="{ Open : false  }">
                                <div className="inline-flex items-center justify-between w-full text-base font-semibold transition-colors duration-150 text-gray-500  hover:text-yellow-400 cursor-pointer"
                                    x-on:click="Open = !Open">
                                    <span
                                        className="inline-flex items-center  text-sm font-semibold text-white hover:text-green-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                                        </svg>
                                        <span className="ml-4">Send Message</span>
                                    </span>
                                </div>
                                </li>
                            </ul>
                            </div>


                    </aside> 
  
                    {/* //right side/ main side */}
                    <div className="flex flex-col flex-1 w-full overflow-y-auto">
                        <div className="z-40 py-4 bg-gray-800">
                            <Navbar2 />
                        </div>

                        {/* Main content */}
                        <main className="">
                <div className="grid mb-4 pb-10 px-8 mx-4 rounded-3xl bg-gray-200 border-8 border-yellow-300">

                    <div className="grid grid-cols-12 gap-6">
                        <div className="grid grid-cols-12 col-span-12 gap-6 xxl:col-span-9">
                            <div className="col-span-12 mt-8">
                                <div className="flex items-center h-10 intro-y">
                                    <h2 className="mr-5 text-lg text-gray-700 font-bold leading-8 truncate">Dashboard</h2>
                                </div>
                                <div className="grid grid-cols-12 gap-6 mt-5">
                                    <a className="transform bg-gray-100 hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y"
                                        href="#">
                                        <div className="p-5">
                                            <div className="flex justify-between">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400"
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                                <div
                                                    className="bg-green-500 rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                                                    <span className="flex items-center">30%</span>
                                                </div>
                                            </div>
                                            <div className="ml-2 w-full flex-1">
                                                <div>
                                                    <div className="mt-3 text-3xl text-black font-bold leading-8">4.510</div>

                                                    <div className="mt-1 text-base text-gray-600">Score</div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                    <a className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-gray-100"
                                        href="#">
                                        <div className="p-5">
                                            <div className="flex justify-between">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-400"
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                                <div
                                                    className="bg-red-500 rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                                                    <span className="flex items-center">30%</span>
                                                </div>
                                            </div>
                                            <div className="ml-2 w-full flex-1">
                                                <div>
                                                    <div className="mt-3 text-3xl text-black font-bold leading-8">4.510</div>

                                                    <div className="mt-1 text-base text-gray-600">Rank</div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                    <a className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-gray-100"
                                        href="#">
                                        <div className="p-5">
                                            <div className="flex justify-between">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-pink-600"
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                                </svg>
                                                <div
                                                    className="bg-yellow-500 rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                                                    <span className="flex items-center">30%</span>
                                                </div>
                                            </div>
                                            <div className="ml-2 w-full flex-1">
                                                <div>
                                                    <div className="mt-3 text-3xl text-black font-bold leading-8">4.510</div>

                                                    <div className="mt-1 text-base text-gray-600">Matches played</div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                    <a className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-gray-100"
                                        href="#">
                                        <div className="p-5">
                                            <div className="flex justify-between">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-400"
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                                </svg>
                                                <div
                                                    className="bg-blue-500 rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                                                    <span className="flex items-center">30%</span>
                                                </div>
                                            </div>
                                            <div className="ml-2 w-full flex-1">
                                                <div>
                                                    <div className="mt-3 text-3xl text-black font-bold leading-8">4.510</div>

                                                    <div className="mt-1 text-base text-gray-600">Winning Ratio</div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className="col-span-12 mt-5">
                                <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
                                    <div className="bg-gray-200 text-black shadow-lg p-4" id="chartline"> Match history here</div>
                                    <div className="bg-gray-200 text-black shadow-lg p-4" id="chartpie"> Top 5 best player here</div>
                                </div>
                            </div>
                            <div className="col-span-12 mt-5">
                                <div className="grid gap-2 grid-cols-1 lg:grid-cols-1">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
                    </div>
                </div>

            </body >
        </>
    );
}

export default Profile;
