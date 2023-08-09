import { Link, useNavigate } from 'react-router-dom';
import '../styles/pong.css';
import { getUser } from '../App';
import { useEffect, useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { UserEntity } from '../main';


function Pong(): JSX.Element {
  return (
    <div className="pong">
      <div className="topbar">
        <Link to="/">Home</Link>
      </div>

      <h1>Pong</h1>

      

    </div>
  );
}

function Game(): JSX.Element {
	const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserEntity | null>();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading)
    {
      getUser().then((res) => {
        setUser(res)
        console.log(user);
        setIsLoading(false);
      });
      if (user === null)
      // ? Pop-up login qui dit "you need to login to play..." ?
        navigate('/login');
    }
  }, [isLoading, user]);

  return (
    <>
      {isLoading ?
        <LoadingScreen />
      :
        <Pong />
      }
    </>
  )
}

export default Game;
