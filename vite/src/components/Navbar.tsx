function Navbar(props: { darkMode: boolean; toggleDarkMode: any }) {
  return (
    <div className="flex flex-row h-12 w-full bg-gray-950 text-gray-200 justify-between">
      <div
        className="flex flex-row cursor-pointer"
        onClick={() => {
          window.location.href = '/';
        }}
      >
        <div className="flex px-4 py-3 text-sm">
          <span role="img">🐱</span>
        </div>
        <p className="text-xl font-bold py-2">Pong Game</p>
      </div>
      <div className="flex flex-row">
        <div className="flex px-2 py-3 text-sm">
          <span role="img" aria-label="notification" className="cursor-pointer">
            🔔
          </span>
        </div>
        <div className="flex px-2 py-3 text-sm" onClick={props.toggleDarkMode}>
          <span role="img" aria-label="dark" className="cursor-pointer">
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
        <div className="flex px-2 py-3 text-sm">
          <span
            role="img"
            aria-label="avatar"
            className="cursor-pointer"
            onClick={() => {
              window.location.href = '/profile';
            }}
          >
            👤
          </span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
