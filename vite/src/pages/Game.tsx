import { Link, useNavigate } from 'react-router-dom';
import '../styles/game.css';
import { getUser } from '../App';
import { useEffect, useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { UserEntity } from '../main';
import { GameZone } from '../components/GameZone';


function Pong(): JSX.Element {
  return (
    <div className="pong">
      <div className="topbar">
        <Link className={"link-style"} to="/">Home</Link>
        <Link className={"link-style"} to="/profile">Profile</Link>
      </div>

      {/* change to score */}
      <h1>0 - 0</h1>
      {/* --------------- */}

      <GameZone />

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
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
    }
  }, [isLoading, user]);

  // ? Pop-up login qui dit "you need to login to play..." ?
  console.log(user);
  if (user === null)
    navigate('/login');

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <Pong />
    </>
  )
}

export default Game;
