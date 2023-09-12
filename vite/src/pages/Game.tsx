import { Link, useNavigate } from 'react-router-dom';
import '../styles/game.css';
import { useEffect, useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { GameZone } from '../components/game/GameZone';
import Navbar2 from '../components/NavBar2';
import apiUser from '../api/user';

function Game(): JSX.Element {
  const [score, setScore] = useState<number[]>([0, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      const fetchUser = async () => {
        try {
          const user = await apiUser.getMe();
          if (user) {
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
          } else {
            navigate('/login');
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération de l'utilisateur :",
            error,
          );
        }
      };
      fetchUser();
    }
  }, [isLoading]);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div className="flex flex-col w-screen h-screen items-center">
        <Navbar2 />
        <h1 className="flex text-center dark:text-white text-gray-900">
          {score[0]} - {score[1]}
        </h1>
        <GameZone score={score} setScore={setScore} />
      </div>
    </>
  );
}

export default Game;
