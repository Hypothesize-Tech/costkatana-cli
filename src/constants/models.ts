/**
 * Type-Safe Model Constants for Cost Katana CLI
 *
 * Use these constants instead of strings to prevent spelling mistakes and get autocomplete support.
 *
 * @example
 * ```typescript
 * import { OPENAI, ANTHROPIC } from '../constants/models';
 *
 * // Type-safe model selection (recommended)
 * const model = OPENAI.GPT_4;
 * ```
 */

// ============================================================================
// OPENAI MODELS
// ============================================================================

export namespace OPENAI {
  // GPT-5 Series
  export const GPT_5 = 'gpt-5';
  export const GPT_5_MINI = 'gpt-5-mini';
  export const GPT_5_NANO = 'gpt-5-nano';
  export const GPT_5_PRO = 'gpt-5-pro';
  export const GPT_5_CODEX = 'gpt-5-codex';
  export const GPT_5_CHAT_LATEST = 'gpt-5-chat-latest';

  // GPT-4.1 Series
  export const GPT_4_1 = 'gpt-4.1';
  export const GPT_4_1_MINI = 'gpt-4.1-mini';
  export const GPT_4_1_NANO = 'gpt-4.1-nano';

  // GPT-4o Series
  export const GPT_4O = 'gpt-4o';
  export const GPT_4O_2024_08_06 = 'gpt-4o-2024-08-06';
  export const GPT_4O_2024_05_13 = 'gpt-4o-2024-05-13';
  export const GPT_4O_AUDIO_PREVIEW = 'gpt-4o-audio-preview';
  export const GPT_4O_REALTIME_PREVIEW = 'gpt-4o-realtime-preview';
  export const GPT_4O_MINI = 'gpt-4o-mini';
  export const GPT_4O_MINI_2024_07_18 = 'gpt-4o-mini-2024-07-18';
  export const GPT_4O_MINI_AUDIO_PREVIEW = 'gpt-4o-mini-audio-preview';
  export const GPT_4O_MINI_REALTIME_PREVIEW = 'gpt-4o-mini-realtime-preview';

  // O-Series Models
  export const O3_PRO = 'o3-pro';
  export const O3_DEEP_RESEARCH = 'o3-deep-research';
  export const O4_MINI = 'o4-mini';
  export const O4_MINI_DEEP_RESEARCH = 'o4-mini-deep-research';
  export const O3 = 'o3';
  export const O1_PRO = 'o1-pro';
  export const O1 = 'o1';
  export const O3_MINI = 'o3-mini';
  export const O1_MINI = 'o1-mini';
  export const O1_PREVIEW = 'o1-preview';

  // Video Generation
  export const SORA_2 = 'sora-2';
  export const SORA_2_PRO = 'sora-2-pro';

  // Image Generation
  export const GPT_IMAGE_1 = 'gpt-image-1';
  export const GPT_IMAGE_1_MINI = 'gpt-image-1-mini';
  export const DALL_E_3 = 'dall-e-3';
  export const DALL_E_2 = 'dall-e-2';

  // Audio & Realtime
  export const GPT_REALTIME = 'gpt-realtime';
  export const GPT_REALTIME_MINI = 'gpt-realtime-mini';
  export const GPT_AUDIO = 'gpt-audio';
  export const GPT_AUDIO_MINI = 'gpt-audio-mini';

  // Transcription
  export const GPT_4O_TRANSCRIBE = 'gpt-4o-transcribe';
  export const GPT_4O_TRANSCRIBE_DIARIZE = 'gpt-4o-transcribe-diarize';
  export const GPT_4O_MINI_TRANSCRIBE = 'gpt-4o-mini-transcribe';
  export const WHISPER_1 = 'whisper-1';

  // Text-to-Speech
  export const GPT_4O_MINI_TTS = 'gpt-4o-mini-tts';
  export const TTS_1 = 'tts-1';
  export const TTS_1_HD = 'tts-1-hd';

  // Open-Weight Models
  export const GPT_OSS_120B = 'gpt-oss-120b';
  export const GPT_OSS_20B = 'gpt-oss-20b';

  // Specialized
  export const CODEX_MINI_LATEST = 'codex-mini-latest';
  export const OMNI_MODERATION_LATEST = 'omni-moderation-latest';
  export const GPT_4O_MINI_SEARCH_PREVIEW =
    'gpt-4o-mini-search-preview-2025-03-11';
  export const GPT_4O_SEARCH_PREVIEW = 'gpt-4o-search-preview-2025-03-11';
  export const COMPUTER_USE_PREVIEW = 'computer-use-preview-2025-03-11';

  // Embeddings
  export const TEXT_EMBEDDING_3_SMALL = 'text-embedding-3-small';
  export const TEXT_EMBEDDING_3_LARGE = 'text-embedding-3-large';
  export const TEXT_EMBEDDING_ADA_002 = 'text-embedding-ada-002';

  // ChatGPT Models
  export const CHATGPT_4O_LATEST = 'chatgpt-4o-latest';

  // Legacy Models
  export const GPT_4_TURBO = 'gpt-4-turbo';
  export const GPT_4 = 'gpt-4';
  export const GPT_3_5_TURBO = 'gpt-3.5-turbo';
  export const GPT_3_5_TURBO_0125 = 'gpt-3.5-turbo-0125';
}

// ============================================================================
// ANTHROPIC MODELS
// ============================================================================

export namespace ANTHROPIC {
  // Claude 4.5 Series
  export const CLAUDE_SONNET_4_5 = 'claude-sonnet-4-5';
  export const CLAUDE_HAIKU_4_5 = 'claude-haiku-4-5';

  // Claude 4 Series
  export const CLAUDE_OPUS_4_1_20250805 = 'claude-opus-4-1-20250805';
  export const CLAUDE_OPUS_4_20250514 = 'claude-opus-4-20250514';
  export const CLAUDE_SONNET_4_20250514 = 'claude-sonnet-4-20250514';

  // Claude 3.7 Series
  export const CLAUDE_3_7_SONNET_20250219 = 'claude-3-7-sonnet-20250219';

  // Claude 3.5 Series
  export const CLAUDE_3_5_SONNET_20241022 = 'claude-3-5-sonnet-20241022';
  export const CLAUDE_3_5_HAIKU_20241022 = 'claude-3-5-haiku-20241022';

  // Claude 3 Series
  export const CLAUDE_3_HAIKU_20240307 = 'claude-3-haiku-20240307';
  export const CLAUDE_3_OPUS_20240229 = 'claude-3-opus-20240229';
  export const CLAUDE_3_SONNET_20240229 = 'claude-3-sonnet-20240229';
}

// ============================================================================
// GOOGLE (GEMINI) MODELS
// ============================================================================

export namespace GOOGLE {
  // Gemini 2.5 Series
  export const GEMINI_2_5_PRO = 'gemini-2.5-pro';
  export const GEMINI_2_5_FLASH = 'gemini-2.5-flash';
  export const GEMINI_2_5_FLASH_LITE_PREVIEW = 'gemini-2.5-flash-lite-preview';
  export const GEMINI_2_5_FLASH_LITE = 'gemini-2.5-flash-lite';
  export const GEMINI_2_5_FLASH_AUDIO = 'gemini-2.5-flash-audio';
  export const GEMINI_2_5_FLASH_LITE_AUDIO_PREVIEW =
    'gemini-2.5-flash-lite-audio-preview';
  export const GEMINI_2_5_FLASH_NATIVE_AUDIO = 'gemini-2.5-flash-native-audio';
  export const GEMINI_2_5_FLASH_NATIVE_AUDIO_OUTPUT =
    'gemini-2.5-flash-native-audio-output';
  export const GEMINI_2_5_FLASH_PREVIEW_TTS = 'gemini-2.5-flash-preview-tts';
  export const GEMINI_2_5_PRO_PREVIEW_TTS = 'gemini-2.5-pro-preview-tts';

  // Gemini 2.0 Series
  export const GEMINI_2_0_FLASH = 'gemini-2.0-flash';
  export const GEMINI_2_0_FLASH_LITE = 'gemini-2.0-flash-lite';
  export const GEMINI_2_0_FLASH_AUDIO = 'gemini-2.0-flash-audio';

  // Gemini 1.5 Series
  export const GEMINI_1_5_FLASH = 'gemini-1.5-flash';
  export const GEMINI_1_5_FLASH_LARGE_CONTEXT =
    'gemini-1.5-flash-large-context';
  export const GEMINI_1_5_FLASH_8B = 'gemini-1.5-flash-8b';
  export const GEMINI_1_5_FLASH_8B_LARGE_CONTEXT =
    'gemini-1.5-flash-8b-large-context';
  export const GEMINI_1_5_PRO = 'gemini-1.5-pro';
  export const GEMINI_1_5_PRO_LARGE_CONTEXT = 'gemini-1.5-pro-large-context';

  // Gemini 1.0 Series
  export const GEMINI_1_0_PRO = 'gemini-1.0-pro';
  export const GEMINI_1_0_PRO_VISION = 'gemini-1.0-pro-vision';

  // Legacy Names
  export const GEMINI_PRO = 'gemini-pro';
  export const GEMINI_PRO_VISION = 'gemini-pro-vision';

  // Gemma Models (Open Source)
  export const GEMMA_3N = 'gemma-3n';
  export const GEMMA_3 = 'gemma-3';
  export const GEMMA_2 = 'gemma-2';
  export const GEMMA = 'gemma';
  export const SHIELDGEMMA_2 = 'shieldgemma-2';
  export const PALIGEMMA = 'paligemma';
  export const CODEGEMMA = 'codegemma';
  export const TXGEMMA = 'txgemma';
  export const MEDGEMMA = 'medgemma';
  export const MEDSIGLIP = 'medsiglip';
  export const T5GEMMA = 't5gemma';

  // Embeddings
  export const TEXT_EMBEDDING_004 = 'text-embedding-004';
  export const MULTIMODAL_EMBEDDINGS = 'multimodal-embeddings';

  // Imagen (Image Generation)
  export const IMAGEN_4_GENERATION = 'imagen-4-generation';
  export const IMAGEN_4_FAST_GENERATION = 'imagen-4-fast-generation';
  export const IMAGEN_4_ULTRA_GENERATION = 'imagen-4-ultra-generation';
  export const IMAGEN_3_GENERATION = 'imagen-3-generation';
  export const IMAGEN_3_EDITING_CUSTOMIZATION =
    'imagen-3-editing-customization';
  export const IMAGEN_3_FAST_GENERATION = 'imagen-3-fast-generation';
  export const IMAGEN_CAPTIONING_VQA = 'imagen-captioning-vqa';

  // Veo (Video Generation)
  export const VEO_2 = 'veo-2';
  export const VEO_3 = 'veo-3';
  export const VEO_3_FAST = 'veo-3-fast';
  export const VEO_3_PREVIEW = 'veo-3-preview';
  export const VEO_3_FAST_PREVIEW = 'veo-3-fast-preview';

  // Preview Models
  export const VIRTUAL_TRY_ON = 'virtual-try-on';
}

// ============================================================================
// AWS BEDROCK MODELS
// ============================================================================

export namespace AWS_BEDROCK {
  // Amazon Nova Models
  export const NOVA_PRO = 'amazon.nova-pro-v1:0';
  export const NOVA_LITE = 'amazon.nova-lite-v1:0';
  export const NOVA_MICRO = 'amazon.nova-micro-v1:0';

  // Anthropic Claude on Bedrock
  export const CLAUDE_SONNET_4_5 = 'anthropic.claude-sonnet-4-5-v1:0';
  export const CLAUDE_HAIKU_4_5 = 'anthropic.claude-haiku-4-5-v1:0';
  export const CLAUDE_OPUS_4_1_20250805 =
    'anthropic.claude-opus-4-1-20250805-v1:0';
  export const CLAUDE_OPUS_4_20250514 = 'anthropic.claude-opus-4-20250514-v1:0';
  export const CLAUDE_SONNET_4_20250514 =
    'anthropic.claude-sonnet-4-20250514-v1:0';
  export const CLAUDE_3_7_SONNET_20250219 =
    'anthropic.claude-3-7-sonnet-20250219-v1:0';
  export const CLAUDE_3_5_SONNET_20241022 =
    'anthropic.claude-3-5-sonnet-20241022-v1:0';
  export const CLAUDE_3_5_SONNET_20240620 =
    'anthropic.claude-3-5-sonnet-20240620-v1:0';
  export const CLAUDE_3_5_HAIKU_20241022 =
    'anthropic.claude-3-5-haiku-20241022-v1:0';
  export const CLAUDE_3_HAIKU_20240307 =
    'anthropic.claude-3-haiku-20240307-v1:0';
  export const CLAUDE_3_OPUS_20240229 = 'anthropic.claude-3-opus-20240229-v1:0';

  // Inference Profiles
  export const US_CLAUDE_3_5_HAIKU_20241022 =
    'us.anthropic.claude-3-5-haiku-20241022-v1:0';

  // Meta Llama Models on Bedrock
  export const LLAMA_3_3_70B_INSTRUCT = 'meta.llama3-3-70b-instruct-v1:0';
  export const LLAMA_3_2_1B_INSTRUCT = 'meta.llama3-2-1b-instruct-v1:0';
  export const LLAMA_3_2_3B_INSTRUCT = 'meta.llama3-2-3b-instruct-v1:0';
  export const LLAMA_3_2_11B_VISION_INSTRUCT =
    'meta.llama3-2-11b-vision-instruct-v1:0';
  export const LLAMA_3_2_90B_VISION_INSTRUCT =
    'meta.llama3-2-90b-vision-instruct-v1:0';
  export const LLAMA_3_1_8B_INSTRUCT = 'meta.llama3-1-8b-instruct-v1:0';
  export const LLAMA_3_1_70B_INSTRUCT = 'meta.llama3-1-70b-instruct-v1:0';
  export const LLAMA_3_1_405B_INSTRUCT = 'meta.llama3-1-405b-instruct-v1:0';

  // Mistral Models on Bedrock
  export const MISTRAL_LARGE_2 = 'mistral.mistral-large-2407-v1:0';
  export const MISTRAL_SMALL = 'mistral.mistral-small-2402-v1:0';

  // Cohere Models on Bedrock
  export const COHERE_COMMAND_R = 'cohere.command-r-v1:0';
  export const COHERE_COMMAND_R_PLUS = 'cohere.command-r-plus-v1:0';
}

// ============================================================================
// XAI (GROK) MODELS
// ============================================================================

export namespace XAI {
  export const GROK_2_1212 = 'grok-2-1212';
  export const GROK_2_VISION_1212 = 'grok-2-vision-1212';
  export const GROK_BETA = 'grok-beta';
  export const GROK_VISION_BETA = 'grok-vision-beta';
}

// ============================================================================
// DEEPSEEK MODELS
// ============================================================================

export namespace DEEPSEEK {
  export const DEEPSEEK_CHAT = 'deepseek-chat';
  export const DEEPSEEK_REASONER = 'deepseek-reasoner';
}

// ============================================================================
// MISTRAL MODELS
// ============================================================================

export namespace MISTRAL {
  export const MISTRAL_LARGE_LATEST = 'mistral-large-latest';
  export const MISTRAL_SMALL_LATEST = 'mistral-small-latest';
  export const CODESTRAL_LATEST = 'codestral-latest';
  export const MINISTRAL_8B_LATEST = 'ministral-8b-latest';
  export const MINISTRAL_3B_LATEST = 'ministral-3b-latest';
  export const PIXTRAL_LARGE_LATEST = 'pixtral-large-latest';
  export const PIXTRAL_12B = 'pixtral-12b-2409';
}

// ============================================================================
// COHERE MODELS
// ============================================================================

export namespace COHERE {
  export const COMMAND_R_PLUS = 'command-r-plus';
  export const COMMAND_R = 'command-r';
  export const COMMAND_R_PLUS_08_2024 = 'command-r-plus-08-2024';
  export const COMMAND_R_08_2024 = 'command-r-08-2024';
  export const COMMAND_LIGHT = 'command-light';
  export const EMBED_ENGLISH_V3 = 'embed-english-v3.0';
  export const EMBED_MULTILINGUAL_V3 = 'embed-multilingual-v3.0';
  export const EMBED_ENGLISH_LIGHT_V3 = 'embed-english-light-v3.0';
  export const EMBED_MULTILINGUAL_LIGHT_V3 = 'embed-multilingual-light-v3.0';
  export const RERANK_ENGLISH_V3 = 'rerank-english-v3.0';
  export const RERANK_MULTILINGUAL_V3 = 'rerank-multilingual-v3.0';
}

// ============================================================================
// GROQ MODELS
// ============================================================================

export namespace GROQ {
  export const LLAMA_3_3_70B_VERSATILE = 'llama-3.3-70b-versatile';
  export const LLAMA_3_1_8B_INSTANT = 'llama-3.1-8b-instant';
  export const LLAMA_3_1_70B_VERSATILE = 'llama-3.1-70b-versatile';
  export const LLAMA_3_2_1B_PREVIEW = 'llama-3.2-1b-preview';
  export const LLAMA_3_2_3B_PREVIEW = 'llama-3.2-3b-preview';
  export const LLAMA_3_2_11B_VISION_PREVIEW = 'llama-3.2-11b-vision-preview';
  export const LLAMA_3_2_90B_VISION_PREVIEW = 'llama-3.2-90b-vision-preview';
  export const MIXTRAL_8X7B_32768 = 'mixtral-8x7b-32768';
  export const GEMMA_2_9B_IT = 'gemma2-9b-it';
  export const GEMMA_7B_IT = 'gemma-7b-it';
}

// ============================================================================
// META MODELS
// ============================================================================

export namespace META {
  export const LLAMA_3_3_70B_INSTRUCT = 'llama-3.3-70b-instruct';
  export const LLAMA_3_2_1B_INSTRUCT = 'llama-3.2-1b-instruct';
  export const LLAMA_3_2_3B_INSTRUCT = 'llama-3.2-3b-instruct';
  export const LLAMA_3_2_11B_VISION_INSTRUCT = 'llama-3.2-11b-vision-instruct';
  export const LLAMA_3_2_90B_VISION_INSTRUCT = 'llama-3.2-90b-vision-instruct';
  export const LLAMA_3_1_8B_INSTRUCT = 'llama-3.1-8b-instruct';
  export const LLAMA_3_1_70B_INSTRUCT = 'llama-3.1-70b-instruct';
  export const LLAMA_3_1_405B_INSTRUCT = 'llama-3.1-405b-instruct';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * All model constant values (for validation)
 */
const ALL_MODEL_VALUES = new Set<string>();

// Collect all model values from namespaces
Object.values(OPENAI).forEach((v) => ALL_MODEL_VALUES.add(v as string));
Object.values(ANTHROPIC).forEach((v) => ALL_MODEL_VALUES.add(v as string));
Object.values(GOOGLE).forEach((v) => ALL_MODEL_VALUES.add(v as string));
Object.values(AWS_BEDROCK).forEach((v) => ALL_MODEL_VALUES.add(v as string));
Object.values(XAI).forEach((v) => ALL_MODEL_VALUES.add(v as string));
Object.values(DEEPSEEK).forEach((v) => ALL_MODEL_VALUES.add(v as string));
Object.values(MISTRAL).forEach((v) => ALL_MODEL_VALUES.add(v as string));
Object.values(COHERE).forEach((v) => ALL_MODEL_VALUES.add(v as string));
Object.values(GROQ).forEach((v) => ALL_MODEL_VALUES.add(v as string));
Object.values(META).forEach((v) => ALL_MODEL_VALUES.add(v as string));

/**
 * Check if a string is a known model constant value
 * @param value - The model string to check
 * @returns true if the value matches a known model constant
 */
export function isModelConstant(value: string): boolean {
  return ALL_MODEL_VALUES.has(value);
}

/**
 * Get all available model constants as an array
 * @returns Array of all model constant values
 */
export function getAllModelConstants(): string[] {
  return Array.from(ALL_MODEL_VALUES);
}

/**
 * Get provider name from model ID
 * @param modelId - The model ID to check
 * @returns Provider name or 'unknown'
 */
export function getProviderFromModel(modelId: string): string {
  const openaiModels = Object.values(OPENAI) as string[];
  const anthropicModels = Object.values(ANTHROPIC) as string[];
  const googleModels = Object.values(GOOGLE) as string[];
  const bedrockModels = Object.values(AWS_BEDROCK) as string[];
  const xaiModels = Object.values(XAI) as string[];
  const deepseekModels = Object.values(DEEPSEEK) as string[];
  const mistralModels = Object.values(MISTRAL) as string[];
  const cohereModels = Object.values(COHERE) as string[];
  const groqModels = Object.values(GROQ) as string[];
  const metaModels = Object.values(META) as string[];

  if (openaiModels.includes(modelId)) return 'OpenAI';
  if (anthropicModels.includes(modelId)) return 'Anthropic';
  if (googleModels.includes(modelId)) return 'Google';
  if (bedrockModels.includes(modelId)) return 'AWS Bedrock';
  if (xaiModels.includes(modelId)) return 'xAI';
  if (deepseekModels.includes(modelId)) return 'DeepSeek';
  if (mistralModels.includes(modelId)) return 'Mistral AI';
  if (cohereModels.includes(modelId)) return 'Cohere';
  if (groqModels.includes(modelId)) return 'Groq';
  if (metaModels.includes(modelId)) return 'Meta';

  return 'unknown';
}

// ============================================================================
// CLI-SPECIFIC HELPERS
// ============================================================================

export const DEFAULT_MODEL = OPENAI.GPT_4;

export const POPULAR_MODELS = {
  FASTEST: OPENAI.GPT_3_5_TURBO,
  CHEAPEST: OPENAI.GPT_3_5_TURBO,
  BALANCED: OPENAI.GPT_4,
  SMARTEST: OPENAI.GPT_4,
};

/**
 * Get model constant value from string (for backward compatibility)
 */
export function getModelValue(model: string): string {
  return model; // Already a string value
}
