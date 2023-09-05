import { useEffect, useState } from 'react';
import Navbar2 from '../components/NavBar2';
import Dashboard from '../components/DashBoard';
import SideProfile from '../components/SideProfile';
import apiUser from '../api/user';
import { useNavigate } from 'react-router-dom';

function Profile(props: { darkMode: boolean; toggleDarkMode: any }) {
  const [firstName, setFirstName] = useState(String);
  const [lastName, setLastName] = useState(String);
  const [img, setImg] = useState(String);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await apiUser.getMe();
      if (user) {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        if (user.picture === null) {
          setImg('../assets/duckie_bg_rm/sticker1.png');
        } else {
          setImg(user.picture);
        }
      } else {
        navigate('/login');
      }
    };
    fetchUser();
  }, []);

  //if the user is not logged in, redirect to login page

  return (
    <>
      <div className="flex h-screen bg-gray-800 text-center no-scrollbar">
        <SideProfile/>
        <div className="flex flex-col flex-1 w-full overflow-y-auto no-scrollbar">
          <div className="z-40 py-4 bg-gray-800">
            <Navbar2 />
          </div>

          {/* Main content */}
          {/* //a dashboard that shows the user's:
          score, rank, number of matches played, Winning rate, and match history */}
          <Dashboard />
        </div>
      </div>
    </>
  );
}

export default Profile;
