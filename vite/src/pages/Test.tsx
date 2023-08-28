import { client } from '../main';
import { useEffect, useState } from 'react';
import { getUser, handleLogout } from '../App';
import Navbar from '../components/Navbar';

function Test(props: { darkMode: boolean; toggleDarkMode: any }) {
  const [firstName, setFirstName] = useState(String);
  const [lastName, setLastName] = useState(String);
  const [img, setImg] = useState(String);

  useEffect(() => {
    getUser().then((data) => {
      setFirstName(data.firstName);
      setLastName(data.lastName);
      if (data.picture === null) {
        setImg('../assets/duckie_bg_rm/sticker1.png');
      } else {
        setImg(data.picture);
      }
    });
  }, []);

  return (
    <>
     <Navbar darkMode={props.darkMode} toggleDarkMode={props.toggleDarkMode} />
    
    </>
  );
}

export default Test;
