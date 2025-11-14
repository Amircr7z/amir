
import {
  Topic,
  Difficulty,
  Question,
  FullQuestion,
  UserProfile,
  LeaderboardUser,
  Event,
  QuizSubmissionDetail
} from '../types';
import { QUESTIONS_SEED } from '../constants';

// --- MOCK DATABASE ---
const mockUsers: { [address: string]: { total_points: number } } = {
    'user1_address_placeholder': { total_points: 150 },
    'user2_address_placeholder': { total_points: 125 },
    'user3_address_placeholder': { total_points: 110 },
};
const mockEvents: { [address: string]: Event[] } = {};
const mockNonces: { [address: string]: { nonce: string; expires: number } } = {};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const ensureUser = (address: string) => {
  if (!mockUsers[address]) {
    mockUsers[address] = { total_points: 0 };
  }
  if (!mockEvents[address]) {
    mockEvents[address] = [];
  }
};

const addEvent = (address: string, type: 'quiz' | 'spin', delta: number) => {
    ensureUser(address);
    const event: Event = {
        id: crypto.randomUUID(),
        type,
        delta,
        timestamp: new Date().toISOString(),
        txHash: null // Mocking: no on-chain proof
    };
    mockEvents[address].unshift(event); // Add to beginning
};


export const mockApi = {
  getNonce: async (address: string): Promise<{ nonce: string }> => {
    await delay(200);
    const nonce = crypto.randomUUID();
    mockNonces[address] = { nonce, expires: Date.now() + 5 * 60 * 1000 }; // Expires in 5 minutes
    return { nonce };
  },

  getQuestions: async (topic: Topic, difficulty: Difficulty, count: number): Promise<Question[]> => {
    await delay(400);
    const filtered = QUESTIONS_SEED.filter(q => q.topic === topic && q.difficulty === difficulty);
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    const questions = shuffled.slice(0, count).map(({ answer_index, ...rest }) => rest);
    return questions;
  },
  
  verifyAnswer: async (questionId: number, answerIndex: number): Promise<boolean> => {
    await delay(50); // Simulate quick check
    const question = QUESTIONS_SEED.find(q => q.id === questionId);
    return question ? question.answer_index === answerIndex : false;
  },

  submitQuiz: async (payload: {
    address: string;
    signature: string;
    nonce: string;
    score: number;
    totalQuestions: number;
    details: QuizSubmissionDetail[];
  }): Promise<{ success: boolean; points_awarded?: number; total_points?: number; message?: string }> => {
    await delay(1000);
    const { address, nonce, details } = payload;
    
    // 1. Verify Nonce
    const storedNonce = mockNonces[address];
    if (!storedNonce || storedNonce.nonce !== nonce || storedNonce.expires < Date.now()) {
      return { success: false, message: "Invalid or expired nonce." };
    }
    delete mockNonces[address]; // Single-use nonce

    // 2. Signature verification is assumed to be true for mock
    
    // 3. Re-calculate score on server-side to prevent cheating
    let serverScore = 0;
    for (const detail of details) {
        const question = QUESTIONS_SEED.find(q => q.id === detail.qId);
        if (question && detail.correct && (await mockApi.verifyAnswer(detail.qId, question.answer_index))) {
            // A bit redundant, but simulates server checking
            serverScore++;
        }
    }
    
    const points_awarded = serverScore;
    ensureUser(address);
    mockUsers[address].total_points += points_awarded;
    addEvent(address, 'quiz', points_awarded);

    return { success: true, points_awarded, total_points: mockUsers[address].total_points };
  },

  spin: async (payload: {
    address: string;
    signature: string;
    nonce: string;
  }): Promise<{ multiplier: number, points_delta: number, total_points: number, error?: string }> => {
    await delay(1500);
    const { address, nonce } = payload;
    
    // 1. Verify Nonce
    const storedNonce = mockNonces[address];
    if (!storedNonce || storedNonce.nonce !== nonce || storedNonce.expires < Date.now()) {
      return { multiplier: 0, points_delta: 0, total_points: 0, error: "Invalid or expired nonce." };
    }
    delete mockNonces[address]; // Single-use nonce
    
    // 2. Ensure user exists and has enough points
    ensureUser(address);
    const SPIN_COST = 5;
    if (mockUsers[address].total_points < SPIN_COST) {
        return { multiplier: 0, points_delta: 0, total_points: mockUsers[address].total_points, error: "Not enough points to spin." };
    }

    mockUsers[address].total_points -= SPIN_COST;
    
    // 3. Server-side roll
    let multiplier = 0;
    let points_delta = -SPIN_COST;
    const roll = Math.random();

    if (roll < 0.30) { // 30% for x0
      multiplier = 0;
    } else if (roll < 0.55) { // 25% for x1
      multiplier = 1;
      points_delta += SPIN_COST;
    } else if (roll < 0.75) { // 20% for x2
      multiplier = 2;
      points_delta += SPIN_COST * 2;
    } else if (roll < 0.80) { // 5% for x5
      multiplier = 5;
      points_delta += SPIN_COST * 5;
    } else { // 20% for reroll (not implemented, treat as x1 for simplicity in mock)
      multiplier = 1; 
      points_delta += SPIN_COST;
    }

    mockUsers[address].total_points += (points_delta + SPIN_COST);
    addEvent(address, 'spin', points_delta);
    
    return { multiplier, points_delta, total_points: mockUsers[address].total_points };
  },

  getLeaderboard: async (): Promise<LeaderboardUser[]> => {
    await delay(500);
    const sortedUsers = Object.entries(mockUsers)
      .map(([address, data]) => ({ address, total_points: data.total_points }))
      .sort((a, b) => b.total_points - a.total_points);
    return sortedUsers.slice(0, 10);
  },

  getProfile: async (address: string): Promise<UserProfile> => {
    await delay(300);
    ensureUser(address);
    return {
      address,
      total_points: mockUsers[address]?.total_points ?? 0,
      events: mockEvents[address] ?? [],
    };
  },
};
