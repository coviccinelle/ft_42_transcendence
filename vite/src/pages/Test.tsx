import { client } from '../main';
import { useEffect, useState } from 'react';
import { getUser, handleLogout } from '../App';
import Navbar from '../components/Navbar';
import Navbar2 from '../components/NavBar2';


function Test(props: { darkMode: boolean; toggleDarkMode: any }) {
    const [firstName, setFirstName] = useState(String);
    const [lastName, setLastName] = useState(String);
    const [img, setImg] = useState(String);

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
    }, []);

    return (
        <>
            
            <body className="bg-gray-200" data-new-gr-c-s-check-loaded="14.1121.0" data-gr-ext-installed>
                {/* <div className="flex bottom-0 left-0 right-0 z-40 px-4 py-3 text-center text-white bg-gray-800">
                    " Hello Vit "
                </div> */}
                <div className="flex h-screen bg-gray-800"
                //  className={isSideMenuOpen ? 'overflow-hidden' : ''}
                >
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
                                <img className="hidden h-24 w-24 rounded-full sm:block object-cover mr-2 border-4 border-green-200" src={img} alt="Your avatar" />
                                <p className="font-bold text-base text-gray-400 pt-2 text-center w-24"> {firstName} </p>
                            </div>
                        </div>
                        <div>
                            <ul className="mt-5 leading-10">
                                <li className="relative px-2 py-1">
                                    <a className="inline-flex items-center w-full text-sm font-semibold text-white transition-colors duration-150 cursor-pointer hover:text-green-500"
                                        href=" #">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <span className="ml-4">DASHBOARD</span>
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
                                        <span className="ml-4">ITEM</span>
                                    </span>
                                </div>
                                </li>
                            </ul>
                            </div>


                    </aside>

                    <div className="flex flex-col flex-1 w-full overflow-y-auto">
                        <Navbar2 />
                        {/* <Navbar darkMode={props.darkMode} toggleDarkMode={props.toggleDarkMode} /> */}
                    </div>
                </div>
            </body >
        </>
    );
}

export default Test;
