
export enum Topic {
  Blockchain = "Blockchain",
  Projects = "Projects",
  Tokenomics = "Tokenomics",
  Technical = "Technical",
}

export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export interface Question {
  id: number;
  topic: Topic;
  difficulty: Difficulty;
  question: string;
  options: string[];
}

export interface FullQuestion extends Question {
  answer_index: number;
}

export interface QuizSubmissionDetail {
  qId: number;
  correct: boolean;
  timeTaken: number;
}

export interface UserProfile {
  address: string;
  total_points: number;
  events: Event[];
}

export interface Event {
  id: string;
  type: 'quiz' | 'spin';
  delta: number;
  timestamp: string;
  txHash: string | null;
}

export interface LeaderboardUser {
  address: string;
  total_points: number;
}

// Represents the Phantom/Backpack wallet provider structure
export interface SolanaWallet {
  isPhantom?: boolean;
  isBackpack?: boolean;
  publicKey: {
    toString: () => string;
  };
  connect: (options?: { onlyIfTrusted: boolean }) => Promise<{ publicKey: any }>;
  disconnect: () => Promise<void>;
  signMessage: (message: Uint8Array, display: 'utf8' | 'hex') => Promise<{ signature: Uint8Array }>;
  on: (event: 'connect' | 'disconnect', callback: (publicKey?: any) => void) => void;
  removeListener: (event: 'connect' | 'disconnect', callback: (publicKey?: any) => void) => void;
}
