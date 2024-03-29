import { useNavigate, useParams } from 'react-router-dom';
import '../styles/game.css';
import { useEffect, useState } from 'react';
import { GameZone } from '../components/game/GameZone';
import Navbar2 from '../components/NavBar2';
import apiUser from '../api/user';
import { io } from 'socket.io-client';
import { Direction, GameInfo, WsException } from '../utils/game/types';
import GameFinishedDialog from '../components/game/GameFinishedDialog';

function Game(): JSX.Element {
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
      if (user) setUserMe(user);
      else navigate('/login');
    };
    getUser();
  }, []);

  useEffect(() => {
    function handleConnection() {
      // console.log(socket.id);
    }
    // function handleDisconnect() {
    // }
    socket.connect();
    socket.on('connect', handleConnection);
    // socket.on('disconnect', handleDisconnect);
    return () => {
      socket.disconnect();
      socket.off('connect', handleConnection);
      // socket.off('disconnect', handleDisconnect);
    };
  }, []);

  useEffect(() => {
    function handleWaiting() {
      setIsWaiting(true);
      //Todo: display waiting for other player screen/dialog
    }
    function handleStart(uuid: string) {
      setIsWaiting(false);
      setIsStarted(true);
      //Todo: display game
    }
    function handleUpdateGame(gameInfo: GameInfo) {
      setGameInfos(gameInfo);
      //Todo: update canvas with new info
    }
    async function handleWinner(winnerId: number) {
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
  }

  return (
    <>
      {!params.uuid && !isWaiting && !isStarted && (
        <div className="flex flex-col w-screen h-screen">
          <div className="z-40 py-2 bg-gray-800">
            <Navbar2 />
          </div>
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
        <div className="flex flex-col w-screen h-screen">
          <div className="z-40 py-2 bg-gray-800">
            <Navbar2 />
          </div>
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-2xl py-36 text-black dark:text-white font-bold">
              Waiting for other player to join...
            </p>
          </div>
        </div>
      )}
      {isStarted && (
        <div className="flex flex-col w-screen h-screen items-center">
          <div className="z-40 py-2 bg-gray-800 w-full">
            <Navbar2 />
          </div>
          <p className="text-2xl text-black  dark:text-white font-bold items-center text-center">
            {gameInfos.players[0].name} _ vs _ {gameInfos.players[1].name}
          </p>
          <p className="text-2xl text-black dark:text-white font-bold items-center text-center">
            {gameInfos.players[0].score} - {gameInfos.players[1].score}
          </p>
          <GameZone sendInput={sendInput} gameInfos={gameInfos}></GameZone>
        </div>
      )}
      {params.uuid && isWaiting && (
        <div className="flex flex-col w-screen h-screen">
          <div className="z-40 py-2 bg-gray-800">
            <Navbar2 />
          </div>
          <p className="text-2xl text-black py-36 dark:text-white font-bold items-center text-center">
            Waiting for other player to join...
          </p>
        </div>
      )}
      {params.uuid && !isWaiting && !isStarted && (
        // Join game
        <div className="flex flex-col w-screen h-screen">
          <div className="z-40 py-2 bg-gray-800">
            <Navbar2 />
          </div>
          <button
            className="text-2xl text-black py-36 dark:text-white font-bold justify-center items-center"
            onClick={() => joinGame(params.uuid as string)}
          >
            Join game ?
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
