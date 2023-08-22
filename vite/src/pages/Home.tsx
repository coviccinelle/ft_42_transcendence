import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUser, logoutUser } from '../App';
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

function LoginTile(): JSX.Element {
  const [user, setUser] = useState<UserEntity>();
  const tileId = { '--i': 0 } as React.CSSProperties;

  useEffect(() => {
    getUser().then((res) => setUser(res));
  }, []);
  console.log(user);
  if (user != null)
    return (
      <li className="logout" style={tileId}>
        <a href="/api/auth/logout">Logout</a>
      </li>
    );
  return (
    <li className="login" style={tileId}>
      <Link to="/login">Login</Link>
    </li>
  );
}

function Sticker(props: StickerProps): JSX.Element {
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
      className="absolute w-10 h-10 lg:w-24 lg:h-24 object-cover transform transition-transform hover:scale-150"
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

  return <div>{stickers}</div>;
}

function Home(props: { darkMode: boolean; toggleDarkMode: any }): JSX.Element {
  return (
    <>
      <div className="inline-flex px-4 py-2 justify-end">
        <div
          className="bg-gray-950 text-gray-200 rounded-full p-2 cursor-pointer"
          style={{ zIndex: 1000 }}
          onClick={props.toggleDarkMode}
        >
          <span role="img" aria-label="dark">
            {props.darkMode ? '🌻' : '🌙'}
          </span>
          <label htmlFor="darkModeToggle" />
          <input
            type="checkbox"
            id="darkModeToggle"
            className="hidden"
            onChange={props.toggleDarkMode}
          />
        </div>
      </div>
      <div
        id="center"
        className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center"
      >
        <h1 className="mb-16 pb-2 animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-5xl font-black">
          Pooong?
        </h1>
        <ul id="home-menu">
          <li style={{ '--i': 4 } as React.CSSProperties}>
            <a href="/profile">Profile</a>
          </li>
          <li style={{ '--i': 3 } as React.CSSProperties}>
            <a href="/game">Game</a>
          </li>
          <li style={{ '--i': 2 } as React.CSSProperties}>
            <a href="/chat">Chat</a>
          </li>
          <li style={{ '--i': 1 } as React.CSSProperties}>
            <a href="/leaderboard">Leaderboard</a>
          </li>
          {/* If user not logged redirect to login page */}
          <LoginTile />
          {/* If user logged redirect to logout */}
        </ul>
        <Carrousel />
      </div>
    </>
  );
}

export default Home;
