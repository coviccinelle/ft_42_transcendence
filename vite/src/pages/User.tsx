import { client } from '../main';
import { useEffect, useState } from 'react';
import { getUser, handleLogout } from '../App';

function User() {
	const [firstName, setFirstName] = useState(String);
	const [lastName, setLastName] = useState(String);
	const [img, setImg] = useState(String);

	useEffect(() => {
		getUser().then((data) => {
			setFirstName(data.firstName);
			setLastName(data.lastName);
			setImg(data.picture);
		});
	}, []);

	return (
        <>
            <div className="py-5 flex justify-center items-center">
                <button className="bg-blue-500 hover:bg-blue-300 text-white px-3 py-1 rounded-md mr-2 hover:text-gray-700 focus:relative" onClick={handleLogout}>
                    Logout
                </button>
                <button className="bg-blue-500 hover:bg-blue-300 text-white px-3 py-1 rounded-md mr-2 hover:text-gray-700 focus:relative" onClick={() => client.service('users').patch(1, { firstName: 'test' })}>
                <a href='/'>Home</a>
                </button>
            </div>
            <div className="py-3 flex flex-col items-center justify-center">
                <p className="text-lg font-semibold">{firstName} {lastName}</p>
            </div>
            <div className="py-2 flex flex-col items-center justify-center">
                <img className="w-48 h-48 rounded-full mt-1" src={img} alt="Profile" />
            </div>
        </>
    );
}

export default User;
