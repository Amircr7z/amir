
import React, { useState, useEffect, useCallback } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import Header from './components/Header';
import Profile from './components/Profile';
import QuizContainer from './components/QuizContainer';
import Leaderboard from './components/Leaderboard';
import { UserProfile } from './types';
import { mockApi } from './services/mockApi';

const AppContent: React.FC = () => {
  const { publicKey } = useWallet();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (publicKey) {
      setLoadingProfile(true);
      const profileData = await mockApi.getProfile(publicKey);
      setProfile(profileData);
      setLoadingProfile(false);
    } else {
      setProfile(null);
    }
  }, [publicKey]);

  useEffect(() => {
    fetchProfile();
    
    const refetchHandler = () => fetchProfile();
    window.addEventListener('profileUpdate', refetchHandler);
    
    return () => window.removeEventListener('profileUpdate', refetchHandler);
  }, [fetchProfile]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Header profile={profile} />
      <main className="container mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <Profile profile={profile} loading={loadingProfile} />
          </div>
          <div className="lg:col-span-6">
            <QuizContainer />
          </div>
          <div className="lg:col-span-3">
            <Leaderboard />
          </div>
        </div>
      </main>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
};

export default App;
