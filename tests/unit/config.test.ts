import { ConfigManager } from '../../src/utils/config';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs module
jest.mock('fs');
jest.mock('path');

// Mock logger
jest.mock('../../src/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    success: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('ConfigManager', () => {
  let configManager: ConfigManager;
  let tempConfigPath: string;

  beforeEach(() => {
    // Create a fresh config manager for each test
    tempConfigPath = '/tmp/test-config.json';
    configManager = new ConfigManager(tempConfigPath);
    
    // Mock path.resolve to return our temp path
    (path.resolve as jest.Mock).mockReturnValue(tempConfigPath);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a new ConfigManager instance', () => {
      expect(configManager).toBeInstanceOf(ConfigManager);
    });

    it('should initialize with default values', () => {
      const config = configManager.getAll();
      expect(config.baseUrl).toBe('https://cost-katana-backend.store');
      expect(config.defaultModel).toBe('gpt-4');
      expect(config.defaultTemperature).toBe(0.7);
      expect(config.defaultMaxTokens).toBe(2000);
      expect(config.costLimitPerDay).toBe(50.0);
    });
  });

  describe('get and set', () => {
    it('should set and get configuration values', () => {
      configManager.set('apiKey', 'test-key');
      configManager.set('baseUrl', 'https://test.com');
      
      expect(configManager.get('apiKey')).toBe('test-key');
      expect(configManager.get('baseUrl')).toBe('https://test.com');
    });

    it('should return undefined for non-existent keys', () => {
      expect(configManager.get('nonExistentKey' as any)).toBeUndefined();
    });

    it('should check if key exists', () => {
      configManager.set('apiKey', 'test-key');
      expect(configManager.has('apiKey')).toBe(true);
      expect(configManager.has('nonExistentKey' as any)).toBe(false);
    });
  });

  describe('delete and clear', () => {
    it('should delete specific configuration keys', () => {
      configManager.set('apiKey', 'test-key');
      configManager.set('baseUrl', 'https://test.com');
      
      configManager.delete('apiKey');
      
      expect(configManager.has('apiKey')).toBe(false);
      expect(configManager.has('baseUrl')).toBe(true);
    });

    it('should clear all configuration', () => {
      configManager.set('apiKey', 'test-key');
      configManager.set('baseUrl', 'https://test.com');
      
      configManager.clear();
      
      expect(configManager.has('apiKey')).toBe(false);
      // baseUrl should still exist with default value after clear
      expect(configManager.has('baseUrl')).toBe(true);
      expect(configManager.get('baseUrl')).toBe('https://cost-katana-backend.store');
    });
  });

  describe('getAll', () => {
    it('should return all configuration values', () => {
      configManager.set('apiKey', 'test-key');
      configManager.set('baseUrl', 'https://test.com');
      
      const allConfig = configManager.getAll();
      
      expect(allConfig.apiKey).toBe('test-key');
      expect(allConfig.baseUrl).toBe('https://test.com');
      expect(allConfig.defaultModel).toBe('gpt-4'); // default value
    });
  });

  describe('getPath', () => {
    it('should return the configuration file path', () => {
      const configPath = configManager.getPath();
      expect(configPath).toBeDefined();
      expect(typeof configPath).toBe('string');
    });
  });

  describe('loadFromFile', () => {
    it('should load configuration from file successfully', () => {
      const mockConfigData = {
        apiKey: 'loaded-key',
        baseUrl: 'https://loaded.com',
        defaultModel: 'claude-3',
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockConfigData));

      const result = configManager.loadFromFile('/path/to/config.json');

      expect(result).toBe(true);
      expect(configManager.get('apiKey')).toBe('loaded-key');
      expect(configManager.get('baseUrl')).toBe('https://loaded.com');
      expect(configManager.get('defaultModel')).toBe('claude-3');
    });

    it('should return false when file does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const result = configManager.loadFromFile('/path/to/nonexistent.json');

      expect(result).toBe(false);
    });

    it('should return false when file is invalid JSON', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');

      const result = configManager.loadFromFile('/path/to/invalid.json');

      expect(result).toBe(false);
    });
  });

  describe('saveToFile', () => {
    it('should save configuration to file successfully', () => {
      configManager.set('apiKey', 'test-key');
      configManager.set('baseUrl', 'https://test.com');

      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.mkdirSync as jest.Mock).mockImplementation();
      (fs.writeFileSync as jest.Mock).mockImplementation();

      const result = configManager.saveToFile('/path/to/output.json');

      expect(result).toBe(true);
      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalled();
      
      const writeCall = (fs.writeFileSync as jest.Mock).mock.calls[0];
      const writtenContent = writeCall[1];
      expect(writtenContent).toContain('test-key');
    });

    it('should return false when save fails', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.mkdirSync as jest.Mock).mockImplementation();
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Write failed');
      });

      const result = configManager.saveToFile('/path/to/output.json');

      expect(result).toBe(false);
    });
  });

  describe('createSampleConfig', () => {
    it('should create a sample configuration', () => {
      const sampleConfig = configManager.createSampleConfig();

      expect(sampleConfig.apiKey).toBe('your_api_key_here');
      expect(sampleConfig.baseUrl).toBe('https://cost-katana-backend.store');
      expect(sampleConfig.defaultModel).toBe('gpt-4');
      expect(sampleConfig.defaultTemperature).toBe(0.7);
      expect(sampleConfig.defaultMaxTokens).toBe(2000);
      expect(sampleConfig.costLimitPerDay).toBe(50.0);
      expect(sampleConfig.enableAnalytics).toBe(true);
      expect(sampleConfig.enableOptimization).toBe(true);
      expect(sampleConfig.enableFailover).toBe(true);
    });
  });

  describe('validate', () => {
    it('should validate configuration successfully', () => {
      configManager.set('apiKey', 'valid-key');
      configManager.set('defaultTemperature', 0.5);
      configManager.set('defaultMaxTokens', 1000);
      configManager.set('costLimitPerDay', 25.0);

      const result = configManager.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid configuration', () => {
      // No API key
      configManager.set('defaultTemperature', 3.0); // Invalid temperature
      configManager.set('defaultMaxTokens', -1); // Invalid max tokens
      configManager.set('costLimitPerDay', -5.0); // Invalid cost limit

      const result = configManager.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('API key is required');
      expect(result.errors).toContain('Default temperature must be between 0 and 2');
      expect(result.errors).toContain('Default max tokens must be greater than 0');
      expect(result.errors).toContain('Cost limit per day must be greater than 0');
    });
  });

  describe('exportAsEnv', () => {
    it('should export configuration as environment variables', () => {
      configManager.set('apiKey', 'test-key');
      configManager.set('baseUrl', 'https://test.com');
      configManager.set('defaultModel', 'gpt-4');
      configManager.set('defaultTemperature', 0.7);
      configManager.set('defaultMaxTokens', 2000);
      configManager.set('costLimitPerDay', 50.0);

      const env = configManager.exportAsEnv();

      expect(env.API_KEY).toBe('test-key');
      expect(env.COST_KATANA_BASE_URL).toBe('https://test.com');
      expect(env.COST_KATANA_DEFAULT_MODEL).toBe('gpt-4');
      expect(env.COST_KATANA_TEMPERATURE).toBe('0.7');
      expect(env.COST_KATANA_MAX_TOKENS).toBe('2000');
      expect(env.COST_KATANA_COST_LIMIT).toBe('50');
    });

    it('should only export set values', () => {
      const env = configManager.exportAsEnv();

      expect(env.API_KEY).toBeUndefined();
      expect(env.COST_KATANA_BASE_URL).toBe('https://cost-katana-backend.store');
    });
  });
}); 