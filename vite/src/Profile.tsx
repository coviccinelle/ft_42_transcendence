import axios from "axios";
import { domainName } from './main';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

function Profile() {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [img, setImg] = useState();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    axios.get(`http://${domainName}/api/auth/status`)
    .then((res) => {
      setImg(res.data.user.picture);
      setFirstName(res.data.user.firstName);
      setLastName(res.data.user.lastName);
    })
    .catch((e) => {
      console.log(e);
      navigate("/");
    })
  };

  const handleLogout = () => {
    location.href = `http://${domainName}/api/auth/logout`;
  }

  useEffect(() => {
    fetchProfile();
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
