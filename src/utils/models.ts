export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  available: boolean;
  maxTokens: number;
  contextLength: number;
  pricing: {
    input: number;
    output: number;
  };
  capabilities: string[];
  category: string;
  isLatest: boolean;
  notes?: string;
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  // === OpenAI Models ===
  {
    id: 'gpt-4o-mini-2024-07-18',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    available: true,
    maxTokens: 128000,
    contextLength: 128000,
    pricing: { input: 0.15, output: 0.6 },
    capabilities: ['text', 'vision', 'multimodal'],
    category: 'text',
    isLatest: true,
    notes: 'Latest GPT-4o Mini model with vision capabilities'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    available: true,
    maxTokens: 128000,
    contextLength: 128000,
    pricing: { input: 2.5, output: 10.0 },
    capabilities: ['text', 'vision', 'multimodal'],
    category: 'text',
    isLatest: true,
    notes: 'Latest GPT-4o model with enhanced capabilities'
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    available: true,
    maxTokens: 128000,
    contextLength: 128000,
    pricing: { input: 0.15, output: 0.6 },
    capabilities: ['text', 'vision', 'multimodal'],
    category: 'text',
    isLatest: true,
    notes: 'GPT-4o Mini model with vision capabilities'
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    available: true,
    maxTokens: 128000,
    contextLength: 128000,
    pricing: { input: 10.0, output: 30.0 },
    capabilities: ['text', 'vision', 'multimodal'],
    category: 'text',
    isLatest: false,
    notes: 'GPT-4 Turbo with vision capabilities'
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    available: true,
    maxTokens: 8192,
    contextLength: 8192,
    pricing: { input: 30.0, output: 60.0 },
    capabilities: ['text'],
    category: 'text',
    isLatest: false,
    notes: 'GPT-4 base model'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    available: true,
    maxTokens: 16385,
    contextLength: 16385,
    pricing: { input: 0.5, output: 1.5 },
    capabilities: ['text'],
    category: 'text',
    isLatest: false,
    notes: 'GPT-3.5 Turbo model'
  },
  {
    id: 'gpt-4.1-2025-04-14',
    name: 'GPT-4.1',
    provider: 'OpenAI',
    available: true,
    maxTokens: 128000,
    contextLength: 128000,
    pricing: { input: 2.0, output: 8.0 },
    capabilities: ['text', 'analysis', 'reasoning'],
    category: 'text',
    isLatest: true,
    notes: 'Latest GPT-4.1 model with enhanced capabilities'
  },

  // === Anthropic Models ===
  {
    id: 'claude-opus-4-20250514',
    name: 'Claude Opus 4',
    provider: 'Anthropic',
    available: true,
    maxTokens: 200000,
    contextLength: 200000,
    pricing: { input: 15.0, output: 75.0 },
    capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'extended-thinking', 'multilingual'],
    category: 'multimodal',
    isLatest: true,
    notes: 'Most capable Claude model (Mar 2025 cutoff, 200k context, 32k output)'
  },
  {
    id: 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet 4',
    provider: 'Anthropic',
    available: true,
    maxTokens: 200000,
    contextLength: 200000,
    pricing: { input: 3.0, output: 15.0 },
    capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'extended-thinking', 'multilingual'],
    category: 'multimodal',
    isLatest: true,
    notes: 'High-performance Claude model (Mar 2025 cutoff, 200k context, 32k output)'
  },
  {
    id: 'claude-3-7-sonnet-20250219',
    name: 'Claude Sonnet 3.7',
    provider: 'Anthropic',
    available: true,
    maxTokens: 200000,
    contextLength: 200000,
    pricing: { input: 3.0, output: 15.0 },
    capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'extended-thinking', 'multilingual'],
    category: 'multimodal',
    isLatest: true,
    notes: 'High-performance model with early extended thinking (Oct 2024 cutoff, 200k context, 64k output)'
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude Sonnet 3.5 v2',
    provider: 'Anthropic',
    available: true,
    maxTokens: 200000,
    contextLength: 200000,
    pricing: { input: 3.0, output: 15.0 },
    capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'multilingual'],
    category: 'multimodal',
    isLatest: false,
    notes: 'Upgraded Claude 3.5 Sonnet (Apr 2024 cutoff, 200k context, 8k output)'
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude Haiku 3.5',
    provider: 'Anthropic',
    available: true,
    maxTokens: 200000,
    contextLength: 200000,
    pricing: { input: 0.8, output: 4.0 },
    capabilities: ['text', 'vision', 'multimodal', 'multilingual'],
    category: 'multimodal',
    isLatest: true,
    notes: 'Fastest Claude model (July 2024 cutoff, 200k context, 8k output)'
  },

  // === Google AI Models ===
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google AI',
    available: true,
    maxTokens: 2000000,
    contextLength: 2000000,
    pricing: { input: 1.25, output: 10.0 },
    capabilities: ['text', 'multimodal', 'reasoning', 'coding'],
    category: 'multimodal',
    isLatest: true,
    notes: 'State-of-the-art multipurpose model, excels at coding and complex reasoning'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google AI',
    available: true,
    maxTokens: 1000000,
    contextLength: 1000000,
    pricing: { input: 0.3, output: 2.5 },
    capabilities: ['text', 'image', 'video', 'multimodal', 'reasoning', 'thinking'],
    category: 'multimodal',
    isLatest: true,
    notes: 'First hybrid reasoning model with 1M context and thinking budgets'
  },
  {
    id: 'gemini-2.5-flash-lite-preview',
    name: 'Gemini 2.5 Flash-Lite Preview',
    provider: 'Google AI',
    available: true,
    maxTokens: 1000000,
    contextLength: 1000000,
    pricing: { input: 0.1, output: 0.4 },
    capabilities: ['text', 'image', 'video', 'multimodal', 'reasoning', 'thinking'],
    category: 'multimodal',
    isLatest: true,
    notes: 'Smallest and most cost effective model for at-scale usage'
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google AI',
    available: true,
    maxTokens: 1000000,
    contextLength: 1000000,
    pricing: { input: 0.1, output: 0.4 },
    capabilities: ['text', 'image', 'video', 'multimodal', 'agents'],
    category: 'multimodal',
    isLatest: false,
    notes: 'Most balanced multimodal model built for the era of Agents'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google AI',
    available: true,
    maxTokens: 2000000,
    contextLength: 2000000,
    pricing: { input: 1.25, output: 5.0 },
    capabilities: ['text', 'code', 'reasoning', 'multimodal'],
    category: 'text',
    isLatest: false,
    notes: 'Highest intelligence Gemini 1.5 series model with 2M context'
  },

  // === AWS Bedrock Models ===
  {
    id: 'ai21.jamba-1-5-large-v1:0',
    name: 'Jamba 1.5 Large (Bedrock)',
    provider: 'AWS Bedrock',
    available: true,
    maxTokens: 256000,
    contextLength: 256000,
    pricing: { input: 2.0, output: 8.0 },
    capabilities: ['text', 'long-context'],
    category: 'text',
    isLatest: true,
    notes: 'AI21 Labs Jamba 1.5 Large via AWS Bedrock'
  },
  {
    id: 'ai21.jamba-1-5-mini-v1:0',
    name: 'Jamba 1.5 Mini (Bedrock)',
    provider: 'AWS Bedrock',
    available: true,
    maxTokens: 256000,
    contextLength: 256000,
    pricing: { input: 0.2, output: 0.4 },
    capabilities: ['text', 'long-context', 'efficient'],
    category: 'text',
    isLatest: true,
    notes: 'AI21 Labs Jamba 1.5 Mini via AWS Bedrock'
  },
  {
    id: 'amazon.nova-micro-v1:0',
    name: 'Amazon Nova Micro (Bedrock)',
    provider: 'AWS Bedrock',
    available: true,
    maxTokens: 128000,
    contextLength: 128000,
    pricing: { input: 0.035, output: 0.14 },
    capabilities: ['text', 'ultra-fast', 'cost-effective'],
    category: 'text',
    isLatest: true,
    notes: 'Amazon Nova Micro via AWS Bedrock'
  },
  {
    id: 'amazon.nova-lite-v1:0',
    name: 'Amazon Nova Lite (Bedrock)',
    provider: 'AWS Bedrock',
    available: true,
    maxTokens: 300000,
    contextLength: 300000,
    pricing: { input: 0.06, output: 0.24 },
    capabilities: ['text', 'multimodal', 'fast'],
    category: 'multimodal',
    isLatest: true,
    notes: 'Amazon Nova Lite via AWS Bedrock'
  },
  {
    id: 'anthropic.claude-3-5-sonnet-20241022-v1:0',
    name: 'Claude 3.5 Sonnet (Bedrock)',
    provider: 'AWS Bedrock',
    available: true,
    maxTokens: 200000,
    contextLength: 200000,
    pricing: { input: 3.0, output: 15.0 },
    capabilities: ['text', 'vision', 'multimodal'],
    category: 'multimodal',
    isLatest: true,
    notes: 'Claude 3.5 Sonnet via AWS Bedrock'
  },
  {
    id: 'anthropic.claude-3-5-haiku-20241022-v1:0',
    name: 'Claude 3.5 Haiku (Bedrock)',
    provider: 'AWS Bedrock',
    available: true,
    maxTokens: 200000,
    contextLength: 200000,
    pricing: { input: 0.8, output: 4.0 },
    capabilities: ['text', 'vision', 'multimodal'],
    category: 'multimodal',
    isLatest: true,
    notes: 'Claude 3.5 Haiku via AWS Bedrock'
  },

  // === Cohere Models ===
  {
    id: 'command-r-plus',
    name: 'Command R+',
    provider: 'Cohere',
    available: true,
    maxTokens: 128000,
    contextLength: 128000,
    pricing: { input: 3.0, output: 15.0 },
    capabilities: ['text', 'multilingual', 'reasoning'],
    category: 'text',
    isLatest: true,
    notes: 'Most capable Cohere model with multilingual capabilities'
  },
  {
    id: 'command-r',
    name: 'Command R',
    provider: 'Cohere',
    available: true,
    maxTokens: 128000,
    contextLength: 128000,
    pricing: { input: 0.5, output: 1.5 },
    capabilities: ['text', 'multilingual'],
    category: 'text',
    isLatest: true,
    notes: 'Balanced Cohere model with multilingual support'
  },
  {
    id: 'command-light',
    name: 'Command Light',
    provider: 'Cohere',
    available: true,
    maxTokens: 128000,
    contextLength: 128000,
    pricing: { input: 0.1, output: 0.3 },
    capabilities: ['text', 'fast'],
    category: 'text',
    isLatest: true,
    notes: 'Fast and cost-effective Cohere model'
  },

  // === Mistral Models ===
  {
    id: 'mistral-large-latest',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    available: true,
    maxTokens: 32768,
    contextLength: 32768,
    pricing: { input: 6.0, output: 24.0 },
    capabilities: ['text', 'reasoning', 'coding'],
    category: 'text',
    isLatest: true,
    notes: 'Most capable Mistral model with reasoning capabilities'
  },
  {
    id: 'mistral-medium-latest',
    name: 'Mistral Medium',
    provider: 'Mistral AI',
    available: true,
    maxTokens: 32768,
    contextLength: 32768,
    pricing: { input: 2.0, output: 6.0 },
    capabilities: ['text', 'balanced'],
    category: 'text',
    isLatest: true,
    notes: 'Balanced Mistral model for general use'
  },
  {
    id: 'mistral-small-latest',
    name: 'Mistral Small',
    provider: 'Mistral AI',
    available: true,
    maxTokens: 32768,
    contextLength: 32768,
    pricing: { input: 0.5, output: 1.5 },
    capabilities: ['text', 'fast'],
    category: 'text',
    isLatest: true,
    notes: 'Fast and cost-effective Mistral model'
  },

  // === DeepSeek Models ===
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'DeepSeek',
    available: true,
    maxTokens: 32768,
    contextLength: 32768,
    pricing: { input: 0.14, output: 0.28 },
    capabilities: ['text', 'coding'],
    category: 'text',
    isLatest: true,
    notes: 'DeepSeek Chat model optimized for coding'
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'DeepSeek',
    available: true,
    maxTokens: 16384,
    contextLength: 16384,
    pricing: { input: 0.14, output: 0.28 },
    capabilities: ['text', 'coding', 'specialized'],
    category: 'text',
    isLatest: true,
    notes: 'Specialized coding model from DeepSeek'
  },

  // === Groq Models ===
  {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B Instant',
    provider: 'Groq',
    available: true,
    maxTokens: 8192,
    contextLength: 8192,
    pricing: { input: 0.05, output: 0.1 },
    capabilities: ['text', 'ultra-fast'],
    category: 'text',
    isLatest: true,
    notes: 'Ultra-fast Llama 3.1 8B model via Groq'
  },
  {
    id: 'llama-3.1-70b-version',
    name: 'Llama 3.1 70B',
    provider: 'Groq',
    available: true,
    maxTokens: 8192,
    contextLength: 8192,
    pricing: { input: 0.59, output: 1.87 },
    capabilities: ['text', 'high-quality'],
    category: 'text',
    isLatest: true,
    notes: 'High-quality Llama 3.1 70B model via Groq'
  },
  {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B',
    provider: 'Groq',
    available: true,
    maxTokens: 32768,
    contextLength: 32768,
    pricing: { input: 0.24, output: 0.24 },
    capabilities: ['text', 'efficient'],
    category: 'text',
    isLatest: true,
    notes: 'Efficient Mixtral 8x7B model via Groq'
  },

  // === XAI Models ===
  {
    id: 'x-1-mini',
    name: 'X-1 Mini',
    provider: 'XAI',
    available: true,
    maxTokens: 8192,
    contextLength: 8192,
    pricing: { input: 0.15, output: 0.6 },
    capabilities: ['text', 'efficient'],
    category: 'text',
    isLatest: true,
    notes: 'Efficient X-1 Mini model'
  },
  {
    id: 'x-1-hybrid',
    name: 'X-1 Hybrid',
    provider: 'XAI',
    available: true,
    maxTokens: 8192,
    contextLength: 8192,
    pricing: { input: 0.5, output: 1.5 },
    capabilities: ['text', 'balanced'],
    category: 'text',
    isLatest: true,
    notes: 'Balanced X-1 Hybrid model'
  }
];

export const getModelsByProvider = (provider?: string): ModelInfo[] => {
  if (!provider) {
    return AVAILABLE_MODELS;
  }
  return AVAILABLE_MODELS.filter(model => 
    model.provider.toLowerCase().includes(provider.toLowerCase())
  );
};

export const getLatestModels = (): ModelInfo[] => {
  return AVAILABLE_MODELS.filter(model => model.isLatest);
};

export const getModelsByCategory = (category?: string): ModelInfo[] => {
  if (!category) {
    return AVAILABLE_MODELS;
  }
  return AVAILABLE_MODELS.filter(model => 
    model.category.toLowerCase() === category.toLowerCase()
  );
};

export const searchModels = (query: string): ModelInfo[] => {
  const lowerQuery = query.toLowerCase();
  return AVAILABLE_MODELS.filter(model => 
    model.name.toLowerCase().includes(lowerQuery) ||
    model.id.toLowerCase().includes(lowerQuery) ||
    model.provider.toLowerCase().includes(lowerQuery) ||
    model.capabilities.some(cap => cap.toLowerCase().includes(lowerQuery))
  );
}; 