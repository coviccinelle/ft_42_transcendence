import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="flex flex-row h-12 w-full bg-gray-950 text-gray-200 justify-between">
      <div className="flex flex-row cursor-pointer">
        <Link to="/" className="flex px-4 py-3 text-sm items-center">
          <span role="img">🐱</span>
          <p className="text-xl font-bold py-2">Pong Game</p>
        </Link>
      </div>
        <div className="flex px-2 py-3 text-sm cursor-pointer">
          <Link to="/profile">
            <span role="img" aria-label="profile">
              👤
            </span>
          </Link>
        </div>
    </div>
  );
}

export default Navbar;
