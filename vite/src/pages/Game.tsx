import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/game.css';
import { useEffect, useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { GameZone } from '../components/game/GameZone';
import Navbar2 from '../components/NavBar2';
import apiUser from '../api/user';
import { io } from 'socket.io-client';
import { Direction, GameInfo, WsException } from '../utils/game/types';
import GameFinishedDialog from '../components/game/GameFinishedDialog';
import Navbar from '../components/Navbar';

function Game(): JSX.Element {
  const [score, setScore] = useState<number[]>([0, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(io('/game', { autoConnect: false }));
  const navigate = useNavigate();
  const [isWaiting, setIsWaiting] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [gameFinishedDialog, setGameFinishedDialog] = useState<boolean>(false);
  const [win, setWin] = useState<boolean>(false);
  const [userMe, setUserMe] = useState<any>(null);
  const [gameInfos, setGameInfos] = useState<GameInfo>({
    id: '',
    status: 0,
    courtSize: {
      x: 0,
      y: 0,
    },
    ball: {
      position: {
        x: 0,
        y: 0,
      },
      velocity: {
        x: 0,
        y: 0,
      },
      size: 0,
    },
    players: [
      {
        id: 0,
        paddle: {
          position: 0,
          size: 0,
          movement: 0,
        },
        name: '',
        score: 0,
      },
      {
        id: 0,
        paddle: {
          position: 0,
          size: 0,
          movement: 0,
        },
        name: '',
        score: 0,
      },
    ],
  });

  let params = useParams();

  useEffect(() => {
    const getUser = async () => {
      const user = await apiUser.getMe();
      setUserMe(user);
      setIsLoading(false);
    };
    getUser();
  }, []);

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
      setGameInfos(gameInfo);
      //Todo: update canvas with new info
    }
    async function handleWinner(winnerId: number) {
      console.log(`Winner: ${winnerId}`);
      const res = await apiUser.getMe();
      if (res.id === winnerId) {
        setWin(true);
      } else {
        setWin(false);
      }
      setGameFinishedDialog(true);
      //Todo: Display loss or win
    }
    function handleException(error: WsException) {
      console.log(`Websocket exception: ${error.message}`);
      //Tried joining a full game
      //Todo: redirect to homepage
      navigate('/');
    }
    socket.on('wait', handleWaiting);
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
    return (
      <>
        <div className="flex flex-col w-screen h-screen items-center">Test</div>
      </>
    );
  }

  console.log(params);
  return (
    <>
      {!params.uuid && !isWaiting && !isStarted && (
        <div className="flex flex-col w-screen h-screen items-center">
          <Navbar2 />
          <div className="flex flex-col items-center justify-center h-full">
            <button
              className="mb-4 text-2xl dark:text-white text-black font-bold hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => startGame(false)}
            >
              Start game simple
            </button>
            <button
              className="text-2xl text-red-500 font-bold hover:text-red-700"
              onClick={() => startGame(true)}
            >
              Start game hard
            </button>
          </div>
        </div>
      )}
      {!params.uuid && isWaiting && (
        <div className="flex flex-col w-screen h-screen items-center">
          <Navbar2 />
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-2xl text-black dark:text-white font-bold">
              Waiting for other player to join...
            </p>
          </div>
        </div>
      )}
      {isStarted && (
        <div className="flex flex-col w-screen h-screen items-center">
          <Navbar2 />
          <p className="text-2xl text-black dark:text-white font-bold">
            {gameInfos.players[0].name} vs {gameInfos.players[1].name}
          </p>
          <p className="text-2xl text-black dark:text-white font-bold">
            {gameInfos.players[0].score} - {gameInfos.players[1].score}
          </p>
          <GameZone sendInput={sendInput} gameInfos={gameInfos}></GameZone>
        </div>
      )}
      {params.uuid && (
        <div className="flex flex-col w-screen h-screen items-center">
          <Navbar2 />
          <button onClick={() => joinGame(params.uuid as string)}>
            Join game
          </button>
        </div>
      )}
      <GameFinishedDialog
        gameFinishedDialog={gameFinishedDialog}
        setGameFinishedDialog={setGameFinishedDialog}
        score={win ? 'WIN' : 'LOSE'}
      />
    </>
  );
}

export default Game;
