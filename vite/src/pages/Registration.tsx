import { useEffect, useState } from "react";
import apiUser from "../api/user";
import { useNavigate } from 'react-router-dom';

function Registration() {
    //set up a default image for the profile picture and then allow the user to upload their own
    //use the useState hook to set the default image
    const [img, setImage] = useState(String);
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



    return (
        //a half way transparent div that takes up the whole screen
        <div className="flex flex-col items-center justify-center h-screen bg-amber-100 bg-opacity-30">
            <div className="flex flex-col items-center justify-center w-2/3 h-2/3 bg-transparent rounded-lg shadow-lg">
                <p className="flex flex-col py-4 text-3xl text-orange-300 font-bold">Registration</p>

                {/* //upload profile picture */}
                <div className="grid grid-cols-2 gap-4 text-center justify-center">

                    <div className="flex flex-col justify-center items-center col-span-1 px-4 py-4 relative">
                        <img src={img} alt="Default Image" className="justify-center items-center w-32 h-32 rounded-full  " />
                        {/* <!-- Photo Upload Icon --> */}
                        <label for="fileInput" class="bg-blue-500 text-white p-2 rounded-full absolute bottom-0 right-0 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                        </label>

                        {/* <!-- Hidden File Input --> */}
                        <input id="fileInput" type="file" class="hidden"/>
                    </div>


                <div className="col-span-1 px-4 relative border">
                    Text text
                </div>
            </div>
        </div>
        </div >
    )
}

export default Registration;