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
 * const model = OPENAI.GPT_4O;
 * ```
 */

// ============================================================================
// OPENAI MODELS
// ============================================================================

export namespace OPENAI {
  // GPT-5.2 Series (Latest)
  export const GPT_5_2 = 'gpt-5.2';
  export const GPT_5_2_PRO = 'gpt-5.2-pro';
  export const GPT_5_2_CODEX = 'gpt-5.2-codex';
  export const GPT_5_2_CHAT_LATEST = 'gpt-5.2-chat-latest';

  // GPT-4.1 Series
  export const GPT_4_1 = 'gpt-4.1';
  export const GPT_4_1_MINI = 'gpt-4.1-mini';

  // O-Series Models (Reasoning Models)
  export const O1 = 'o1';
  export const O1_MINI = 'o1-mini';
  export const O1_PREVIEW = 'o1-preview';

  // GPT-4o Series (Latest Flagship)
  export const GPT_4O = 'gpt-4o';
  export const GPT_4O_2024_11_20 = 'gpt-4o-2024-11-20';
  export const GPT_4O_2024_08_06 = 'gpt-4o-2024-08-06';
  export const GPT_4O_2024_05_13 = 'gpt-4o-2024-05-13';
  export const GPT_4O_MINI = 'gpt-4o-mini';
  export const GPT_4O_MINI_2024_07_18 = 'gpt-4o-mini-2024-07-18';
  export const GPT_4O_AUDIO_PREVIEW = 'gpt-4o-audio-preview';
  export const GPT_4O_AUDIO_PREVIEW_2024_10_01 =
    'gpt-4o-audio-preview-2024-10-01';
  export const GPT_4O_REALTIME_PREVIEW = 'gpt-4o-realtime-preview';
  export const GPT_4O_REALTIME_PREVIEW_2024_10_01 =
    'gpt-4o-realtime-preview-2024-10-01';

  // GPT-4 Series
  export const GPT_4 = 'gpt-4';
  export const GPT_4_0613 = 'gpt-4-0613';
  export const GPT_4_0314 = 'gpt-4-0314';
  export const GPT_4_TURBO = 'gpt-4-turbo';
  export const GPT_4_TURBO_2024_04_09 = 'gpt-4-turbo-2024-04-09';
  export const GPT_4_TURBO_PREVIEW = 'gpt-4-turbo-preview';
  export const GPT_4_1106_PREVIEW = 'gpt-4-1106-preview';
  export const GPT_4_0125_PREVIEW = 'gpt-4-0125-preview';
  export const GPT_4_VISION_PREVIEW = 'gpt-4-vision-preview';
  export const GPT_4_1106_VISION_PREVIEW = 'gpt-4-1106-vision-preview';

  // GPT-3.5 Series
  export const GPT_3_5_TURBO = 'gpt-3.5-turbo';
  export const GPT_3_5_TURBO_0125 = 'gpt-3.5-turbo-0125';
  export const GPT_3_5_TURBO_1106 = 'gpt-3.5-turbo-1106';
  export const GPT_3_5_TURBO_0613 = 'gpt-3.5-turbo-0613';
  export const GPT_3_5_TURBO_16K = 'gpt-3.5-turbo-16k';
  export const GPT_3_5_TURBO_16K_0613 = 'gpt-3.5-turbo-16k-0613';
  export const GPT_3_5_TURBO_INSTRUCT = 'gpt-3.5-turbo-instruct';

  // Image Generation
  export const DALL_E_3 = 'dall-e-3';
  export const DALL_E_2 = 'dall-e-2';

  // Audio Models
  export const WHISPER_1 = 'whisper-1';
  export const TTS_1 = 'tts-1';
  export const TTS_1_HD = 'tts-1-hd';
  export const GPT_REALTIME = 'gpt-realtime';
  export const GPT_REALTIME_MINI = 'gpt-realtime-mini';
  export const GPT_AUDIO = 'gpt-audio';
  export const GPT_AUDIO_MINI = 'gpt-audio-mini';

  // Transcription Models
  export const GPT_4O_TRANSCRIBE = 'gpt-4o-transcribe';
  export const GPT_4O_TRANSCRIBE_DIARIZE = 'gpt-4o-transcribe-diarize';

  // Embeddings
  export const TEXT_EMBEDDING_3_SMALL = 'text-embedding-3-small';
  export const TEXT_EMBEDDING_3_LARGE = 'text-embedding-3-large';
  export const TEXT_EMBEDDING_ADA_002 = 'text-embedding-ada-002';

  // Moderation
  export const TEXT_MODERATION_LATEST = 'text-moderation-latest';
  export const TEXT_MODERATION_STABLE = 'text-moderation-stable';
  export const OMNI_MODERATION_LATEST = 'omni-moderation-latest';

  // Search Models
  export const GPT_4O_MINI_SEARCH_PREVIEW_2025_03_11 =
    'gpt-4o-mini-search-preview-2025-03-11';
  export const GPT_4O_SEARCH_PREVIEW_2025_03_11 =
    'gpt-4o-search-preview-2025-03-11';

  // Computer Use
  export const COMPUTER_USE_PREVIEW_2025_03_11 =
    'computer-use-preview-2025-03-11';

  // Open-Weight Models
  export const GPT_OSS_120B = 'gpt-oss-120b';
  export const GPT_OSS_20B = 'gpt-oss-20b';

  // Specialized Models
  export const CODEX_MINI_LATEST = 'codex-mini-latest';

  // ChatGPT Models
  export const CHATGPT_4O_LATEST = 'chatgpt-4o-latest';

  // Legacy Models (Deprecated)
  export const GPT_4_32K = 'gpt-4-32k';
  export const GPT_4_32K_0613 = 'gpt-4-32k-0613';
  export const GPT_4_32K_0314 = 'gpt-4-32k-0314';
  export const BABBAGE_002 = 'babbage-002';
  export const DAVINCI_002 = 'davinci-002';
}

// ============================================================================
// ANTHROPIC MODELS
// ============================================================================

export namespace ANTHROPIC {
  // Claude 4.6 Series (Latest)
  export const CLAUDE_OPUS_4_6 = 'claude-opus-4-6';
  export const CLAUDE_OPUS_4_6_V1 = 'claude-opus-4-6-v1';

  // Claude 4.5 Series (Latest)
  export const CLAUDE_SONNET_4_5_20250929 = 'claude-sonnet-4-5-20250929';
  export const CLAUDE_SONNET_4_5 = 'claude-sonnet-4-5';
  export const CLAUDE_HAIKU_4_5_20251001 = 'claude-haiku-4-5-20251001';
  export const CLAUDE_HAIKU_4_5 = 'claude-haiku-4-5';
  export const CLAUDE_OPUS_4_5_20251101 = 'claude-opus-4-5-20251101';
  export const CLAUDE_OPUS_4_5 = 'claude-opus-4-5';

  // Claude 4 Series (Legacy)
  export const CLAUDE_OPUS_4_1_20250805 = 'claude-opus-4-1-20250805';
  export const CLAUDE_OPUS_4_20250514 = 'claude-opus-4-20250514';
  export const CLAUDE_SONNET_4_20250514 = 'claude-sonnet-4-20250514';

  // Claude 3.7 Series (Deprecated)
  export const CLAUDE_3_7_SONNET_20250219 = 'claude-3-7-sonnet-20250219';

  // Claude 3.5 Series
  export const CLAUDE_3_5_SONNET_20241022 = 'claude-3-5-sonnet-20241022';
  export const CLAUDE_3_5_SONNET_20240620 = 'claude-3-5-sonnet-20240620';
  export const CLAUDE_3_5_HAIKU_20241022 = 'claude-3-5-haiku-20241022';

  // Claude 3 Series (Legacy)
  export const CLAUDE_3_OPUS_20240229 = 'claude-3-opus-20240229';
  export const CLAUDE_3_SONNET_20240229 = 'claude-3-sonnet-20240229';
  export const CLAUDE_3_HAIKU_20240307 = 'claude-3-haiku-20240307';

  // Legacy Models
  export const CLAUDE_2_1 = 'claude-2.1';
  export const CLAUDE_2_0 = 'claude-2.0';
  export const CLAUDE_INSTANT_1_2 = 'claude-instant-1.2';
}

// ============================================================================
// GOOGLE (GEMINI) MODELS
// ============================================================================

export namespace GOOGLE {
  // Gemini 2.5 Series (Latest)
  export const GEMINI_2_5_PRO = 'gemini-2.5-pro';
  export const GEMINI_2_5_PRO_COMPUTER_USE_PREVIEW =
    'gemini-2.5-pro-computer-use-preview';
  export const GEMINI_2_5_FLASH = 'gemini-2.5-flash';
  export const GEMINI_2_5_FLASH_LITE_PREVIEW = 'gemini-2.5-flash-lite-preview';
  export const GEMINI_2_5_FLASH_PREVIEW_09_2025 =
    'gemini-2.5-flash-preview-09-2025';
  export const GEMINI_2_5_FLASH_LITE_AUDIO_PREVIEW =
    'gemini-2.5-flash-lite-audio-preview';
  export const GEMINI_2_5_FLASH_NATIVE_AUDIO = 'gemini-2.5-flash-native-audio';
  export const GEMINI_2_5_FLASH_NATIVE_AUDIO_OUTPUT =
    'gemini-2.5-flash-native-audio-output';
  export const GEMINI_2_5_FLASH_PREVIEW_TTS = 'gemini-2.5-flash-preview-tts';
  export const GEMINI_2_5_PRO_PREVIEW_TTS = 'gemini-2.5-pro-preview-tts';

  // Gemini 2.0 Series
  export const GEMINI_2_0_FLASH = 'gemini-2.0-flash';
  export const GEMINI_2_0_FLASH_IMAGE_GENERATION =
    'gemini-2.0-flash-image-generation';
  export const GEMINI_2_0_FLASH_LITE = 'gemini-2.0-flash-lite';
  export const GEMINI_2_0_FLASH_AUDIO = 'gemini-2.0-flash-audio';

  // Gemini 1.5 Series
  export const GEMINI_1_5_PRO = 'gemini-1.5-pro';
  export const GEMINI_1_5_PRO_LATEST = 'gemini-1.5-pro-latest';
  export const GEMINI_1_5_PRO_001 = 'gemini-1.5-pro-001';
  export const GEMINI_1_5_PRO_002 = 'gemini-1.5-pro-002';
  export const GEMINI_1_5_FLASH = 'gemini-1.5-flash';
  export const GEMINI_1_5_FLASH_LATEST = 'gemini-1.5-flash-latest';
  export const GEMINI_1_5_FLASH_001 = 'gemini-1.5-flash-001';
  export const GEMINI_1_5_FLASH_002 = 'gemini-1.5-flash-002';
  export const GEMINI_1_5_FLASH_LARGE_CONTEXT =
    'gemini-1.5-flash-large-context';
  export const GEMINI_1_5_FLASH_8B = 'gemini-1.5-flash-8b';
  export const GEMINI_1_5_FLASH_8B_LATEST = 'gemini-1.5-flash-8b-latest';
  export const GEMINI_1_5_FLASH_8B_LARGE_CONTEXT =
    'gemini-1.5-flash-8b-large-context';

  // Gemini 1.0 Series (Legacy)
  export const GEMINI_1_0_PRO = 'gemini-1.0-pro';
  export const GEMINI_1_0_PRO_LATEST = 'gemini-1.0-pro-latest';
  export const GEMINI_1_0_PRO_001 = 'gemini-1.0-pro-001';
  export const GEMINI_1_0_PRO_VISION_LATEST = 'gemini-1.0-pro-vision-latest';
  export const GEMINI_1_0_PRO_VISION = 'gemini-1.0-pro-vision';

  // Legacy Names (for compatibility)
  export const GEMINI_PRO = 'gemini-pro';
  export const GEMINI_PRO_VISION = 'gemini-pro-vision';

  // Embeddings
  export const TEXT_EMBEDDING_004 = 'text-embedding-004';
  export const TEXT_EMBEDDING_GECKO_001 = 'text-embedding-gecko@001';
  export const TEXT_EMBEDDING_GECKO_002 = 'text-embedding-gecko@002';
  export const TEXT_EMBEDDING_GECKO_003 = 'text-embedding-gecko@003';
  export const TEXT_MULTILINGUAL_EMBEDDING_002 =
    'text-multilingual-embedding@002';
  export const MULTIMODAL_EMBEDDINGS = 'multimodal-embeddings';

  // Imagen Models (Image Generation)
  export const IMAGEN_4_GENERATION = 'imagen-4-generation';
  export const IMAGEN_4_FAST_GENERATION = 'imagen-4-fast-generation';
  export const IMAGEN_1_GENERATION = 'imagen-1-generation';
  export const IMAGEN_1_EDITING = 'imagen-1-editing';
  export const IMAGEN_1_UPSCALING = 'imagen-1-upscaling';
  export const IMAGEN_VISUAL_CAPTIONING = 'imagen-visual-captioning';
  export const IMAGEN_VISUAL_QA = 'imagen-visual-qa';

  // Veo Models (Video Generation)
  export const VEO_2 = 'veo-2';
  export const VEO_2_ADVANCED_CONTROLS = 'veo-2-advanced-controls';
  export const VEO_3_PREVIEW = 'veo-3-preview';
  export const VEO_3_FAST_PREVIEW = 'veo-3-fast-preview';
  export const VEO_3_1_VIDEO_720P_1080P = 'veo-3.1-video-720p-1080p';
  export const VEO_3_1_VIDEO_4K = 'veo-3.1-video-4k';
  export const VEO_3_1_FAST_VIDEO_AUDIO_720P_1080P =
    'veo-3.1-fast-video-audio-720p-1080p';
  export const VEO_3_1_FAST_VIDEO_AUDIO_4K = 'veo-3.1-fast-video-audio-4k';

  // Lyria Models (Music Generation)
  export const LYRIA_2 = 'lyria-2';

  // Preview Models
  export const VIRTUAL_TRY_ON = 'virtual-try-on';
}

// ============================================================================
// AWS BEDROCK MODELS
// ============================================================================

export namespace AWS_BEDROCK {
  // Amazon Titan Models
  export const TITAN_TEXT_G1_LITE = 'amazon.titan-text-lite-v1';
  export const TITAN_TEXT_G1_EXPRESS = 'amazon.titan-text-express-v1';
  export const TITAN_EMBED_TEXT_V1 = 'amazon.titan-embed-text-v1';
  export const TITAN_EMBED_TEXT_V2 = 'amazon.titan-embed-text-v2:0';
  export const TITAN_IMAGE_GENERATOR_G1 = 'amazon.titan-image-generator-v1';

  // Anthropic Claude on Bedrock
  export const CLAUDE_3_5_SONNET_20241022 =
    'anthropic.claude-3-5-sonnet-20241022-v2:0';
  export const CLAUDE_3_5_SONNET_20240620 =
    'anthropic.claude-3-5-sonnet-20240620-v1:0';
  export const CLAUDE_3_5_HAIKU_20241022 =
    'anthropic.claude-3-5-haiku-20241022-v1:0';
  export const CLAUDE_3_OPUS_20240229 = 'anthropic.claude-3-opus-20240229-v1:0';
  export const CLAUDE_3_SONNET_20240229 =
    'anthropic.claude-3-sonnet-20240229-v1:0';
  export const CLAUDE_3_HAIKU_20240307 =
    'anthropic.claude-3-haiku-20240307-v1:0';
  export const CLAUDE_2_1 = 'anthropic.claude-v2:1';
  export const CLAUDE_2_0 = 'anthropic.claude-v2';
  export const CLAUDE_INSTANT_1_2 = 'anthropic.claude-instant-v1';

  // Claude 4 Series
  export const CLAUDE_OPUS_4_6 = 'anthropic.claude-opus-4-6-v1';
  export const CLAUDE_SONNET_4_5 = 'anthropic.claude-sonnet-4-5-v1:0';
  export const CLAUDE_HAIKU_4_5 = 'anthropic.claude-haiku-4-5-v1:0';
  export const CLAUDE_SONNET_4_20250514 =
    'anthropic.claude-sonnet-4-20250514-v1:0';
  export const CLAUDE_OPUS_4_20250514 = 'anthropic.claude-opus-4-20250514-v1:0';
  export const CLAUDE_OPUS_4_1_20250805 =
    'anthropic.claude-opus-4-1-20250805-v1:0';

  // Global Inference Profile versions
  export const CLAUDE_SONNET_4_5_GLOBAL =
    'global.anthropic.claude-sonnet-4-5-20250929-v1:0';
  export const CLAUDE_SONNET_4_GLOBAL =
    'global.anthropic.claude-sonnet-4-20250514-v1:0';
  export const CLAUDE_HAIKU_4_5_GLOBAL =
    'global.anthropic.claude-haiku-4-5-20251001-v1:0';
  export const CLAUDE_OPUS_4_5_GLOBAL =
    'global.anthropic.claude-opus-4-5-20250514-v1:0';

  // Meta Llama Models on Bedrock
  export const LLAMA_3_2_1B_INSTRUCT = 'meta.llama3-2-1b-instruct-v1:0';
  export const LLAMA_3_2_3B_INSTRUCT = 'meta.llama3-2-3b-instruct-v1:0';
  export const LLAMA_3_2_11B_INSTRUCT = 'meta.llama3-2-11b-instruct-v1:0';
  export const LLAMA_3_2_90B_INSTRUCT = 'meta.llama3-2-90b-instruct-v1:0';
  export const LLAMA_3_1_8B_INSTRUCT = 'meta.llama3-1-8b-instruct-v1:0';
  export const LLAMA_3_1_70B_INSTRUCT = 'meta.llama3-1-70b-instruct-v1:0';
  export const LLAMA_3_1_405B_INSTRUCT = 'meta.llama3-1-405b-instruct-v1:0';
  export const LLAMA_2_13B_CHAT = 'meta.llama2-13b-chat-v1';
  export const LLAMA_2_70B_CHAT = 'meta.llama2-70b-chat-v1';

  // Mistral Models on Bedrock
  export const MISTRAL_7B_INSTRUCT = 'mistral.mistral-7b-instruct-v0:2';
  export const MIXTRAL_8X7B_INSTRUCT = 'mistral.mixtral-8x7b-instruct-v0:1';
  export const MISTRAL_LARGE_2402 = 'mistral.mistral-large-2402-v1:0';
  export const MISTRAL_LARGE_2407 = 'mistral.mistral-large-2407-v1:0';
  export const MISTRAL_LARGE_3 = 'mistral.mistral-large-3-v1:0';
  export const MISTRAL_SMALL_2402 = 'mistral.mistral-small-2402-v1:0';
  export const MINISTRAL_3B_3_0 = 'mistral.ministral-3b-3-0-v1:0';
  export const MINISTRAL_8B_3_0 = 'mistral.ministral-8b-3-0-v1:0';
  export const MINISTRAL_14B_3_0 = 'mistral.ministral-14b-3-0-v1:0';
  export const PIXTRAL_LARGE_2502 = 'mistral.pixtral-large-2502-v1:0';
  export const MAGISTRAL_SMALL_1_2 = 'mistral.magistral-small-1-2-v1:0';
  export const VOXTRAL_MINI_1_0 = 'mistral.voxtral-mini-1-0-v1:0';
  export const VOXTRAL_SMALL_1_0 = 'mistral.voxtral-small-1-0-v1:0';

  // Cohere Models on Bedrock
  export const COHERE_COMMAND_TEXT_14 = 'cohere.command-text-v14';
  export const COHERE_COMMAND_LIGHT_TEXT_14 = 'cohere.command-light-text-v14';
  export const COHERE_COMMAND_R = 'cohere.command-r-v1:0';
  export const COHERE_COMMAND_R_PLUS = 'cohere.command-r-plus-v1:0';
  export const COHERE_EMBED_ENGLISH_V3 = 'cohere.embed-english-v3';
  export const COHERE_EMBED_MULTILINGUAL_V3 = 'cohere.embed-multilingual-v3';

  // AI21 Labs Models on Bedrock
  export const JURASSIC_2_MID = 'ai21.j2-mid-v1';
  export const JURASSIC_2_ULTRA = 'ai21.j2-ultra-v1';
  export const JAMBA_INSTRUCT = 'ai21.jamba-instruct-v1:0';

  // Stability AI Models on Bedrock
  export const STABLE_DIFFUSION_XL_V1 = 'stability.stable-diffusion-xl-v1:0';
  export const STABLE_DIFFUSION_XL_V0 = 'stability.stable-diffusion-xl-v0';
  export const STABLE_IMAGE_STYLE_GUIDE =
    'stability.stable-image-style-guide-v1:0';
  export const STABLE_IMAGE_SEARCH_AND_REPLACE =
    'stability.stable-image-search-and-replace-v1:0';
  export const STABLE_IMAGE_INPAINT = 'stability.stable-image-inpaint-v1:0';
  export const STABLE_IMAGE_SEARCH_AND_RECOLOR =
    'stability.stable-image-search-and-recolor-v1:0';

  // Google Gemma Models on Bedrock
  export const GEMMA_3_4B = 'google.gemma-3-4b-v1:0';
  export const GEMMA_3_12B = 'google.gemma-3-12b-v1:0';

  // TwelveLabs Models on Bedrock
  export const MARENGO_EMBED_2_7 = 'twelvelabs.marengo-embed-2-7-v1:0';
  export const MARENGO_EMBED_3_0 = 'twelvelabs.marengo-embed-3-0-v1:0';

  // Writer Models on Bedrock
  export const PALMYRA_X4 = 'writer.palmyra-x4-v1:0';

  // Qwen Models on Bedrock
  export const QWEN3_32B = 'qwen.qwen3-32b-v1:0';
}

// ============================================================================
// XAI (GROK) MODELS
// ============================================================================

export namespace XAI {
  // === Grok 4.1 Fast Series (Latest) ===
  export const GROK_4_1_FAST_REASONING = 'grok-4-1-fast-reasoning';
  export const GROK_4_1_FAST_NON_REASONING = 'grok-4-1-fast-non-reasoning';

  // === Grok 4 Fast Series ===
  export const GROK_4_FAST_REASONING = 'grok-4-fast-reasoning';
  export const GROK_4_FAST_NON_REASONING = 'grok-4-fast-non-reasoning';
  export const GROK_CODE_FAST_1 = 'grok-code-fast-1';

  // === Grok 4 Series ===
  export const GROK_4_0709 = 'grok-4-0709';
  export const GROK_4 = 'grok-4';
  export const GROK_4_LATEST = 'grok-4-latest';

  // === Grok 3 Series ===
  export const GROK_3 = 'grok-3';
  export const GROK_3_MINI = 'grok-3-mini';

  // === Grok 2 Vision Series ===
  export const GROK_2_VISION_1212 = 'grok-2-vision-1212';
  export const GROK_2_VISION_1212_US_EAST_1 = 'grok-2-vision-1212-us-east-1';
  export const GROK_2_VISION_1212_EU_WEST_1 = 'grok-2-vision-1212-eu-west-1';

  // === Grok 2 Image Generation ===
  export const GROK_2_IMAGE_1212 = 'grok-2-image-1212';
  export const GROK_2_IMAGE = 'grok-2-image';
  export const GROK_2_IMAGE_LATEST = 'grok-2-image-latest';

  // === Legacy Models ===
  export const GROK_BETA = 'grok-beta';
  export const GROK_VISION_BETA = 'grok-vision-beta';
}

// ============================================================================
// DEEPSEEK MODELS
// ============================================================================

export namespace DEEPSEEK {
  // === Latest Models ===
  export const DEEPSEEK_CHAT = 'deepseek-chat';
  export const DEEPSEEK_CHAT_CACHED = 'deepseek-chat-cached';
  export const DEEPSEEK_REASONER = 'deepseek-reasoner';
  export const DEEPSEEK_REASONER_CACHED = 'deepseek-reasoner-cached';

  // === Off-Peak Pricing Models ===
  export const DEEPSEEK_CHAT_OFFPEAK = 'deepseek-chat-offpeak';
  export const DEEPSEEK_CHAT_CACHED_OFFPEAK = 'deepseek-chat-cached-offpeak';
  export const DEEPSEEK_REASONER_OFFPEAK = 'deepseek-reasoner-offpeak';
  export const DEEPSEEK_REASONER_CACHED_OFFPEAK =
    'deepseek-reasoner-cached-offpeak';

  // === Legacy Models ===
  export const DEEPSEEK_CODER = 'deepseek-coder';
}

// ============================================================================
// MISTRAL MODELS
// ============================================================================

export namespace MISTRAL {
  // === Premier Models ===
  export const MISTRAL_MEDIUM_2508 = 'mistral-medium-2508';
  export const MISTRAL_MEDIUM_LATEST = 'mistral-medium-latest';
  export const MAGISTRAL_MEDIUM_2509 = 'magistral-medium-2509';
  export const MAGISTRAL_MEDIUM_LATEST = 'magistral-medium-latest';
  export const MAGISTRAL_MEDIUM_2507 = 'magistral-medium-2507';
  export const CODESTRAL_2508 = 'codestral-2508';
  export const CODESTRAL_LATEST = 'codestral-latest';
  export const VOXTRAL_MINI_2507 = 'voxtral-mini-2507';
  export const VOXTRAL_MINI_LATEST = 'voxtral-mini-latest';
  export const DEVSTRAL_MEDIUM_2507 = 'devstral-medium-2507';
  export const DEVSTRAL_MEDIUM_LATEST = 'devstral-medium-latest';
  export const MISTRAL_OCR_2505 = 'mistral-ocr-2505';
  export const MISTRAL_LARGE_2411 = 'mistral-large-2411';
  export const MISTRAL_LARGE_LATEST = 'mistral-large-latest';
  export const PIXTRAL_LARGE_2411 = 'pixtral-large-2411';
  export const PIXTRAL_LARGE_LATEST = 'pixtral-large-latest';

  // === Open Models ===
  export const MAGISTRAL_SMALL_2509 = 'magistral-small-2509';
  export const MAGISTRAL_SMALL_LATEST = 'magistral-small-latest';
  export const MAGISTRAL_SMALL_2507 = 'magistral-small-2507';
  export const VOXTRAL_SMALL_2507 = 'voxtral-small-2507';
  export const VOXTRAL_SMALL_LATEST = 'voxtral-small-latest';
  export const VOXTRAL_MINI_2507_TRANSCRIBE = 'voxtral-mini-2507';
  export const VOXTRAL_MINI_LATEST_TRANSCRIBE = 'voxtral-mini-latest';
  export const MISTRAL_SMALL_2506 = 'mistral-small-2506';
  export const MISTRAL_SMALL_2503 = 'mistral-small-2503';
  export const MISTRAL_SMALL_2501 = 'mistral-small-2501';
  export const MISTRAL_SMALL_3_0 = 'mistral-small-3.0';
  export const MISTRAL_SMALL_LATEST = 'mistral-small-latest';
  export const DEVSTRAL_SMALL_LATEST = 'devstral-small-latest';
  export const DEVSTRAL_SMALL_2505 = 'devstral-small-2505';
  export const PIXTRAL_12B_2409 = 'pixtral-12b-2409';
  export const PIXTRAL_12B = 'pixtral-12b';
  export const MISTRAL_NEMO = 'mistral-nemo';
  export const OPEN_MISTRAL_NEMO_2407 = 'open-mistral-nemo-2407';
  export const OPEN_MISTRAL_NEMO = 'open-mistral-nemo';
  export const OPEN_MISTRAL_7B = 'open-mistral-7b';
  export const MISTRAL_SMALL_2409 = 'mistral-small-2409';
  export const MISTRAL_SMALL_2407 = 'mistral-small-2407';
  export const MISTRAL_EMBED = 'mistral-embed';
  export const CODESTRAL_EMBED_2505 = 'codestral-embed-2505';
  export const MISTRAL_MODERATION_2411 = 'mistral-moderation-2411';
  export const MISTRAL_MODERATION_LATEST = 'mistral-moderation-latest';
}

// ============================================================================
// COHERE MODELS
// ============================================================================

export namespace COHERE {
  // === Latest Models ===
  export const COMMAND_A_03_2025 = 'command-a-03-2025';
  export const COMMAND_R7B_12_2024 = 'command-r7b-12-2024';
  export const COMMAND_A_REASONING_08_2025 = 'command-a-reasoning-08-2025';
  export const COMMAND_A_VISION_07_2025 = 'command-a-vision-07-2025';

  // === Aya Models ===
  export const C4AI_AYA_EXPANSE_8B = 'c4ai-aya-expanse-8b';
  export const C4AI_AYA_EXPANSE_32B = 'c4ai-aya-expanse-32b';
  export const C4AI_AYA_VISION_8B = 'c4ai-aya-vision-8b';
  export const C4AI_AYA_VISION_32B = 'c4ai-aya-vision-32b';

  // === Command R Series ===
  export const COMMAND_R_PLUS_04_2024 = 'command-r-plus-04-2024';
  export const COMMAND_R_08_2024 = 'command-r-08-2024';
  export const COMMAND_R_03_2024 = 'command-r-03-2024';
  export const COMMAND = 'command';
  export const COMMAND_NIGHTLY = 'command-nightly';
  export const COMMAND_LIGHT = 'command-light';
  export const COMMAND_LIGHT_NIGHTLY = 'command-light-nightly';

  // === Embedding Models ===
  export const EMBED_V4_0 = 'embed-v4.0';
  export const EMBED_ENGLISH_V3_0 = 'embed-english-v3.0';
  export const EMBED_ENGLISH_LIGHT_V3_0 = 'embed-english-light-v3.0';
  export const EMBED_MULTILINGUAL_V3_0 = 'embed-multilingual-v3.0';
  export const EMBED_MULTILINGUAL_LIGHT_V3_0 = 'embed-multilingual-light-v3.0';

  // === Rerank Models ===
  export const RERANK_V3_5 = 'rerank-v3.5';
  export const RERANK_ENGLISH_V3_0 = 'rerank-english-v3.0';
  export const RERANK_MULTILINGUAL_V3_0 = 'rerank-multilingual-v3.0';

  // === AWS Bedrock Models ===
  export const COMMAND_R_PLUS_BEDROCK = 'cohere.command-r-plus-v1:0';
  export const COMMAND_R_BEDROCK = 'cohere.command-r-v1:0';
  export const EMBED_ENGLISH_V3_BEDROCK = 'cohere.embed-english-v3';
  export const EMBED_MULTILINGUAL_V3_BEDROCK = 'cohere.embed-multilingual-v3';
}

// ============================================================================
// META MODELS (Direct API)
// ============================================================================

export namespace META {
  // === Llama 4 Series (Latest) ===
  export const LLAMA_4_SCOUT = 'llama-4-scout';
  export const LLAMA_4_MAVERICK = 'llama-4-maverick';
  export const LLAMA_4_BEHEMOTH_PREVIEW = 'llama-4-behemoth-preview';

  // === Llama 3.3 Series ===
  export const LLAMA_3_3_70B = 'llama-3.3-70b';

  // === Llama 3.2 Series ===
  export const LLAMA_3_2_11B = 'llama-3.2-11b';
  export const LLAMA_3_2_90B = 'llama-3.2-90b';
  export const LLAMA_3_2_3B = 'llama-3.2-3b';
  export const LLAMA_3_2_1B = 'llama-3.2-1b';

  // === Llama 3.1 Series ===
  export const LLAMA_3_1_405B = 'llama-3.1-405b';
  export const LLAMA_3_1_8B = 'llama-3.1-8b';

  // === Llama 3 Series (Legacy) ===
  export const LLAMA_3_70B = 'llama-3-70b';
  export const LLAMA_3_8B = 'llama-3-8b';
}

// ============================================================================
// PERPLEXITY MODELS
// ============================================================================

export namespace PERPLEXITY {
  export const LLAMA_3_1_SONAR_SMALL_128K_ONLINE =
    'llama-3.1-sonar-small-128k-online';
  export const LLAMA_3_1_SONAR_LARGE_128K_ONLINE =
    'llama-3.1-sonar-large-128k-online';
  export const LLAMA_3_1_SONAR_HUGE_128K_ONLINE =
    'llama-3.1-sonar-huge-128k-online';
  export const LLAMA_3_1_SONAR_SMALL_128K_CHAT =
    'llama-3.1-sonar-small-128k-chat';
  export const LLAMA_3_1_SONAR_LARGE_128K_CHAT =
    'llama-3.1-sonar-large-128k-chat';
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
Object.values(META).forEach((v) => ALL_MODEL_VALUES.add(v as string));
Object.values(PERPLEXITY).forEach((v) => ALL_MODEL_VALUES.add(v as string));

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
  const metaModels = Object.values(META) as string[];
  const perplexityModels = Object.values(PERPLEXITY) as string[];

  if (openaiModels.includes(modelId)) return 'OpenAI';
  if (anthropicModels.includes(modelId)) return 'Anthropic';
  if (googleModels.includes(modelId)) return 'Google';
  if (bedrockModels.includes(modelId)) return 'AWS Bedrock';
  if (xaiModels.includes(modelId)) return 'xAI';
  if (deepseekModels.includes(modelId)) return 'DeepSeek';
  if (mistralModels.includes(modelId)) return 'Mistral AI';
  if (cohereModels.includes(modelId)) return 'Cohere';
  if (metaModels.includes(modelId)) return 'Meta';
  if (perplexityModels.includes(modelId)) return 'Perplexity';

  return 'unknown';
}

// ============================================================================
// CLI-SPECIFIC HELPERS
// ============================================================================

export const DEFAULT_MODEL = OPENAI.GPT_4O;

export const POPULAR_MODELS = {
  FASTEST: OPENAI.GPT_4O_MINI,
  CHEAPEST: OPENAI.GPT_4O_MINI,
  BALANCED: OPENAI.GPT_4O,
  SMARTEST: OPENAI.O1,
};

/**
 * Get model constant value from string (for backward compatibility)
 */
export function getModelValue(model: string): string {
  return model; // Already a string value
}
