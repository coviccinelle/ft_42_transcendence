import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

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

function Sticker(props: StickerProps): JSX.Element {
	const xPos = props.screenSize.width / 2 + props.screenSize.radius * Math.cos(props.angle) - 100 / 2;
	const yPos = props.screenSize.height / 2 + props.screenSize.radius * Math.sin(props.angle) - 100 / 2;
	return (
		<img className="absolute w-10 h-10 lg:w-24 lg:h-24" style={{left: xPos, top: yPos}} src={`./src/assets/duckie_bg_rm/sticker${props.id}.png`} />
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
			radius: Math.min(window.innerWidth, window.innerHeight) / 2,
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
      		<ul>
        		<li>Width: <strong>{screenSize.width}</strong></li>
        		<li>Height: <strong>{screenSize.height}</strong></li>
      		</ul>    
    	</div>
  	)
}

function Home() {


	return (
		<div>
		<h1>Pooong?</h1> <br></br>
		<ul id="home-menu">
			<li style={{ "--i": 2}}><a href="#">Don't click me</a></li>
			<li style={{ "--i": 1}} ><a href="#">Nope, still not</a></li>
			<li style={{ "--i": 0}}><Link to="/login">Login</Link></li>
		</ul>
		<Carrousel />


		</div>
	);
}

export default Home;
