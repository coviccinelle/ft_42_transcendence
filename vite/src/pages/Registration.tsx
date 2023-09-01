import { useEffect, useState } from "react";
import apiUser from "../api/user";
import { useNavigate } from 'react-router-dom';

function Registration() {
    const [img, setImage] = useState('');
    const [nickname, setNickname] = useState('');
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
            <div className="flex flex-col px-3 py-3 items-center justify-center w-4/5 h-4/5 bg-transparent rounded-lg shadow-lg">
                <p className="flex flex-col py-16 font-bold animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-5xl">Registration</p>

                <div className="grid grid-cols-3 gap-4 text-center justify-center">

                    <div className="cols-span-1 flex flex-col w-32 justify-center items-center px-1 py-1 relative">
                        <img src={img} alt="Profile Image" className="w-32 h-32 rounded-full" />
                        <label htmlFor="fileInput" className="bg-amber-100 p-2 bg-opacity-80 rounded-full absolute bottom-0 right-0 cursor-pointer">
                            📸
                        </label>
                        <input id="fileInput" type="file" className="hidden" onChange={handleFileChange} />
                    </div>


                    <div className="col-span-2 px-4 py-4 relative ">
                        <p className="text-center text-orange-200 font-bold py-2" >Your unique nickname*</p>
                        <input type="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Registration;
