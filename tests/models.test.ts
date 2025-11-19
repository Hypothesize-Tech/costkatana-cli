import {
  OPENAI,
  ANTHROPIC,
  GOOGLE,
  AWS_BEDROCK,
  XAI,
  DEEPSEEK,
  MISTRAL,
  COHERE,
  GROQ,
  META,
  isModelConstant,
  getAllModelConstants,
  getProviderFromModel,
} from '../src/constants/models';

describe('Model Constants', () => {
  describe('OPENAI', () => {
    test('should have GPT-4 constant', () => {
      expect(OPENAI.GPT_4).toBe('gpt-4');
    });

    test('should have GPT-3.5 Turbo constant', () => {
      expect(OPENAI.GPT_3_5_TURBO).toBe('gpt-3.5-turbo');
    });

    test('should have GPT-4 Turbo constant', () => {
      expect(OPENAI.GPT_4_TURBO).toBe('gpt-4-turbo');
    });

    test('should have GPT-4o constant', () => {
      expect(OPENAI.GPT_4O).toBe('gpt-4o');
    });
  });

  describe('ANTHROPIC', () => {
    test('should have Claude 3.5 Sonnet constant', () => {
      expect(ANTHROPIC.CLAUDE_3_5_SONNET_20241022).toBe(
        'claude-3-5-sonnet-20241022'
      );
    });

    test('should have Claude 3 Opus constant', () => {
      expect(ANTHROPIC.CLAUDE_3_OPUS_20240229).toBe('claude-3-opus-20240229');
    });

    test('should have Claude 3 Haiku constant', () => {
      expect(ANTHROPIC.CLAUDE_3_HAIKU_20240307).toBe('claude-3-haiku-20240307');
    });
  });

  describe('GOOGLE', () => {
    test('should have Gemini Pro constant', () => {
      expect(GOOGLE.GEMINI_1_5_PRO).toBeDefined();
    });

    test('should have Gemini Flash constant', () => {
      expect(GOOGLE.GEMINI_1_5_FLASH).toBeDefined();
    });
  });

  describe('isModelConstant', () => {
    test('should return true for valid OpenAI model', () => {
      expect(isModelConstant('gpt-4')).toBe(true);
      expect(isModelConstant('gpt-3.5-turbo')).toBe(true);
    });

    test('should return true for valid Anthropic model', () => {
      expect(isModelConstant('claude-3-5-sonnet-20241022')).toBe(true);
    });

    test('should return false for invalid model', () => {
      expect(isModelConstant('invalid-model-xyz')).toBe(false);
      expect(isModelConstant('not-a-real-model')).toBe(false);
    });

    test('should return true for model constant values', () => {
      expect(isModelConstant(OPENAI.GPT_4)).toBe(true);
      expect(isModelConstant(ANTHROPIC.CLAUDE_3_5_SONNET_20241022)).toBe(true);
    });
  });

  describe('getAllModelConstants', () => {
    test('should return an array of model IDs', () => {
      const models = getAllModelConstants();
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
    });

    test('should include OpenAI models', () => {
      const models = getAllModelConstants();
      expect(models).toContain('gpt-4');
      expect(models).toContain('gpt-3.5-turbo');
    });

    test('should include Anthropic models', () => {
      const models = getAllModelConstants();
      expect(models).toContain('claude-3-5-sonnet-20241022');
    });

    test('should not have duplicates', () => {
      const models = getAllModelConstants();
      const uniqueModels = [...new Set(models)];
      expect(models.length).toBe(uniqueModels.length);
    });
  });

  describe('getProviderFromModel', () => {
    test('should return OpenAI for GPT models', () => {
      expect(getProviderFromModel('gpt-4')).toBe('OpenAI');
      expect(getProviderFromModel('gpt-3.5-turbo')).toBe('OpenAI');
      expect(getProviderFromModel(OPENAI.GPT_4)).toBe('OpenAI');
    });

    test('should return Anthropic for Claude models', () => {
      expect(getProviderFromModel('claude-3-5-sonnet-20241022')).toBe(
        'Anthropic'
      );
      expect(getProviderFromModel(ANTHROPIC.CLAUDE_3_OPUS_20240229)).toBe(
        'Anthropic'
      );
    });

    test('should return Google for Gemini models', () => {
      const provider = getProviderFromModel(GOOGLE.GEMINI_1_5_PRO);
      expect(provider).toBe('Google');
    });

    test('should return unknown for invalid models', () => {
      expect(getProviderFromModel('invalid-model')).toBe('unknown');
    });
  });

  describe('Provider namespaces', () => {
    test('should have all major providers', () => {
      expect(OPENAI).toBeDefined();
      expect(ANTHROPIC).toBeDefined();
      expect(GOOGLE).toBeDefined();
      expect(AWS_BEDROCK).toBeDefined();
      expect(XAI).toBeDefined();
      expect(DEEPSEEK).toBeDefined();
      expect(MISTRAL).toBeDefined();
      expect(COHERE).toBeDefined();
      expect(GROQ).toBeDefined();
      expect(META).toBeDefined();
    });

    test('should have model constants as string values', () => {
      expect(typeof OPENAI.GPT_4).toBe('string');
      expect(typeof ANTHROPIC.CLAUDE_3_5_SONNET_20241022).toBe('string');
    });
  });

  describe('Type safety', () => {
    test('constants should be type-safe strings', () => {
      const model: string = OPENAI.GPT_4;
      expect(model).toBe('gpt-4');
    });

    test('can use constants in function calls', () => {
      const testFunction = (model: string) => model;
      expect(testFunction(OPENAI.GPT_4)).toBe('gpt-4');
      expect(testFunction(ANTHROPIC.CLAUDE_3_5_SONNET_20241022)).toBe(
        'claude-3-5-sonnet-20241022'
      );
    });
  });
});
