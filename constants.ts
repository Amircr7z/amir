
import { Topic, Difficulty, FullQuestion } from './types';

export const TOPICS = Object.values(Topic);
export const DIFFICULTIES = Object.values(Difficulty);

export const QUESTIONS_PER_QUIZ = 20;

export const QUESTION_TIME_LIMITS: { [key in Difficulty]: number } = {
  [Difficulty.Easy]: 30,
  [Difficulty.Medium]: 20,
  [Difficulty.Hard]: 12,
};

export const ANSWER_FEEDBACK_DURATION = 800; // ms

export const QUESTIONS_SEED: FullQuestion[] = [
  // Blockchain - Easy
  { id: 1, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What is a blockchain?", options: ["A type of database", "A chain of blocks", "A distributed ledger", "All of the above"], answer_index: 3 },
  { id: 2, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "Who is the creator of Bitcoin?", options: ["Vitalik Buterin", "Satoshi Nakamoto", "Charles Hoskinson", "Elon Musk"], answer_index: 1 },
  { id: 3, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What does 'DeFi' stand for?", options: ["Decentralized Finance", "Digital Finance", "Distributed Funding", "Decentralized Funding"], answer_index: 0 },
  { id: 4, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What is a 'smart contract'?", options: ["A legally binding digital contract", "A self-executing contract with terms written into code", "A contract that is very intelligent", "A contract for buying smart devices"], answer_index: 1 },
  { id: 5, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "Which of these is a popular blockchain platform for smart contracts?", options: ["Bitcoin", "Dogecoin", "Ethereum", "Litecoin"], answer_index: 2 },
  { id: 6, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What is 'gas' in the context of Ethereum?", options: ["Fuel for cars", "A fee for transactions or computational services", "A type of cryptocurrency", "A networking protocol"], answer_index: 1 },
  { id: 7, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What does 'NFT' stand for?", options: ["Non-Fungible Token", "New Financial Technology", "Non-Financial Transaction", "Network Funding Token"], answer_index: 0 },
  { id: 8, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What is a 'wallet' in crypto?", options: ["A physical device only", "Software that stores keys and interacts with blockchains", "A bank account", "A type of coin"], answer_index: 1 },
  { id: 9, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What is 'mining'?", options: ["Digging for gold", "The process of creating new blocks and verifying transactions", "A type of hacking", "A way to cool down computers"], answer_index: 1 },
  { id: 10, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What is a 'private key' used for?", options: ["To share with friends", "To receive funds", "To sign transactions and prove ownership", "To check your balance"], answer_index: 2 },
  { id: 11, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What is a public ledger?", options: ["A secret book", "A distributed and public record of all transactions", "A newspaper", "A government database"], answer_index: 1 },
  { id: 12, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "Which consensus mechanism does Bitcoin use?", options: ["Proof of Stake", "Proof of Authority", "Proof of Work", "Proof of History"], answer_index: 2 },
  { id: 13, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What is a 'node'?", options: ["A type of coin", "A participant in a blockchain network that maintains a copy of the ledger", "A central server", "A user's wallet"], answer_index: 1 },
  { id: 14, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What does 'HODL' mean in crypto slang?", options: ["Hold On for Dear Life", "A misspelling of 'hold'", "A trading strategy", "All of the above"], answer_index: 3 },
  { id: 15, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What is an 'altcoin'?", options: ["A coin with alternative features", "Any cryptocurrency other than Bitcoin", "A coin that is not secure", "A coin used for voting"], answer_index: 1 },
  { id: 16, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What is a 'block' in a blockchain?", options: ["A collection of transactions", "A single transaction", "A cryptocurrency", "A user's account"], answer_index: 0 },
  { id: 17, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What is a 'fork' in blockchain?", options: ["A split in the blockchain network", "An upgrade to the protocol", "Both a and b", "A type of spoon"], answer_index: 2 },
  { id: 18, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What is 'Slippage' in DEX trading?", options: ["The price difference between order and execution", "A network error", "A type of market manipulation", "A feature of a wallet"], answer_index: 0 },
  { id: 19, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What is a 'DAO'?", options: ["Digital Asset Organization", "Decentralized Autonomous Organization", "Data Access Object", "Distributed Application Online"], answer_index: 1 },
  { id: 20, topic: Topic.Blockchain, difficulty: Difficulty.Easy, question: "What is the primary purpose of a blockchain's consensus mechanism?", options: ["To create new coins", "To agree on the state of the ledger", "To speed up transactions", "To reduce fees"], answer_index: 1 },
  
  // Projects - Medium
  { id: 21, topic: Topic.Projects, difficulty: Difficulty.Medium, question: "Which project is known for its 'Proof of History' consensus mechanism?", options: ["Ethereum", "Cardano", "Solana", "Polkadot"], answer_index: 2 },
  { id: 22, topic: Topic.Projects, difficulty: Difficulty.Medium, question: "Uniswap is a popular decentralized exchange (DEX) built on which blockchain?", options: ["Solana", "Ethereum", "Binance Smart Chain", "Avalanche"], answer_index: 1 },
  { id: 23, topic: Topic.Projects, difficulty: Difficulty.Medium, question: "What is the main goal of the Polkadot project?", options: ["To be a faster Bitcoin", "To enable cross-blockchain interoperability", "To be a decentralized file storage", "To be a privacy-focused coin"], answer_index: 1 },
  { id: 24, topic: Topic.Projects, difficulty: Difficulty.Medium, question: "Chainlink is a decentralized network that provides what service to smart contracts?", options: ["Oracles (real-world data)", "Scalability", "Privacy", "Storage"], answer_index: 0 },
  { id: 25, topic: Topic.Projects, difficulty: Difficulty.Medium, question: "Aave is a leading protocol in which DeFi sector?", options: ["Decentralized Exchange", "Yield Farming", "Lending and Borrowing", "Insurance"], answer_index: 2 },
  // ... Adding more for other categories ...
  // Tokenomics - Hard
  { id: 41, topic: Topic.Tokenomics, difficulty: Difficulty.Hard, question: "What is a 'vesting period' in tokenomics?", options: ["The time a token is actively traded", "A period during which tokens are locked and cannot be sold", "The time it takes to mine a token", "The duration of an ICO"], answer_index: 1 },
  { id: 42, topic: Topic.Tokenomics, difficulty: Difficulty.Hard, question: "A deflationary token model typically involves what mechanism?", options: ["Increasing the total supply", "Token burning to reduce supply", "A fixed supply", "Airdropping tokens"], answer_index: 1 },
  // Technical - Hard
  { id: 61, topic: Topic.Technical, difficulty: Difficulty.Hard, question: "In cryptography, what is the 'double-spending' problem?", options: ["Spending a crypto twice by mistake", "A flaw where the same digital token can be spent more than once", "A network attack that doubles transaction fees", "A user interface bug"], answer_index: 1 },
  { id: 62, topic: Topic.Technical, difficulty: Difficulty.Hard, question: "What is a Merkle Tree used for in blockchains?", options: ["To store user data privately", "To efficiently and securely verify the contents of large data structures", "To create new private keys", "To determine gas fees"], answer_index: 1 },
];
