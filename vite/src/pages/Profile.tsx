import { client } from '../main';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getUser, handleLogout } from '../App';

function Profile() {
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
				<button className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2" onClick={handleLogout}>
					Logout
				</button>
				<a href='/'>Home</a>
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

export default Profile;
