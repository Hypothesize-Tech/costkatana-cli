import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import * as fs from 'fs';
import * as path from 'path';

export function configCommand(program: Command) {
  program
    .command('config')
    .description('Manage CLI configuration')
    .option('-s, --set <key=value>', 'Set a configuration value')
    .option('-g, --get <key>', 'Get a configuration value')
    .option('-d, --delete <key>', 'Delete a configuration value')
    .option('-l, --list', 'List all configuration values')
    .option('-e, --export <path>', 'Export configuration to file')
    .option('-i, --import <path>', 'Import configuration from file')
    .option('-r, --reset', 'Reset configuration to defaults')
    .action(async (options) => {
      try {
        await handleConfig(options);
      } catch (error) {
        logger.error('Configuration command failed:', error);
        process.exit(1);
      }
    });
}

async function handleConfig(options: any) {
  // Handle different config operations
  if (options.set) {
    await handleSetConfig(options.set);
  } else if (options.get) {
    await handleGetConfig(options.get);
  } else if (options.delete) {
    await handleDeleteConfig(options.delete);
  } else if (options.list) {
    await handleListConfig();
  } else if (options.export) {
    await handleExportConfig(options.export);
  } else if (options.import) {
    await handleImportConfig(options.import);
  } else if (options.reset) {
    await handleResetConfig();
  } else {
    // Interactive mode
    await handleInteractiveConfig();
  }
}

async function handleSetConfig(keyValue: string) {
  const [key, value] = keyValue.split('=');
  
  if (!key || !value) {
    logger.error('Invalid format. Use: --set key=value');
    return;
  }

  // Validate key
  const validKeys = [
    'apiKey', 'baseUrl', 'defaultModel', 'defaultTemperature',
    'defaultMaxTokens', 'costLimitPerDay', 'enableAnalytics',
    'enableOptimization', 'enableFailover', 'theme', 'outputFormat',
    'modelMappings', 'providers', 'debugMode'
  ];

  if (!validKeys.includes(key)) {
    logger.error(`Invalid configuration key: ${key}`);
    logger.info(`Valid keys: ${validKeys.join(', ')}`);
    return;
  }

  // Set value with type conversion
  let typedValue: any = value;
  
  if (key === 'defaultTemperature' || key === 'defaultMaxTokens' || key === 'costLimitPerDay') {
    typedValue = parseFloat(value);
    if (isNaN(typedValue)) {
      logger.error(`Invalid number value for ${key}: ${value}`);
      return;
    }
  } else if (key === 'enableAnalytics' || key === 'enableOptimization' || key === 'enableFailover') {
    typedValue = value.toLowerCase() === 'true';
  } else if (key === 'modelMappings' || key === 'providers') {
    try {
      typedValue = JSON.parse(value);
    } catch (_error) {
      logger.error(`Invalid JSON value for ${key}: ${value}`);
      return;
    }
  }

  configManager.set(key as any, typedValue);
  logger.success(`Configuration updated: ${key} = ${value}`);
}

async function handleGetConfig(key: string) {
  if (!configManager.has(key as any)) {
    logger.warn(`Configuration key not found: ${key}`);
    logger.info('Use "cost-katana init" to set up your configuration');
    return;
  }

  const value = configManager.get(key as any);
  console.log(chalk.cyan(`${key}:`), value);
}

async function handleDeleteConfig(key: string) {
  if (!configManager.has(key as any)) {
    logger.error(`Configuration key not found: ${key}`);
    return;
  }

  configManager.delete(key as any);
  logger.success(`Configuration deleted: ${key}`);
}

async function handleListConfig() {
  const config = configManager.getAll();
  
  console.log(chalk.cyan.bold('\n📋 Current Configuration'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  
  if (Object.keys(config).length === 0) {
    console.log(chalk.yellow('No configuration set yet.'));
    console.log(chalk.gray('Use "cost-katana init" to set up your configuration'));
  } else {
    Object.entries(config).forEach(([key, value]) => {
      const displayValue = key === 'apiKey' && value ? 
        `${value.substring(0, 8)}...` : 
        JSON.stringify(value);
      
      console.log(`${chalk.yellow(key)}: ${chalk.white(displayValue)}`);
    });
  }
  
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.gray(`Configuration file: ${configManager.getPath()}`));
}

async function handleExportConfig(filePath: string) {
  const fullPath = path.resolve(filePath);
  
  if (configManager.saveToFile(fullPath)) {
    logger.success(`Configuration exported to: ${fullPath}`);
  } else {
    logger.error('Failed to export configuration');
  }
}

async function handleImportConfig(filePath: string) {
  const fullPath = path.resolve(filePath);
  
  if (!fs.existsSync(fullPath)) {
    logger.error(`Configuration file not found: ${fullPath}`);
    return;
  }

  if (configManager.loadFromFile(fullPath)) {
    logger.success(`Configuration imported from: ${fullPath}`);
  } else {
    logger.error('Failed to import configuration');
  }
}

async function handleResetConfig() {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to reset all configuration to defaults?',
      default: false,
    },
  ]);

  if (confirm) {
    configManager.clear();
    logger.success('Configuration reset to defaults');
  } else {
    logger.info('Reset cancelled');
  }
}

async function handleInteractiveConfig() {
  console.log(chalk.cyan.bold('\n🔧 Configuration Manager'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: 'View current configuration', value: 'list' },
        { name: 'Set a configuration value', value: 'set' },
        { name: 'Export configuration', value: 'export' },
        { name: 'Import configuration', value: 'import' },
        { name: 'Reset to defaults', value: 'reset' },
        { name: 'Exit', value: 'exit' },
      ],
    },
  ]);

  switch (action) {
    case 'list':
      await handleListConfig();
      break;
    case 'set':
      await handleInteractiveSet();
      break;
    case 'export':
      await handleInteractiveExport();
      break;
    case 'import':
      await handleInteractiveImport();
      break;
    case 'reset':
      await handleResetConfig();
      break;
    case 'exit':
      logger.info('Goodbye!');
      break;
  }
}

async function handleInteractiveSet() {
  const validKeys = [
    'apiKey', 'baseUrl', 'defaultModel', 'defaultTemperature',
    'defaultMaxTokens', 'costLimitPerDay', 'enableAnalytics',
    'enableOptimization', 'enableFailover', 'theme', 'outputFormat'
  ];

  const { key } = await inquirer.prompt([
    {
      type: 'list',
      name: 'key',
      message: 'Select configuration key to set:',
      choices: validKeys.map(k => ({ name: k, value: k })),
    },
  ]);

  let value: any;
  
  if (key === 'apiKey') {
    const { apiKey } = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'Enter API key:',
        validate: (input: string) => {
          if (!input.trim()) return 'API key is required';
          return true;
        },
      },
    ]);
    value = apiKey;
  } else if (key === 'defaultModel') {
    const { model } = await inquirer.prompt([
      {
        type: 'list',
        name: 'model',
        message: 'Select default model:',
        choices: [
          { name: 'GPT-4 Turbo', value: 'gpt-4-turbo-preview' },
          { name: 'Claude 3 Sonnet', value: 'anthropic.claude-3-sonnet-20240229-v1:0' },
          { name: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash-exp' },
          { name: 'Nova Pro', value: 'nova-pro' },
        ],
      },
    ]);
    value = model;
  } else if (key === 'theme') {
    const { theme } = await inquirer.prompt([
      {
        type: 'list',
        name: 'theme',
        message: 'Select theme:',
        choices: [
          { name: 'Light', value: 'light' },
          { name: 'Dark', value: 'dark' },
          { name: 'Auto', value: 'auto' },
        ],
      },
    ]);
    value = theme;
  } else if (key === 'outputFormat') {
    const { format } = await inquirer.prompt([
      {
        type: 'list',
        name: 'format',
        message: 'Select output format:',
        choices: [
          { name: 'Table', value: 'table' },
          { name: 'JSON', value: 'json' },
          { name: 'CSV', value: 'csv' },
        ],
      },
    ]);
    value = format;
  } else if (key === 'defaultTemperature') {
    const { temperature } = await inquirer.prompt([
      {
        type: 'number',
        name: 'temperature',
        message: 'Enter temperature (0.0 - 2.0):',
        default: 0.7,
        validate: (input: number) => {
          if (input < 0 || input > 2) return 'Temperature must be between 0 and 2';
          return true;
        },
      },
    ]);
    value = temperature;
  } else if (key === 'defaultMaxTokens') {
    const { maxTokens } = await inquirer.prompt([
      {
        type: 'number',
        name: 'maxTokens',
        message: 'Enter max tokens:',
        default: 2000,
        validate: (input: number) => {
          if (input <= 0) return 'Max tokens must be greater than 0';
          return true;
        },
      },
    ]);
    value = maxTokens;
  } else if (key === 'costLimitPerDay') {
    const { costLimit } = await inquirer.prompt([
      {
        type: 'number',
        name: 'costLimit',
        message: 'Enter daily cost limit ($):',
        default: 50.0,
        validate: (input: number) => {
          if (input <= 0) return 'Cost limit must be greater than 0';
          return true;
        },
      },
    ]);
    value = costLimit;
  } else if (key.includes('enable')) {
    const { enabled } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'enabled',
        message: `Enable ${key.replace('enable', '').toLowerCase()}?`,
        default: true,
      },
    ]);
    value = enabled;
  } else {
    const { inputValue } = await inquirer.prompt([
      {
        type: 'input',
        name: 'inputValue',
        message: `Enter value for ${key}:`,
      },
    ]);
    value = inputValue;
  }

  configManager.set(key as any, value);
  logger.success(`Configuration updated: ${key} = ${value}`);
}

async function handleInteractiveExport() {
  const { filePath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filePath',
      message: 'Enter file path to export configuration:',
      default: 'cost-katana-config.json',
    },
  ]);

  await handleExportConfig(filePath);
}

async function handleInteractiveImport() {
  const { filePath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filePath',
      message: 'Enter file path to import configuration from:',
      default: 'cost-katana-config.json',
    },
  ]);

  await handleImportConfig(filePath);
} 