
import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import { LeaderboardUser } from '../types';
import { truncateAddress } from '../utils/helpers';

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const data = await mockApi.getLeaderboard();
      setUsers(data);
      setLoading(false);
    };

    fetchLeaderboard();

    const refetchHandler = () => fetchLeaderboard();
    window.addEventListener('profileUpdate', refetchHandler);
    return () => window.removeEventListener('profileUpdate', refetchHandler);
  }, []);

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 h-full">
      <h2 className="text-2xl font-bold text-white mb-4">Leaderboard</h2>
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-slate-700/50 p-3 rounded-lg animate-pulse h-12"></div>
          ))}
        </div>
      ) : (
        <ol className="space-y-3">
          {users.map((user, index) => (
            <li key={user.address} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-400 w-6">{index + 1}.</span>
                <span className="font-mono text-cyan-400 text-sm">{truncateAddress(user.address)}</span>
              </div>
              <span className="font-bold text-white">{user.total_points} PTS</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;
