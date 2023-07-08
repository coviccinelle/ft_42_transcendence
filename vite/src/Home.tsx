import { Link } from "react-router-dom";
import './App.css'

function Home() {
  return (
    <div>
      <h1>Pooong?</h1> <br></br>
      <ul>
        <li style={{ "--i": 2}}><a href="#">Don't click me</a></li>
        <li style={{ "--i": 1}} ><a href="#">Nope, still not</a></li>
        <li style={{ "--i": 0}}><Link to="/login">Login</Link></li>
      </ul>
    </div>
  );
}

export default Home;