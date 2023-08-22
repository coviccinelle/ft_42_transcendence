import { Link } from 'react-router-dom';
import '../styles/LeaderBoard.css';
import Navbar from '../components/Navbar';

function LeaderBoard(props: { darkMode: boolean; toggleDarkMode: any }) {
  return (
    <div>
      <Navbar darkMode={props.darkMode} toggleDarkMode={props.toggleDarkMode} />
      <div className="leaderboard">
        <div className="topbar">
          <Link to="/">Home</Link>
        </div>

        <h1>LeaderBoard</h1>
      </div>
    </div>
  );
}

export default LeaderBoard;
