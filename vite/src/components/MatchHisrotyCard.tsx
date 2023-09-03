
// a card that shows the match history of a player which takes in the player's name, score, and avatar
function MatchHistoryCard( {nickname, score, avatar} : {nickname: string, score: string, avatar: string} ) {

    return (
        <div className="w-24 h-52 flex-col justify-center items-center gap-4 inline-flex hover:bg-gray-400 hover:bg-opacity-10 rounded-lg shadow">
            <div className="w-24 h-40 p-2 bg-gray-400 bg-opacity-10 rounded-lg flex-col justify-center items-center gap-4 flex">
                <img className="w-16 h-16 rounded-3xl shadow" src={avatar} alt={`${nickname}'s Avatar`} />
                <div className="text-white text-base font-semibold leading-normal tracking-tight">{nickname}</div>
                <div className="text-white text-base font-semibold leading-normal tracking-tight">{score}</div>
            </div>
            <div className="w-8 h-8 shadow">✅</div>
            {/* <div className="w-8 h-8 shadow">❌</div> */}
        </div>
    );
}

export default MatchHistoryCard;