import { Link } from 'react-router-dom';
import '../style/App.css';

function Home() {
  return (
    <div>
      <h1>Page d'accueil</h1>
      <Link to="/login">Se connecter</Link>
    </div>
  );
}

export default Home;
