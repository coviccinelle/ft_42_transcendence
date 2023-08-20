import { client } from '../main';
import { useEffect, useState } from 'react';
import { getUser, handleLogout } from '../App';

function Profile() {
	const [firstName, setFirstName] = useState(String);
	const [lastName, setLastName] = useState(String);
	const [img, setImg] = useState(String);

	useEffect(() => {
		getUser().then((data) => {
			setFirstName(data.firstName);
			setLastName(data.lastName);
			if (data.picture === null) {
				setImg('../assets/duckie_bg_rm/sticker1.png');
			}
			else {
				setImg(data.picture);
			}
		});
	}, []);

	return (
		<>
			<div className="py-5 flex justify-center items-center">
				<button className="bg-blue-500 hover:bg-blue-300 text-white px-3 py-1 rounded-md mr-2 hover:text-gray-700 focus:relative" onClick={handleLogout}>
					Logout
				</button>
				<button className="bg-blue-500 hover:bg-blue-300 text-white px-3 py-1 rounded-md mr-2 hover:text-gray-700 focus:relative">
					<a href='/'>Home</a>
				</button>
			</div>

			<div className="w-screen items-center justify-center bg-white_flower dark:bg-night_sky">
				<div className="py-3  items-center justify-center">
					<p className="text-lg px-2 items-center justify-center text-black dark:text-white font-semibold">{firstName} {lastName}</p>
				{/* </div>
				<div className="py-2 ml-28 items-center justify-center"> */}
					<img className="py-2 ml-28 w-48 h-48 rounded-full mt-1" src={img} alt="Profile Avatar" />
				</div>
			</div>
		</>
	);
}

export default Profile;
