// Global test setup
import { jest } from '@jest/globals';

// Mock console methods to avoid cluttering test output
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
};

beforeAll(() => {
  // Suppress console output during tests unless explicitly needed
  if (process.env.NODE_ENV === 'test') {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    console.info = jest.fn();
  }
});

afterAll(() => {
  // Restore original console methods
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
});

// Global test utilities
export const mockConfig = {
  apiKey: 'test-api-key',
  baseUrl: 'https://test-api.example.com',
  defaultModel: 'gpt-4',
  defaultTemperature: 0.7,
  defaultMaxTokens: 2000,
  costLimitPerDay: 50.0,
  enableAnalytics: true,
  enableOptimization: true,
  enableFailover: true,
  theme: 'auto',
  outputFormat: 'table',
  debugMode: false,
};

export const mockModels = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    available: true,
    maxTokens: 8192,
    contextLength: 8192,
    pricing: {
      input: 0.03,
      output: 0.06,
    },
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    available: true,
    maxTokens: 4096,
    contextLength: 4096,
    pricing: {
      input: 0.001,
      output: 0.002,
    },
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    available: true,
    maxTokens: 4096,
    contextLength: 4096,
    pricing: {
      input: 0.015,
      output: 0.075,
    },
  },
];

export const mockAnalysis = {
  summary: {
    totalCost: 125.50,
    totalRequests: 1500,
    totalTokens: 250000,
    avgCostPerRequest: 0.084,
    avgTokensPerRequest: 167,
  },
  costsByModel: [
    {
      model: 'gpt-4',
      totalCost: 75.30,
      requests: 800,
      percentage: 60.0,
      details: {
        inputTokens: 120000,
        outputTokens: 80000,
        avgCostPerRequest: 0.094,
      },
    },
    {
      model: 'gpt-3.5-turbo',
      totalCost: 50.20,
      requests: 700,
      percentage: 40.0,
      details: {
        inputTokens: 100000,
        outputTokens: 50000,
        avgCostPerRequest: 0.072,
      },
    },
  ],
  costsByProvider: [
    {
      provider: 'openai',
      totalCost: 125.50,
      requests: 1500,
      percentage: 100.0,
    },
  ],
  insights: [
    {
      type: 'suggestion',
      message: 'Consider using GPT-3.5 Turbo for simple tasks to reduce costs by 30%',
    },
    {
      type: 'warning',
      message: 'Daily cost limit of $50 exceeded on 3 days this month',
    },
  ],
};

export const mockOptimization = {
  original: {
    prompt: 'Write a very detailed and comprehensive essay about climate change that covers all aspects including causes, effects, and solutions.',
    tokens: 25,
    cost: 0.0015,
  },
  optimized: {
    prompt: 'Write an essay about climate change covering causes, effects, and solutions.',
    tokens: 15,
    cost: 0.0009,
  },
  savings: {
    tokenReduction: 40.0,
    costReduction: 40.0,
    tokensSaved: 10,
    costSaved: 0.0006,
  },
  techniques: [
    {
      name: 'Remove redundant words',
      impact: 20.0,
      description: 'Eliminated unnecessary adjectives and adverbs',
    },
    {
      name: 'Simplify instructions',
      impact: 20.0,
      description: 'Streamlined the prompt while maintaining clarity',
    },
  ],
  qualityAssessment: {
    semanticSimilarity: 95.0,
    informationRetention: 90.0,
    clarityScore: 85.0,
  },
}; 