import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import * as fs from 'fs';
import * as path from 'path';

export function initCommand(program: Command) {
  program
    .command('init')
    .description('Initialize Cost Katana CLI configuration')
    .option('-f, --force', 'Force overwrite existing configuration')
    .option('-k, --api-key <key>', 'Set API key directly')
    .option('-u, --base-url <url>', 'Set base URL directly')
    .option('-m, --model <model>', 'Set default model directly')
    .option('-o, --output <path>', 'Output configuration file path')
    .action(async (options) => {
      try {
        await handleInit(options);
      } catch (error) {
        logger.error('Initialization failed:', error);
        process.exit(1);
      }
    });
}

async function handleInit(options: any) {
  logger.info('🚀 Initializing Cost Katana CLI...');

  const outputPath = options.output || 'cost-katana-config.json';
  const fullOutputPath = path.resolve(outputPath);

  // Check if config file already exists
  if (fs.existsSync(fullOutputPath) && !options.force) {
    logger.warn(`Configuration file already exists: ${fullOutputPath}`);
    
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Do you want to overwrite the existing configuration?',
        default: false,
      },
    ]);

    if (!overwrite) {
      logger.info('Initialization cancelled.');
      return;
    }
  }

  // Collect configuration
  const config = await collectConfiguration(options);

  // Save configuration
  if (configManager.saveToFile(fullOutputPath)) {
    logger.success(`✅ Configuration saved to: ${fullOutputPath}`);
    
    // Display next steps
    displayNextSteps();
  } else {
    logger.error('Failed to save configuration');
    process.exit(1);
  }
}

async function collectConfiguration(options: any): Promise<any> {
  const config: any = {};

  // API Key
  if (options.apiKey) {
    config.apiKey = options.apiKey;
  } else {
    const { apiKey } = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'Enter your Cost Katana API key:',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'API key is required';
          }
          return true;
        },
      },
    ]);
    config.apiKey = apiKey;
  }

  // Base URL
  if (options.baseUrl) {
    config.baseUrl = options.baseUrl;
  } else {
    const { baseUrl } = await inquirer.prompt([
      {
        type: 'input',
        name: 'baseUrl',
        message: 'Enter base URL:',
        default: 'https://cost-katana-backend.store',
        validate: (input: string) => {
          try {
            new URL(input);
            return true;
          } catch {
            return 'Please enter a valid URL';
          }
        },
      },
    ]);
    config.baseUrl = baseUrl;
  }

  // Default Model
  if (options.model) {
    config.defaultModel = options.model;
  } else {
    const { defaultModel } = await inquirer.prompt([
      {
        type: 'list',
        name: 'defaultModel',
        message: 'Select default model:',
        choices: [
          { name: 'GPT-4 Turbo', value: 'gpt-4-turbo-preview' },
          { name: 'Claude 3 Sonnet', value: 'anthropic.claude-3-sonnet-20240229-v1:0' },
          { name: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash-exp' },
          { name: 'Nova Pro', value: 'nova-pro' },
        ],
      },
    ]);
    config.defaultModel = defaultModel;
  }

  // Advanced Configuration
  const { configureAdvanced } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'configureAdvanced',
      message: 'Configure advanced settings?',
      default: false,
    },
  ]);

  if (configureAdvanced) {
    await collectAdvancedConfiguration(config);
  }

  return config;
}

async function collectAdvancedConfiguration(config: any) {
  // Temperature
  const { temperature } = await inquirer.prompt([
    {
      type: 'number',
      name: 'temperature',
      message: 'Default temperature (0.0 - 2.0):',
      default: 0.7,
      validate: (input: number) => {
        if (input < 0 || input > 2) {
          return 'Temperature must be between 0 and 2';
        }
        return true;
      },
    },
  ]);
  config.defaultTemperature = temperature;

  // Max Tokens
  const { maxTokens } = await inquirer.prompt([
    {
      type: 'number',
      name: 'maxTokens',
      message: 'Default max tokens:',
      default: 2000,
      validate: (input: number) => {
        if (input <= 0) {
          return 'Max tokens must be greater than 0';
        }
        return true;
      },
    },
  ]);
  config.defaultMaxTokens = maxTokens;

  // Cost Limit
  const { costLimit } = await inquirer.prompt([
    {
      type: 'number',
      name: 'costLimit',
      message: 'Daily cost limit ($):',
      default: 50.0,
      validate: (input: number) => {
        if (input <= 0) {
          return 'Cost limit must be greater than 0';
        }
        return true;
      },
    },
  ]);
  config.costLimitPerDay = costLimit;

  // Features
  const { features } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'features',
      message: 'Enable features:',
      choices: [
        { name: 'Analytics', value: 'analytics', checked: true },
        { name: 'Optimization', value: 'optimization', checked: true },
        { name: 'Failover', value: 'failover', checked: true },
      ],
    },
  ]);

  config.enableAnalytics = features.includes('analytics');
  config.enableOptimization = features.includes('optimization');
  config.enableFailover = features.includes('failover');

  // Output Format
  const { outputFormat } = await inquirer.prompt([
    {
      type: 'list',
      name: 'outputFormat',
      message: 'Default output format:',
      choices: [
        { name: 'Table', value: 'table' },
        { name: 'JSON', value: 'json' },
        { name: 'CSV', value: 'csv' },
      ],
    },
  ]);
  config.outputFormat = outputFormat;
}

function displayNextSteps() {
  console.log('\n' + chalk.cyan.bold('🎉 Setup Complete! Next steps:'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  
  console.log(chalk.yellow('1.') + ' Test your configuration:');
  console.log(chalk.gray('   cost-katana test'));
  
  console.log(chalk.yellow('2.') + ' Start a chat session:');
  console.log(chalk.gray('   cost-katana chat'));
  
  console.log(chalk.yellow('3.') + ' Analyze your costs:');
  console.log(chalk.gray('   cost-katana analyze'));
  
  console.log(chalk.yellow('4.') + ' Optimize your prompts:');
  console.log(chalk.gray('   cost-katana optimize'));
  
  console.log(chalk.yellow('5.') + ' View available models:');
  console.log(chalk.gray('   cost-katana list-models'));
  
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.blue('💡 Tip: Run "cost-katana --help" for more commands'));
} 