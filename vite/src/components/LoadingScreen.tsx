import '../styles/loading.css';

function LoadingScreen(): JSX.Element {
	return (
		<div className="loading-screen">
			<div className="paddle left"></div>
			<div className="ball"></div>
			<div className="paddle right"></div>
		</div>
	)
}

export default LoadingScreen;
