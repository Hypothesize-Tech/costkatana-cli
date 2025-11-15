import Conf from 'conf';
import { logger } from './logger';
import * as fs from 'fs';
import * as path from 'path';

export interface CLIConfig {
  apiKey?: string;
  baseUrl?: string;
  projectName?: string;
  defaultModel?: string;
  defaultTemperature?: number;
  defaultMaxTokens?: number;
  costLimitPerDay?: number;
  monthlyTokenBudget?: number;
  enableAnalytics?: boolean;
  enableOptimization?: boolean;
  enableFailover?: boolean;
  modelMappings?: Record<string, string>;
  providers?: Record<string, any>;
  theme?: 'light' | 'dark' | 'auto';
  outputFormat?: 'table' | 'json' | 'csv';
  debugMode?: boolean;
  currentProject?: {
    id: string;
    name: string;
    switchedAt: string;
  };
}

export class ConfigManager {
  private conf: Conf<CLIConfig>;
  private configPath?: string;

  constructor(configPath?: string) {
    this.configPath = configPath;

    this.conf = new Conf<CLIConfig>({
      projectName: 'cost-katana-cli',
      schema: {
        apiKey: {
          type: 'string',
          default: undefined,
        },
        baseUrl: {
          type: 'string',
          default: 'https://cost-katana-backend.store',
        },
        projectName: {
          type: 'string',
          default: 'My AI Project',
        },
        defaultModel: {
          type: 'string',
          default: 'gpt-4',
        },
        defaultTemperature: {
          type: 'number',
          default: 0.7,
        },
        defaultMaxTokens: {
          type: 'number',
          default: 2000,
        },
        costLimitPerDay: {
          type: 'number',
          default: 50.0,
        },
        monthlyTokenBudget: {
          type: 'number',
          default: 10000000, // 10 million tokens
        },
        enableAnalytics: {
          type: 'boolean',
          default: true,
        },
        enableOptimization: {
          type: 'boolean',
          default: true,
        },
        enableFailover: {
          type: 'boolean',
          default: true,
        },
        modelMappings: {
          type: 'object',
          default: {
            gpt4: 'gpt-4o',
            claude: 'claude-3-5-sonnet-20241022',
            gemini: 'gemini-2.5-flash',
          },
        },
        providers: {
          type: 'object',
          default: {
            openai: {
              priority: 1,
              models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
            },
            anthropic: {
              priority: 2,
              models: [
                'claude-3-5-sonnet-20241022',
                'claude-3-5-haiku-20241022',
              ],
            },
            google: {
              priority: 3,
              models: ['gemini-2.5-flash', 'gemini-2.5-pro'],
            },
          },
        },
        theme: {
          type: 'string',
          enum: ['light', 'dark', 'auto'],
          default: 'auto',
        },
        outputFormat: {
          type: 'string',
          enum: ['table', 'json', 'csv'],
          default: 'table',
        },
        debugMode: {
          type: 'boolean',
          default: false,
        },
        currentProject: {
          type: 'object',
          default: undefined,
        },
      },
    });
  }

  get(key: keyof CLIConfig): any {
    return this.conf.get(key);
  }

  set(key: keyof CLIConfig, value: any): void {
    this.conf.set(key, value);
    logger.debug(`Configuration updated: ${key} = ${value}`);
  }

  getAll(): CLIConfig {
    return this.conf.store;
  }

  has(key: keyof CLIConfig): boolean {
    return this.conf.has(key);
  }

  delete(key: keyof CLIConfig): void {
    this.conf.delete(key);
    logger.debug(`Configuration deleted: ${key}`);
  }

  clear(): void {
    this.conf.clear();
    logger.debug('Configuration cleared');
  }

  getPath(): string {
    return this.conf.path;
  }

  // Load configuration from external file
  loadFromFile(filePath: string): boolean {
    try {
      const fullPath = path.resolve(filePath);
      if (!fs.existsSync(fullPath)) {
        logger.error(`Configuration file not found: ${fullPath}`);
        return false;
      }

      const configData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

      // Validate and merge configuration
      for (const [key, value] of Object.entries(configData)) {
        if (this.isValidConfigKey(key)) {
          this.set(key as keyof CLIConfig, value);
        }
      }

      logger.success(`Configuration loaded from: ${fullPath}`);
      return true;
    } catch (error) {
      logger.error(`Failed to load configuration from ${filePath}:`, error);
      return false;
    }
  }

  // Save configuration to external file
  saveToFile(filePath: string): boolean {
    try {
      const fullPath = path.resolve(filePath);
      const configData = this.getAll();

      // Ensure directory exists
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(fullPath, JSON.stringify(configData, null, 2));
      logger.success(`Configuration saved to: ${fullPath}`);
      return true;
    } catch (error) {
      logger.error(`Failed to save configuration to ${filePath}:`, error);
      return false;
    }
  }

  // Create sample configuration
  createSampleConfig(): CLIConfig {
    return {
      apiKey: 'your_api_key_here',
      baseUrl: 'https://cost-katana-backend.store',
      projectName: 'My AI Project',
      defaultModel: 'gpt-4',
      defaultTemperature: 0.7,
      defaultMaxTokens: 2000,
      costLimitPerDay: 50.0,
      monthlyTokenBudget: 10000000, // 10 million tokens
      enableAnalytics: true,
      enableOptimization: true,
      enableFailover: true,
      modelMappings: {
        gpt4: 'gpt-4o',
        claude: 'claude-3-5-sonnet-20241022',
        gemini: 'gemini-2.5-flash',
        mistral: 'mistral-large-latest',
        deepseek: 'deepseek-chat',
        groq: 'llama-3.1-8b-instant',
        cohere: 'command-a-03-2025',
        xai: 'x-1-mini',
        aws: 'anthropic.claude-3-5-sonnet-20241022-v1:0',
      },
      providers: {
        openai: {
          priority: 1,
          models: [
            'gpt-4o',
            'gpt-4o-mini',
            'gpt-4o-mini-2024-07-18',
            'gpt-4-turbo',
            'gpt-4',
            'gpt-3.5-turbo',
            'gpt-4.1-2025-04-14',
          ],
        },
        anthropic: {
          priority: 2,
          models: [
            'claude-opus-4-20250514',
            'claude-sonnet-4-20250514',
            'claude-3-7-sonnet-20250219',
            'claude-3-5-sonnet-20241022',
            'claude-3-5-haiku-20241022',
          ],
        },
        google: {
          priority: 3,
          models: [
            'gemini-2.5-pro',
            'gemini-2.5-flash',
            'gemini-2.5-flash-lite-preview',
            'gemini-2.0-flash',
            'gemini-1.5-pro',
          ],
        },
        aws: {
          priority: 4,
          models: [
            'ai21.jamba-1-5-large-v1:0',
            'ai21.jamba-1-5-mini-v1:0',
            'amazon.nova-micro-v1:0',
            'amazon.nova-lite-v1:0',
            'anthropic.claude-3-5-sonnet-20241022-v1:0',
            'anthropic.claude-3-5-haiku-20241022-v1:0',
          ],
        },
        cohere: {
          priority: 5,
          models: [
            'command-a-03-2025',
            'command-r7b-12-2024',
            'command-a-reasoning-08-2025',
            'command-a-vision-07-2025',
            'command-r-plus-04-2024',
            'command-r-08-2024',
          ],
        },
        mistral: {
          priority: 6,
          models: [
            'mistral-large-latest',
            'mistral-medium-latest',
            'mistral-small-latest',
          ],
        },
        deepseek: {
          priority: 7,
          models: ['deepseek-chat', 'deepseek-coder'],
        },
        groq: {
          priority: 8,
          models: [
            'llama-3.1-8b-instant',
            'llama-3.1-70b-version',
            'mixtral-8x7b-32768',
          ],
        },
        xai: {
          priority: 9,
          models: ['x-1-mini', 'x-1-hybrid'],
        },
      },
      theme: 'auto',
      outputFormat: 'table',
      debugMode: false,
    };
  }

  // Validate configuration
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = this.getAll();

    if (!config.apiKey) {
      errors.push('API key is required');
    }

    if (!config.projectName) {
      errors.push('Project name is required');
    }

    if (
      config.defaultTemperature &&
      (config.defaultTemperature < 0 || config.defaultTemperature > 2)
    ) {
      errors.push('Default temperature must be between 0 and 2');
    }

    if (config.defaultMaxTokens && config.defaultMaxTokens <= 0) {
      errors.push('Default max tokens must be greater than 0');
    }

    if (config.costLimitPerDay && config.costLimitPerDay <= 0) {
      errors.push('Cost limit per day must be greater than 0');
    }

    if (config.monthlyTokenBudget && config.monthlyTokenBudget <= 0) {
      errors.push('Monthly token budget must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Export configuration as environment variables
  exportAsEnv(): Record<string, string> {
    const config = this.getAll();
    const env: Record<string, string> = {};

    if (config.apiKey) env.API_KEY = config.apiKey;
    if (config.baseUrl) env.COST_KATANA_BASE_URL = config.baseUrl;
    if (config.projectName) env.COST_KATANA_PROJECT_NAME = config.projectName;
    if (config.defaultModel)
      env.COST_KATANA_DEFAULT_MODEL = config.defaultModel;
    if (config.defaultTemperature)
      env.COST_KATANA_TEMPERATURE = config.defaultTemperature.toString();
    if (config.defaultMaxTokens)
      env.COST_KATANA_MAX_TOKENS = config.defaultMaxTokens.toString();
    if (config.costLimitPerDay)
      env.COST_KATANA_COST_LIMIT = config.costLimitPerDay.toString();
    if (config.monthlyTokenBudget)
      env.COST_KATANA_MONTHLY_TOKEN_BUDGET =
        config.monthlyTokenBudget.toString();

    return env;
  }

  private isValidConfigKey(key: string): key is keyof CLIConfig {
    return key in this.conf.store;
  }
}

// Global config instance
export const configManager = new ConfigManager();
