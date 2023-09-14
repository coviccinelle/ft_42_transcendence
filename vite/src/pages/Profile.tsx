import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Dashboard from '../components/profile/DashBoard';
import SideProfile from '../components/profile/SideProfile';
import apiUser from '../api/user';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

function Profile() {
  const [userMe, setUserMe] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  let id = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserMe = async () => {
      const res = await apiUser.getMe();
      if (res) {
        setUserMe(res);
        if (id.id !== undefined) {
          fetchUser();
        }
      } else {
        return navigate('/login');
      }
      if (id.id === undefined) {
        setUser(res);
      }
    };
    
    const fetchUser = async () => {
      const res = await apiUser.getUser(id.id as unknown as number);
      if (res && res.id) {
        setUser(res);
      } else {
        navigate('/404');
      }
    };

    const fetchData = async () => {
      fetchUserMe();
      if (!dataLoaded)
        setTimeout(() => {
          setDataLoaded(true);
        }, 500);
    };
    fetchData();
  }, [id.id, navigate, dataLoaded]);

  if (!dataLoaded) {
    return <LoadingScreen isLoading={true} />;
  }
  return (
    <>
      <div className="flex h-screen bg-gray-800 text-center no-scrollbar">
        <SideProfile user={user} userMe={userMe} />
        <div className="flex flex-col flex-1 w-full overflow-y-auto no-scrollbar">
          <div className="z-40 py-4 bg-gray-800">
            <Navbar />
          </div>

          {/* Main content */}
          {/* //a dashboard that shows the user's:
          score, rank, number of matches played, Winning rate, and match history */}
          <Dashboard user={user} />
        </div>
      </div>
    </>
  );
}

export default Profile;
