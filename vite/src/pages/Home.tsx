import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { GihamburgerMenu } from 'react-icons/gi';
import SideMenu from './components/SideMenu';
import { getUser, logoutUser } from "../App";
import '../styles/App.css';
import LoadingScreen from "../components/LoadingScreen";
import { UserEntity } from "../main";

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

function LoginTile({ user }: {user: any}): JSX.Element {
	const loginTileId = { "--i": 0 } as React.CSSProperties;

	if (user === null)
		return (<li className="login" style={loginTileId}><Link to="/login">Login</Link></li>);
	return (<li className="logout" style={loginTileId}><a href="/api/auth/logout">Logout</a></li>);
}

function Sticker(props: StickerProps): JSX.Element {
	const xPos = props.screenSize.width / 2 + props.screenSize.radius * Math.cos(props.angle) - 100 / 2;
	const yPos = props.screenSize.height / 2 + props.screenSize.radius * Math.sin(props.angle) - 100 / 2;
	return (
		<img id="sticker" className="absolute w-10 h-10 lg:w-24 lg:h-24 object-cover transform transition-transform hover:scale-150" style={{left: xPos, top: yPos}} src={`./src/assets/duckie_bg_rm/sticker${props.id}.png`} />
	)
}

function Carrousel(): JSX.Element {
  	const [screenSize, setScreenSize] = useState(getCurrentDimension());
	const lenStickers = 35;
	const initAngle = (2 * Math.PI) / lenStickers;
	const stickers = [];

	let currentAngle = initAngle;
	for (let i = 0; i < lenStickers; i++) {
		currentAngle = i * initAngle;
		stickers.push(<Sticker key={i} id={i + 1} angle={currentAngle} screenSize={screenSize} />);
	}
  	function getCurrentDimension(){
    	return {
      		width: window.innerWidth,
      		height: window.innerHeight,
			radius: Math.min(window.innerWidth-100, window.innerHeight-100) / 2,
    	}
  	}
  
  	useEffect(() => {
    		const updateDimension = () => {
      			setScreenSize(getCurrentDimension())
    		}
    		window.addEventListener('resize', updateDimension);
    
		
    		return(() => {
        		window.removeEventListener('resize', updateDimension);
    		})
  	}, [screenSize])

  	return (
    	<div>
			{stickers} 
    	</div>
  	)
}

function SelectMenu({user}: {user: any}): JSX.Element {
	return (
		<ul id="home-menu">
			<li style={{ "--i": 2} as React.CSSProperties}><a href="/game">Game</a></li>
			<li style={{ "--i": 1} as React.CSSProperties} ><a href="/chat">Chat</a></li>
			<LoginTile user={user}/>
		</ul>
	)
}

function Menu({user}: {user: any}): JSX.Element {
	return (
		<>
			{/* replace by image logo */}
			<h1>Pooong?</h1> <br></br> <br></br> <br></br>

			<SelectMenu user={user}/>
			<Carrousel />
		</>
	)
}

function Home(): JSX.Element {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<UserEntity | null>();

  // const [hideSideMenu, setHideSideMenu] = useState(true);
  // const handleClick = () => {
  //   setHideSideMenu(!hideSideMenu);
  // };

	useEffect(() => {
		if (isLoading)
		{
			setTimeout(() => {
				getUser().then((res) => {
					setUser(res);
					console.log(user);
					setTimeout(() => {
						setIsLoading(false);
					}, 1000);
				});
			}, 2000);
		}
	})

	return (
    <>
			{/* <div className={`app ${isLoading ? 'loading' : ''}`}> */}
				<div className={`curtain ${isLoading ? 'revealed' : ''}`}></div>
				{isLoading ?
					<LoadingScreen />
				:
					<Menu user={user} />
}
					{/* </div> */}
    </>
	);
}

export default Home;
