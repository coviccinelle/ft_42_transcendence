import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import apiUser from '../../api/user';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await apiUser.getUsers();
      setUsers(users);
    };
    fetchUsers();
  }, []);

  return (
    //list of users
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>
            <Link to={`/profile/${user.id}`}>{user.nickname}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
