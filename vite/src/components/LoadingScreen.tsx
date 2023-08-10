import '../styles/loading.css';

function LoadingScreen({ isLoading }: {isLoading: boolean}): JSX.Element {
	return (
		<>
			<div className={`loading-screen ${isLoading ? '' : 'play'}`}>
				<div className="content">
					<div className="paddle left"></div>
					<div className="ball"></div>
					<div className="paddle right"></div>
				</div>
			</div>
		</>
	)
}

export default LoadingScreen;