import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiUser from '../../api/user';

function UserProfile() {
    const { id } = useParams();
    const [userData, setUserData] = useState<{ name: string} | undefined>(undefined);

    // fetch user data based on userId
    useEffect(() => {
      console.log('userId', id);
        const fetchUser = async () => {
            const users = await apiUser.getUsers();
            setUserData(users.find((user: any) => user.id === id));
        };
        fetchUser();
    }, [id]);

    return (
        <div>
      {/* Display user data in the profile */}
      <h1>User Profile for {userData?.name}</h1>
      {/* Add conditional rendering for buttons */}
      {id !== 'yourUserId' && (
        <div>
          {/* Add Friend button */}
          <button>Add Friend</button>
          {/* Send Message button */}
          <button>Send Message</button>
        </div>
      )}
    </div>
    );
}

export default UserProfile;