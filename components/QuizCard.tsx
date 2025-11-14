import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Topic, Difficulty, Question, QuizSubmissionDetail } from '../types';
import { TOPICS, DIFFICULTIES, QUESTION_TIME_LIMITS, QUESTIONS_PER_QUIZ, ANSWER_FEEDBACK_DURATION } from '../constants';
import { useWallet } from '../context/WalletContext';
import { mockApi } from '../services/mockApi';

type QuizState = 'idle' | 'playing' | 'finished';
type AnswerState = 'unanswered' | 'correct' | 'incorrect';

const QuizCard: React.FC = () => {
  const { publicKey, signMessage } = useWallet();
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [topic, setTopic] = useState<Topic>(Topic.Blockchain);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMITS[difficulty]);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [submissionDetails, setSubmissionDetails] = useState<QuizSubmissionDetail[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FIX: Use ReturnType<typeof setInterval> for browser compatibility instead of NodeJS.Timeout.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartTimeRef = useRef<number>(0);

  const timeLimit = QUESTION_TIME_LIMITS[difficulty];

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(timeLimit);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    questionStartTimeRef.current = Date.now();
  }, [timeLimit]);

  useEffect(() => {
    if (timeLeft <= 0 && quizState === 'playing' && answerState === 'unanswered') {
      handleAnswerSelect(-1); // -1 indicates timeout
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, quizState, answerState]);

  const startQuiz = async () => {
    setError(null);
    const fetchedQuestions = await mockApi.getQuestions(topic, difficulty, QUESTIONS_PER_QUIZ);
    if (fetchedQuestions.length > 0) {
      setQuestions(fetchedQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSubmissionDetails([]);
      setQuizState('playing');
      resetTimer();
    } else {
      setError("Could not fetch questions for this category. Please try another.");
    }
  };

  const handleAnswerSelect = async (selectedIndex: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const timeTaken = (Date.now() - questionStartTimeRef.current) / 1000;
    
    // This is a mock verification. In a real scenario, the backend would do this.
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = await mockApi.verifyAnswer(currentQuestion.id, selectedIndex);

    setSelectedAnswerIndex(selectedIndex);
    setAnswerState(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setSubmissionDetails(prev => [...prev, {
        qId: currentQuestion.id,
        correct: isCorrect,
        timeTaken
    }]);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setAnswerState('unanswered');
        setSelectedAnswerIndex(null);
        resetTimer();
      } else {
        setQuizState('finished');
      }
    }, ANSWER_FEEDBACK_DURATION);
  };
  
  const handleClaimPoints = async () => {
      if (!publicKey) {
          setError("Please connect your wallet to claim points.");
          return;
      }
      setIsSubmitting(true);
      setError(null);

      try {
          const { nonce } = await mockApi.getNonce(publicKey);
          const messageToSign = `CARV-CLAIM:${nonce}`;
          const signature = await signMessage(messageToSign);

          if (signature) {
              const result = await mockApi.submitQuiz({
                  address: publicKey,
                  signature,
                  nonce,
                  score,
                  totalQuestions: questions.length,
                  details: submissionDetails,
              });

              if (result.success) {
                  // Dispatch event to notify other components to update
                  window.dispatchEvent(new CustomEvent('profileUpdate'));
                  setQuizState('idle'); // Or show a success message
              } else {
                  setError(result.message || "Failed to submit quiz results.");
              }
          } else {
            setError("Failed to sign message. Please try again.");
          }
      } catch (e: any) {
          setError(e.message || "An unexpected error occurred.");
      } finally {
          setIsSubmitting(false);
      }
  };


  const renderIdleState = () => (
    <>
      <h2 className="text-2xl font-bold text-center text-white mb-6">Quiz Setup</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Topic</label>
          <select value={topic} onChange={e => setTopic(e.target.value as Topic)} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white">
            {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Difficulty</label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white">
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      <button onClick={startQuiz} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg mt-6 transition-colors duration-200">
        Start Quiz
      </button>
    </>
  );

  const renderPlayingState = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const timeProgress = (timeLeft / timeLimit) * 100;

    const getOptionClass = (index: number) => {
        if (answerState === 'unanswered') {
            return 'bg-slate-700 hover:bg-slate-600';
        }
        if (index === selectedAnswerIndex) {
            return answerState === 'correct' ? 'bg-green-500' : 'bg-red-500';
        }
        // This part needs the correct answer index from the backend/mock to highlight the correct one on wrong selection
        // Since we can't get it from the mockApi easily, we'll just highlight the selection.
        return 'bg-slate-700';
    };


    return (
      <div>
        <div className="mb-4">
            <div className="flex justify-between items-center text-slate-400 mb-2">
                <span>Q {currentQuestionIndex + 1} / {questions.length}</span>
                <span className="font-bold">{timeLeft}s</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${timeProgress}%`, transition: 'width 1s linear' }}></div>
            </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-6 text-center">{question.question}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              disabled={answerState !== 'unanswered'}
              onClick={() => handleAnswerSelect(index)}
              className={`p-4 rounded-lg text-left transition-colors duration-300 ${getOptionClass(index)} disabled:cursor-not-allowed`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderFinishedState = () => (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-2">Quiz Finished!</h2>
      <p className="text-slate-400 mb-6">Your score:</p>
      <p className="text-6xl font-bold text-cyan-400 mb-8">{score} / {questions.length}</p>
      {error && <p className="text-red-400 text-center mb-4">{error}</p>}
      <button 
        onClick={handleClaimPoints} 
        disabled={isSubmitting || !publicKey}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Claim Points'}
      </button>
      {!publicKey && <p className="text-sm text-slate-500 mt-2">Connect your wallet to claim.</p>}
      <button onClick={() => setQuizState('idle')} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg mt-4 transition-colors duration-200">
        Play Again
      </button>
    </div>
  );

  return (
    <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-700 min-h-[400px]">
      {quizState === 'idle' && renderIdleState()}
      {quizState === 'playing' && renderPlayingState()}
      {quizState === 'finished' && renderFinishedState()}
    </div>
  );
};

export default QuizCard;