import { Link } from 'react-router-dom';
import '../styles/pong.css';
import axios from 'axios';
import { domainName } from '../main';

function Game() {
  return (
    <></>
  )
}

function Pong() {
  function isLogged() {
    axios.get(`http://${domainName}/api/auth/status`)
    .then(() => {
      
    })
  }
  return (
    <div className="pong">
      <div className="topbar">
        <Link to="/">Home</Link>
      </div>

      <h1>Pong</h1>

      <Game />
    </div>
  );
}

export default Game;
