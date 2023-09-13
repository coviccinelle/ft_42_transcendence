import MatchHistoryCard from './MatchHisrotyCard';
import apiUser from '../../api/user';
import { useEffect, useState } from 'react';

function Dashboard(props: { user: any }) {
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState(0);
  const [matchHistory, setMatchHistory] = useState([]);
  const [winningRatio, setWinningRatio] = useState(0);

  useEffect(() => {
    const fetchUserStats = async () => {
      const res = await apiUser.getStats(props.user.id);
      if (res) {
        setScore(res.elo);
        setRank(res.rank);
      }
    };

    const fetchUserMatchHistory = async () => {
      const res = await apiUser.getMatchHistory(props.user.id);
      if (res) {
        setMatchHistory(res);
      }
      // calculate winning ratio
      let wins = 0;
      let losses = 0;
      res.forEach((match: any) => {
        if (match.result === 'WIN') {
          wins++;
        } else {
          losses++;
        }
      });
      setWinningRatio(Math.round((wins / (wins + losses)) * 100));
    };

    fetchUserStats();
    fetchUserMatchHistory();
  }, [props.user.id]);

  return (
    <main className="">
      <div className="grid mb-4 pb-10 px-8 mx-4 rounded-3xl bg-gray-200 border-8 border-yellow-300">
        <div className="grid grid-cols-12 gap-6">
          <div className="grid grid-cols-12 col-span-12 gap-6 xxl:col-span-9">
            <div className="col-span-12 mt-8">
              <div className="flex items-center h-10 intro-y">
                <h2 className="mr-5 text-lg text-gray-700 font-bold leading-8 truncate">
                  Dashboard
                </h2>
              </div>
              <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="transform bg-gray-100 hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                  <div className="p-5">
                    <div className="flex justify-between">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <div className="ml-2 w-full flex-1">
                      <div>
                        <div className="mt-3 text-3xl text-black font-bold leading-8">
                          {score}
                        </div>

                        <div className="mt-1 text-base text-gray-600">
                          Score
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-gray-100">
                  <div className="p-5">
                    <div className="flex justify-between">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-yellow-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-2 w-full flex-1">
                      <div>
                        <div className="mt-3 text-3xl text-black font-bold leading-8">
                          {rank}
                        </div>

                        <div className="mt-1 text-base text-gray-600">Rank</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-gray-100">
                  <div className="p-5">
                    <div className="flex justify-between">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-pink-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                        />
                      </svg>
                    </div>
                    <div className="ml-2 w-full flex-1">
                      <div>
                        <div className="mt-3 text-3xl text-black font-bold leading-8">
                          {matchHistory.length}
                        </div>

                        <div className="mt-1 text-base text-gray-600">
                          Matches played
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {matchHistory.length > 0 && (
                  <div className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-gray-100">
                    <div className="p-5">
                      <div className="flex justify-between">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-7 text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                          />
                        </svg>
                        <div className="bg-blue-500 rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                          <span className="flex items-center">
                            {winningRatio}%
                          </span>
                        </div>
                      </div>
                      <div className="ml-2 w-full flex-1">
                        <div>
                          <div className="mt-3 text-3xl text-black font-bold leading-8">
                            {winningRatio < 20
                              ? 'Noob'
                              : winningRatio < 50
                              ? 'Average'
                              : winningRatio < 80
                              ? 'Pro'
                              : 'God'}
                          </div>
                          <div className="mt-1 text-base text-gray-600">
                            Winning Ratio
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-12 mt-5">
              <div className="lg:grid-cols-2 ">
                <div className="bg-slate-700 text-black shadow-lg p-4 px-8 rounded-3xl">
                  {' '}
                  <p className="py-3 px-5 text-lg text-white font-bold leading-8 truncate">
                    Match history
                  </p>
                  {matchHistory
                    .slice(matchHistory.length - 10, matchHistory.length)
                    .map((match: any) => {
                      return (
                        <MatchHistoryCard
                          key={match.id}
                          nickname={match.otherPlayerName}
                          myScore={match.myScore}
                          otherScore={match.otherScore}
                          otherPlayerId={match.otherPlayerId}
                        />
                      );
                    })}
                </div>
                {/* <div
                  className="bg-slate-500 text-black shadow-lg p-4 rounded-3xl"
                  id="chartpie"
                >
                  {' '}
                  Top 5 best player here
                </div> */}
              </div>
            </div>
            <div className="col-span-12 mt-5">
              <div className="grid gap-2 grid-cols-1 lg:grid-cols-1"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
