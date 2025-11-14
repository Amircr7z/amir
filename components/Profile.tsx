
import React from 'react';
import { useWallet } from '../context/WalletContext';
import { UserProfile } from '../types';
import { truncateAddress } from '../utils/helpers';

interface ProfileProps {
  profile: UserProfile | null;
  loading: boolean;
}

const Profile: React.FC<ProfileProps> = ({ profile, loading }) => {
  const { publicKey } = useWallet();

  if (!publicKey) {
    return (
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 h-full flex flex-col items-center justify-center">
        <p className="text-slate-400">Connect your wallet to see your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 h-full">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/2 mb-4"></div>
          <div className="space-y-4">
            <div>
              <div className="h-4 bg-slate-700 rounded w-1/4 mb-1"></div>
              <div className="h-5 bg-slate-700 rounded w-3/4"></div>
            </div>
            <div>
              <div className="h-4 bg-slate-700 rounded w-1/4 mb-1"></div>
              <div className="h-10 bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 h-full">
      <h2 className="text-2xl font-bold text-white mb-4">Profile</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-400">Address</p>
          <p className="font-mono text-cyan-400 break-all">{truncateAddress(publicKey, 8)}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Total Points</p>
          <p className="text-3xl font-bold text-white">{profile?.total_points ?? 0}</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white mb-3">History</h3>
        <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
          {profile?.events && profile.events.length > 0 ? (
            profile.events.map((event) => (
              <div key={event.id} className="bg-slate-700/50 p-3 rounded-lg text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-bold capitalize">{event.type}</span>
                  <span className={`font-bold ${event.delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {event.delta > 0 ? '+' : ''}{event.delta} PTS
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {new Date(event.timestamp).toLocaleString()}
                </div>
                {event.txHash && (
                  <div className="text-xs text-slate-500 mt-1 truncate">
                    Tx: {event.txHash}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">No events yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
