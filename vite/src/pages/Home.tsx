import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiUser from '../api/user';
import '../styles/App.css';
import LoadingScreen from '../components/LoadingScreen';
import { UserEntity } from '../main';

interface ScreenSize {
  width: number;
  height: number;
  radius: number;
}

interface StickerProps {
  id: number;
  angle: number;
  screenSize: ScreenSize;
}

function LoginTile({ user }: { user: any }): JSX.Element {
  const loginTileId = { '--i': 0 } as React.CSSProperties;
  if (user === null || user === undefined)
    return (
      <li className="login" style={loginTileId}>
        <Link to="/login">Login</Link>
      </li>
    );
  return (
    <li className="logout" style={loginTileId}>
      <a href="/api/auth/logout">Logout</a>
    </li>
  );
}

function Sticker(props: StickerProps): JSX.Element {
  if (props.screenSize.width <= 768) return <></>;
  const xPos =
    props.screenSize.width / 2 +
    props.screenSize.radius * Math.cos(props.angle) -
    100 / 2;
  const yPos =
    props.screenSize.height / 2 +
    props.screenSize.radius * Math.sin(props.angle) -
    100 / 2;

  return (
    <img
      id="sticker"
      className="unselectable absolute w-10 h-10 lg:w-24 lg:h-24 object-cover transform transition-transform hover:scale-150"
      style={{ left: xPos, top: yPos }}
      src={`./src/assets/duckie_bg_rm/sticker${props.id}.png`}
    />
  );
}

function Carrousel(): JSX.Element {
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const lenStickers = 35;
  const initAngle = (2 * Math.PI) / lenStickers;
  const stickers = [];

  let currentAngle = initAngle;
  for (let i = 0; i < lenStickers; i++) {
    currentAngle = i * initAngle;
    stickers.push(
      <Sticker
        key={i}
        id={i + 1}
        angle={currentAngle}
        screenSize={screenSize}
      />,
    );
  }
  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      radius: Math.min(window.innerWidth - 100, window.innerHeight - 100) / 2,
    };
  }

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener('resize', updateDimension);

    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, [screenSize]);

  return <div className="unselectable">{stickers}</div>;
}

function SelectMenu({ user }: { user: any }): JSX.Element {
  return (
    <ul id="home-menu">
      {(!user && (
        <li style={{ '--i': 3 } as React.CSSProperties}>
          {' '}
          <Link to="/login">Game</Link>
        </li>
      )) || (
        <li style={{ '--i': 3 } as React.CSSProperties}>
          {' '}
          <Link to="/game">Game</Link>
        </li>
      )}
      {(!user && (
        <li style={{ '--i': 2 } as React.CSSProperties}>
          {' '}
          <Link to="/login">Chat</Link>
        </li>
      )) || (
        <li style={{ '--i': 2 } as React.CSSProperties}>
          {' '}
          <Link to="/chat">Chat</Link>
        </li>
      )}
      {(!user && (
        <li style={{ '--i': 1 } as React.CSSProperties}>
          {' '}
          <Link to="/login">Profile</Link>
        </li>
      )) || (
        <li style={{ '--i': 1 } as React.CSSProperties}>
          {' '}
          <Link to="/profile">Profile</Link>
        </li>
      )}
      {/* <li style={{ '--i': 1 } as React.CSSProperties}> <a href="/leaderboard">Leaderboard</a></li> */}
      <LoginTile user={user} />
    </ul>
  );
}

function Home(props: { darkMode: boolean; toggleDarkMode: any }): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserEntity | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await apiUser.getMe();
      if (res) {
        setUser(res);
      }
      if (isLoading) {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    fetchUser();
  }, [isLoading]);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div
        id="center"
        className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center"
      >
        <h1 className="mb-16 pb-2 animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-5xl font-black">
          Pooong?
        </h1>
        <SelectMenu user={user} />
        <Carrousel />
      </div>
    </>
  );
}

export default Home;
