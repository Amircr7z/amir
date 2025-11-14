
import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { mockApi } from '../services/mockApi';

const SPIN_COST = 5;

const SpinWheel: React.FC = () => {
    const { publicKey, signMessage } = useWallet();
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<{ multiplier: number; points_delta: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSpin = async () => {
        if (!publicKey) {
            setError("Please connect your wallet to spin.");
            return;
        }
        setIsSpinning(true);
        setError(null);
        setResult(null);

        try {
            const { nonce } = await mockApi.getNonce(publicKey);
            const messageToSign = `CARV-SPIN:${nonce}`;
            const signature = await signMessage(messageToSign);

            if (signature) {
                const spinResult = await mockApi.spin({ address: publicKey, signature, nonce });
                if (spinResult.error) {
                    setError(spinResult.error);
                } else {
                    setResult({ multiplier: spinResult.multiplier, points_delta: spinResult.points_delta });
                    // Dispatch event to notify other components to update
                    window.dispatchEvent(new CustomEvent('profileUpdate'));
                }
            } else {
                setError("Failed to sign message. Please try again.");
            }
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred during the spin.");
        } finally {
            setIsSpinning(false);
        }
    };

    const renderResult = () => {
        if (!result) return null;
        let message;
        let colorClass = 'text-white';

        if (result.multiplier === 0) {
            message = `Oh no! You lost ${SPIN_COST} points.`;
            colorClass = 'text-red-400';
        } else if (result.multiplier === 1) {
            message = `Broke even! No change in points.`;
            colorClass = 'text-slate-400';
        } else {
            message = `Congratulations! You won with a x${result.multiplier} multiplier! (+${result.points_delta} points)`;
            colorClass = 'text-green-400';
        }

        return <p className={`text-center font-semibold mt-4 text-lg ${colorClass}`}>{message}</p>;
    };

    return (
        <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-700 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Spin the Wheel!</h2>
            <p className="text-slate-400 mb-6">Feeling lucky? Spend {SPIN_COST} points for a chance to win big.</p>
            
            <div className="my-8 flex justify-center items-center">
                {/* A simple placeholder for the wheel */}
                <div className={`w-48 h-48 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center
                    ${isSpinning ? 'animate-spin' : ''}`}>
                    <span className="text-4xl font-black text-white">?</span>
                </div>
            </div>

            {error && <p className="text-red-400 text-center mb-4">{error}</p>}
            {result && renderResult()}

            <button
                onClick={handleSpin}
                disabled={isSpinning || !publicKey}
                className="w-full max-w-sm mx-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg mt-6 transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
                {isSpinning ? 'Spinning...' : `Spin for ${SPIN_COST} Points`}
            </button>
            {!publicKey && <p className="text-sm text-slate-500 mt-2">Connect your wallet to spin.</p>}
        </div>
    );
};

export default SpinWheel;
