import { useEffect, useState } from "react";
import apiUser from "../api/user";
import { useNavigate } from 'react-router-dom';

function Registration() {
    const [img, setImage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const user = await apiUser.getMe();
            if (user) {
                if (user.image === null) {
                    setImage('../assets/duckie_bg_rm/sticker1.png');
                } else {
                    setImage(user.picture);
                }
            } else {
                navigate('/login');
            }
        };
        fetchUser();

    }, []);

    // Handle file input change
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-amber-100 bg-opacity-30">
            <div className="flex flex-col items-center justify-center w-2/3 h-2/3 bg-transparent rounded-lg shadow-lg">
                <p className="flex flex-col py-4 text-3xl text-orange-300 font-bold">Registration</p>

                <div className="grid grid-cols-2 gap-4 text-center justify-center">
                    <div className="flex flex-col justify-center items-center col-span-1 px-4 py-4 relative">
                        <img src={img} alt="Profile Image" className="w-32 h-32 rounded-full" />
                        <label htmlFor="fileInput" className="bg-blue-500 text-white p-2 rounded-full absolute bottom-0 right-0 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                        </label>
                        <input id="fileInput" type="file" className="hidden" onChange={handleFileChange} />
                    </div>
                    <div className="col-span-1 px-4 relative border">
                        Text text
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Registration;
