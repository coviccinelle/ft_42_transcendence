import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiUser from '../../api/user';

// a card that shows the match history of a player which takes in the player's name, score, and avatar
function MatchHistoryCard({
  nickname,
  myScore,
  otherScore,
  otherPlayerId,
}: {
  nickname: string;
  myScore: number;
  otherScore: number;
  otherPlayerId: number;
}) {
  const [avatar, setAvatar] = useState<string>('');
  const navigate = useNavigate();
  const won = myScore > otherScore;
  useEffect(() => {
    const fetchUser = async () => {
      const res = await apiUser.getUser(otherPlayerId);
      if (res && res.picture) {
        setAvatar(res.picture);
      } else {
        setAvatar(
          'https://img-02.stickers.cloud/packs/1da1c0da-9330-4d89-9700-8d75b9c62635/webp/65bb0543-f220-456a-ad64-2ae40431ec03.webp',
        );
      }
    };
    fetchUser();
  }, [otherPlayerId]);
  return (
    <div className="w-24 h-52 p-4 flex-col justify-center items-center gap-4 inline-flex hover:bg-gray-400 hover:bg-opacity-10 rounded-lg shadow">
      <div className="w-full h-full flex flex-col justify-center items-center gap-4">
        <img
          className="w-16 h-16 rounded-full shadow cursor-pointer hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out"
          src={avatar}
          alt={`${nickname}'s Avatar`}
          onClick={() => {
            return navigate(`/profile/${otherPlayerId}`);
          }}
        />
        <div className="text-white text-base font-semibold leading-normal tracking-tight w-24 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {nickname}
        </div>
        <div className="text-white text-base font-semibold leading-normal tracking-tight">
          {myScore} : {otherScore}
        </div>
      </div>
      {won ? (
        <div className="w-8 h-8 shadow">✅</div>
      ) : (
        <div className="w-8 h-8 shadow">❌</div>
      )}
    </div>
  );
}

export default MatchHistoryCard;
