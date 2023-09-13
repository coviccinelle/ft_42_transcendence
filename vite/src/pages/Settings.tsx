import { useEffect, useState } from 'react';
import apiUser, { UpdateUserDto } from '../api/user';
import { useNavigate } from 'react-router-dom';
import Toggle2FA from '../components/profile/Toggle2FA';

function Settings() {
  const [img, setImage] = useState('');
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await apiUser.getMe();
      if (user) {
        if (!user.picture) {
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
    setImage(imageUrl);
  };

  // Handle form submit
  const handleFormSubmit = (event: any) => {
    event.preventDefault();
    const formData: UpdateUserDto = {
      nickname: nickname,
    };
    apiUser.updateMe(formData);
    navigate('/profile');
  };
  const handleFormAvatarSubmit = (event: any) => {
    event.preventDefault();
    apiUser.uploadAvatar(event.target[0].files[0]);
    // navigate('/profile');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden">
      <div className="flex flex-col relative px-3 py-3 items-center justify-center w-4/5 h-4/5 bg-slate-100 bg-opacity-10 rounded-lg shadow-lg">
        {/* //an exist X button to close the Settings page and go back to the profile page */}
        <button
          className="absolute top-0 right-0 mt-4 mr-4 m-5 w-8 h-8 bg-yellow-300 bg-opacity-40 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white"
          onClick={() => navigate('/profile')}
        >
          X
        </button>

        <p className="flex flex-col pb-4 font-bold animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-5xl">
          Settings
        </p>

        {/* //show the current nickname of the user */}
        <div className=" relative ">
          <p className="text-center text-3xl text-white font-bold py-2">
            {'#'}
            {nickname}
          </p>
        </div>
        <form
          className="items-center justify-center text-center"
          onSubmit={handleFormAvatarSubmit}
        >
          <div className="flex flex-col text-center items-center justify-center">
            <div className="flex flex-col w-32 justify-center items-center px-1 py-4 relative">
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
            <button
              className="bg-gray-300 hover:bg-amber-400 text-amber-600 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-3xl"
              type="submit"
            >
              Change avatar
            </button>
          </div>
        </form>

        <form className="items-center justify-center text-center">
          <div>
            <div className="col-span-2 px-4 py-8 relative ">
              <p className="text-center text-white font-bold py-2">
                Change your nickname
              </p>
              <input
                type="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-2 border text-amber-300 font-black bg-black bg-opacity-30 rounded-lg"
              />
            </div>

            <div className="flex items-center justify-center w-full py-3">
              <p className=" text-white font-bold mr-2">2FA</p>
              <Toggle2FA />
            </div>
          </div>

          <button
            className="bg-gray-300 hover:bg-amber-400 text-amber-600 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-3xl"
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

export default Settings;
