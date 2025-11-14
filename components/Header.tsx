
import React from 'react';
import { useWallet } from '../context/WalletContext';
import { truncateAddress } from '../utils/helpers';
import { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile | null;
}

const Header: React.FC<HeaderProps> = ({ profile }) => {
  const { publicKey, connectWallet, disconnectWallet } = useWallet();

  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h1 className="text-xl font-bold text-white">CARV Mini Arcade</h1>
        </div>
        <div>
          {publicKey ? (
            <div className="flex items-center space-x-4">
              <div className="bg-slate-700 text-slate-300 text-sm font-mono px-3 py-1.5 rounded-md hidden sm:flex items-center space-x-3">
                 <span>{truncateAddress(publicKey)}</span>
                 {profile && (
                    <>
                        <span className="text-slate-500">|</span>
                        <span className="font-sans font-bold text-white">{profile.total_points} PTS</span>
                    </>
                 )}
              </div>
              <button
                onClick={disconnectWallet}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 animate-pulse"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
