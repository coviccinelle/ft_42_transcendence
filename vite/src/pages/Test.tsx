import { client } from '../main';
import { useEffect, useState } from 'react';
import { getUser, handleLogout } from '../App';
import Navbar from '../components/Navbar';

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
            <Navbar darkMode={props.darkMode} toggleDarkMode={props.toggleDarkMode} />
            <body className="bg-gray-200" data-new-gr-c-s-check-loaded="14.1121.0" data-gr-ext-installed="">

                <div className="flex h-screen bg-gray-800"
                //  className={isSideMenuOpen ? 'overflow-hidden' : ''}
                >
                    <aside className="z-20 flex-shrink-0 hidden w-64 pl-2 overflow-y-auto bg-white dark:bg-pink-200 md:block">
                        <div>
                            <div className="text-white">
                                <div className="flex p-2 bg-red-300">
                                    <div className="flex py-3 px-2 items-center">
                                        <p className="text-2xl text-green-500 font-semibold">42</p>
                                        " Pooong"
                                        <p></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
                <div className="flex justify-center">
                    <div>
                        <img className="hidden h-24 w-24 rounded-full sm:block object-cover mr-2 border-4 border-green-400" src={img} alt="Your avatar" />
                        <p className="font-bold text-base text-gray-400 pt-2 text-center w-24"> {firstName} </p>
                    </div>
                </div>
                <div>
                    <ul className="mt-5 leading-10">
                        <li className="relative px-2 py-1">
                            <a className="inline-flex items-center w-full text-sm font-semibold text-white transition-colors duration-150 cursor-pointer hover:text-green-500  " href="#">
                            //icon home
                                <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2 2 2m6 7l-2-2-2 2m2-2v-6m2 18h6a2 2 0 002-2v-6m-2 8h-6a2 2 0 01-2-2v-6"></path>
                                </svg>
                                <span className="ml-4 text-green-400">Home</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="flex bottom-0 left-0 right-0 z-40 px-4 py-3 text-center text-white bg-gray-800">
                    " Hello Vit "
                </div>

            </body>
        </>
    );
}

export default Test;
