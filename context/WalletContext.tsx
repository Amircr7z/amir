
import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode } from 'react';
import { SolanaWallet } from '../types';
import bs58 from 'bs58';

interface WalletContextType {
  publicKey: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  signMessage: (message: string) => Promise<string | null>;
  wallet: SolanaWallet | null;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Helper to get the wallet provider from the window object
const getProvider = (): SolanaWallet | null => {
  if ('solana' in window) {
    const provider = (window as any).solana;
    if (provider.isPhantom || provider.isBackpack) {
      return provider as SolanaWallet;
    }
  }
  return null;
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<SolanaWallet | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const provider = getProvider();
    if (provider) {
      setWallet(provider);
      // Attempt to auto-connect if already trusted
      provider.connect({ onlyIfTrusted: true }).then(({ publicKey }) => {
        setPublicKey(publicKey.toString());
      }).catch(() => {
        // Fail silently on auto-connect failure
      });

      // Listen for account changes
      provider.on('connect', (pk) => {
         if (pk) setPublicKey(pk.toString());
      });
      provider.on('disconnect', () => {
        setPublicKey(null);
      });
      
      return () => {
        provider.removeListener('connect', ()=>{});
        provider.removeListener('disconnect', ()=>{});
      }
    }
  }, []);

  const connectWallet = useCallback(async () => {
    setError(null);
    if (wallet) {
      try {
        const { publicKey } = await wallet.connect();
        setPublicKey(publicKey.toString());
      } catch (err) {
        console.error('Failed to connect wallet:', err);
        setError('Failed to connect wallet. User rejected the request.');
      }
    } else {
      setError('Solana wallet (Phantom/Backpack) not found. Please install it.');
    }
  }, [wallet]);

  const disconnectWallet = useCallback(async () => {
    if (wallet) {
      try {
        await wallet.disconnect();
        setPublicKey(null);
      } catch (err) {
        console.error('Failed to disconnect wallet:', err);
        setError('Failed to disconnect wallet.');
      }
    }
  }, [wallet]);

  const signMessage = useCallback(async (message: string): Promise<string | null> => {
    if (wallet && publicKey) {
      try {
        const encodedMessage = new TextEncoder().encode(message);
        const { signature } = await wallet.signMessage(encodedMessage, 'utf8');
        return bs58.encode(signature);
      } catch (err) {
        console.error('Failed to sign message:', err);
        setError('Message signing was rejected.');
        return null;
      }
    }
    setError('Wallet not connected.');
    return null;
  }, [wallet, publicKey]);

  return (
    <WalletContext.Provider value={{ publicKey, connectWallet, disconnectWallet, signMessage, wallet, error }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
