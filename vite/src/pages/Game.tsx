import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/game.css';
import { useEffect, useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { GameZone } from '../components/game/GameZone';
import Navbar from '../components/Navbar';
import apiUser from '../api/user';
import { io } from 'socket.io-client';
import { Direction, GameInfo, WsException } from '../utils/game/types';

function Game(props: { darkMode: boolean; toggleDarkMode: any }): JSX.Element {
  const [score, setScore] = useState<number[]>([0, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(io('/game', { autoConnect: false }));
  const navigate = useNavigate();
  const [isWaiting, setIsWaiting] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  let id = useParams();

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

  useEffect(() => {
    function handleConnection() {
      console.log('Game socket connected');
    }
    function handleDisconnect() {
      console.log('Game socket disconnected');
    }
    socket.connect();
    socket.on('connect', handleConnection);
    socket.on('disconnect', handleDisconnect);
    return () => {
      socket.disconnect();
      socket.off('connect', handleConnection);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  useEffect(() => {
    function handleWaiting() {
      console.log(`Waiting for other player to join`);
      setIsWaiting(true);
      //Todo: display waiting for other player screen/dialog
    }
    function handleStart(uuid: string) {
      console.log(`Starting game ${uuid}`);
      setIsWaiting(false);
      setIsStarted(true);
      //Todo: display game
    }
    function handleUpdateGame(gameInfo: GameInfo) {
      console.log(`Received game update`);
      console.log(gameInfo);
      //Todo: update canvas with new info
    }
    function handleWinner(winnerId: number) {
      console.log(`Winner: ${winnerId}`);
      //Todo: Display loss or win
    }
    function handleException(error: WsException) {
      console.log(`Websocket exception: ${error.message}`);
      //Tried joining a full game
      //Todo: redirect to homepage
    }
    socket.on('waiting', handleWaiting);
    socket.on('start', handleStart);
    socket.on('game', handleUpdateGame);
    socket.on('winner', handleWinner);
    socket.on('exception', handleException);
    return () => {
      socket.off('wait', handleWaiting);
      socket.off('start', handleStart);
      socket.off('game', handleUpdateGame);
      socket.off('winner', handleWinner);
      socket.off('exception', handleException);
    };
  }, []);

  function startGame(isHard: boolean) {
    socket.emit('new', isHard);
  }

  function sendInput(direction: Direction) {
    socket.emit('input', direction);
  }

  function joinGame(uuid: string) {
    socket.emit('join', uuid);
  }

  return (
    <>
      {!isWaiting && !isStarted && (
        <div className="flex flex-col w-screen h-screen items-center">
          <Navbar
            darkMode={props.darkMode}
            toggleDarkMode={props.toggleDarkMode}
          />
          <button onClick={() => startGame(false)}>Start game simple</button>
          <button onClick={() => startGame(true)}>Start game hard</button>
        </div>
      )}
      {isWaiting && (
        <div className="flex flex-col w-screen h-screen items-center">
          <Navbar
            darkMode={props.darkMode}
            toggleDarkMode={props.toggleDarkMode}
          />
          <div className="flex flex-col items-center">
            <p>Waiting for other player to join</p>
          </div>
        </div>
      )}
      {isStarted && (
        <div className="flex flex-col w-screen h-screen items-center">
          <Navbar
            darkMode={props.darkMode}
            toggleDarkMode={props.toggleDarkMode}
          />
          <GameZone sendInput={sendInput} />
        </div>
      )}
    </>
  );
}

export default Game;
