
import React, { useState } from 'react';
import QuizCard from './QuizCard';
import SpinWheel from './SpinWheel';

type View = 'quiz' | 'spin';

const QuizContainer: React.FC = () => {
  const [view, setView] = useState<View>('quiz');

  const getButtonClass = (buttonView: View) => {
    return view === buttonView
      ? 'bg-cyan-500 text-white'
      : 'bg-slate-700 text-slate-300 hover:bg-slate-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center bg-slate-800 p-1 rounded-lg border border-slate-700">
        <button
          onClick={() => setView('quiz')}
          className={`w-1/2 py-2 px-4 rounded-md font-semibold transition-colors ${getButtonClass('quiz')}`}
        >
          Quiz
        </button>
        <button
          onClick={() => setView('spin')}
          className={`w-1/2 py-2 px-4 rounded-md font-semibold transition-colors ${getButtonClass('spin')}`}
        >
          Spin Wheel
        </button>
      </div>
      {view === 'quiz' && <QuizCard />}
      {view === 'spin' && <SpinWheel />}
    </div>
  );
};

export default QuizContainer;
