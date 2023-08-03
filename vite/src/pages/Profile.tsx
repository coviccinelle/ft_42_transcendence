import { client } from '../main';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getUser, handleLogout } from '../App';

function Profile() {
  const [firstName, setFirstName] = useState(String);
  const [lastName, setLastName] = useState(String);
  const [img, setImg] = useState(String);

  useEffect(() => {
    getUser().then((data) => {
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setImg(data.picture);
    });
  }, []);

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <p>{firstName} {lastName}</p>
      <img src={img}></img>
    </div>
  );
}

export default Profile;
