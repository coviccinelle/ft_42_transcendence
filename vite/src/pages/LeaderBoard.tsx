import { Link } from 'react-router-dom';
import '../styles/LeaderBoard.css';

function LeaderBoard() {
  return (
    <div className="leaderboard">
      <div className="topbar">
        <Link to="/">Home</Link>
      </div>

      <h1>LeaderBoard</h1>
    </div>
  );
}

export default LeaderBoard;
