import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiUser from '../../api/user';
import UserList from './UserList';


function UserProfile() {
// show user profile based on userId
    const { id } = useParams<{ id: string }>();
    const [userData, setUserData] = useState<{ name: string} | undefined>(undefined);

    // fetch user data based on userId
    useEffect(() => {
        console.log('userId', id);
        console.log('userData', userData);
        const fetchUser = async () => {
            const users = await apiUser.getUsers();
            setUserData(users.find((user: any) => user.id === id));
        };
        fetchUser();
    }
    , [id]);

    return (
        <div>
          <UserList />
            <h1>User Profile</h1>
            <p>{id}</p>
            <p>User name : [</p>
            <p>{userData?.name}]</p>
        </div>
    );



}

export default UserProfile;