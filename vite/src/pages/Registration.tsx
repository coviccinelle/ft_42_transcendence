import { useEffect, useState } from 'react';
import apiUser, { UpdateUserDto } from '../api/user';
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
          setNickname(user.nickname);
        }
      } else {
        navigate('/login');
      }
    };
    fetchUser();
  }, []);

  // Handle file input change
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    apiUser.uploadAvatar(file);
    setImage(imageUrl);
  };

  // Handle form submit
  const handleFormSubmit = (event: any) => {
    event.preventDefault();
    if (!nickname)
      return navigate('/');
    const formData: UpdateUserDto = {
      nickname: nickname,
    };
    apiUser.updateMe(formData);
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col relative px-3 py-3 items-center justify-center w-4/5 h-4/5 bg-slate-100 bg-opacity-10 rounded-lg shadow-lg">
        {/* //an exist X button to close the registration page and go back to the profile page */}
        <button
          className="absolute top-0 right-0 mt-4 mr-4 m-5 w-8 h-8 bg-yellow-300 bg-opacity-40 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white"
          onClick={() => navigate('/')}
        >
          X
        </button>

        <p className="flex flex-col pb-8 font-bold animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-5xl">
          Registration
        </p>
        <form className="grid grid-cols-3 gap-4 text-center items-center justify-center">
          <div className="cols-span-1 flex flex-col w-32 justify-center items-center px-1 py-1 relative">
            <img
              src={img}
              alt="Profile Image"
              className="w-32 h-32 rounded-full"
            />
            <label
              htmlFor="fileInput"
              className="bg-amber-100 p-2 bg-opacity-80 rounded-full absolute bottom-0 right-0 cursor-pointer"
            >
              📸
            </label>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="col-span-2 px-4 py-12 relative ">
            <p className="text-center text-white font-bold py-2">
              Your unique nickname*
            </p>
            <input
              type="nickname"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (e.target.value.length > 32) {
                  setNickname(e.target.value.substring(0, 32));
                }
              }}
              className="w-full px-4 py-2 border text-amber-300 font-black bg-black bg-opacity-30 rounded-lg"
            />
          </div>
          <div className="col-span-1"></div>
          <button
            className="col-span-1 bg-gray-300 hover:bg-amber-400 text-amber-600 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-3xl"
            type="submit"
            onClick={handleFormSubmit}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
