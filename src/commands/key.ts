import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function keyCommand(program: Command) {
  const keyGroup = program
    .command('key')
    .description('🔐 Manage API keys for cost tracking');

  // Main key command
  keyGroup
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export key data to file')
    .action(async (options) => {
      try {
        await handleKey(options);
      } catch (error) {
        logger.error('Key command failed:', error);
        process.exit(1);
      }
    });

  // Create key subcommand
  keyGroup
    .command('create <name>')
    .description('🔐 Create a new API key')
    .option('-b, --budget <amount>', 'Token budget for this key')
    .option('-t, --ttl <duration>', 'Time to live (e.g., 30d, 7d, 1y)')
    .option(
      '-p, --permissions <permissions>',
      'Comma-separated permissions (read,write,admin)',
      'read'
    )
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export key data to file')
    .action(async (name, options) => {
      try {
        await handleCreateKey(name, options);
      } catch (error) {
        logger.error('Create key failed:', error);
        process.exit(1);
      }
    });

  // List keys subcommand
  keyGroup
    .command('list')
    .description('📋 List all API keys')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export key list to file')
    .option('-v, --verbose', 'Show detailed key information')
    .action(async (options) => {
      try {
        await handleListKeys(options);
      } catch (error) {
        logger.error('List keys failed:', error);
        process.exit(1);
      }
    });

  // Regenerate key subcommand
  keyGroup
    .command('regenerate <keyId>')
    .description('🔄 Regenerate an API key')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .action(async (keyId, options) => {
      try {
        await handleRegenerateKey(keyId, options);
      } catch (error) {
        logger.error('Regenerate key failed:', error);
        process.exit(1);
      }
    });

  // Deactivate key subcommand
  keyGroup
    .command('deactivate <keyId>')
    .description('❌ Deactivate an API key')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .action(async (keyId, options) => {
      try {
        await handleDeactivateKey(keyId, options);
      } catch (error) {
        logger.error('Deactivate key failed:', error);
        process.exit(1);
      }
    });
}

async function handleKey(_options: any) {
  console.log(chalk.cyan.bold('\n🔐 API Key Management'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  console.log(chalk.yellow('Available commands:'));
  console.log(
    chalk.white('  costkatana key create <name>     Create a new API key')
  );
  console.log(
    chalk.white('  costkatana key list              List all API keys')
  );
  console.log(
    chalk.white('  costkatana key regenerate <id>   Regenerate an API key')
  );
  console.log(
    chalk.white('  costkatana key deactivate <id>   Deactivate an API key')
  );

  console.log(chalk.gray('\nExamples:'));
  console.log(
    chalk.white('  costkatana key create dev-token --budget 100000 --ttl 30d')
  );
  console.log(
    chalk.white('  costkatana key create prod-key --permissions read,write')
  );
  console.log(chalk.white('  costkatana key list --format json'));
  console.log(chalk.white('  costkatana key regenerate abc123'));

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleCreateKey(name: string, options: any) {
  logger.info('🔐 Creating new API key...');

  try {
    // Collect key data
    const keyData = await collectKeyData(name, options);

    // Create key via API
    const result = await createKey(keyData);

    // Display results
    displayCreateKeyResult(result, options);
  } catch (error) {
    logger.error('Failed to create API key:', error);
    process.exit(1);
  }
}

async function collectKeyData(name: string, options: any) {
  const data: any = {
    name: name,
  };

  // Budget
  if (options.budget) {
    data.budget = parseInt(options.budget);
  } else {
    const { useBudget } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useBudget',
        message: 'Do you want to set a token budget for this key?',
        default: false,
      },
    ]);

    if (useBudget) {
      const { budgetAmount } = await inquirer.prompt([
        {
          type: 'number',
          name: 'budgetAmount',
          message: 'Enter token budget amount:',
          validate: (input: number) => {
            if (!input || input <= 0) {
              return 'Budget must be a positive number';
            }
            return true;
          },
        },
      ]);
      data.budget = budgetAmount;
    }
  }

  // TTL (Time to Live)
  if (options.ttl) {
    data.ttl = options.ttl;
  } else {
    const { useTTL } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useTTL',
        message: 'Do you want to set an expiration date for this key?',
        default: false,
      },
    ]);

    if (useTTL) {
      const { ttl } = await inquirer.prompt([
        {
          type: 'list',
          name: 'ttl',
          message: 'Select expiration period:',
          choices: [
            { name: '7 days', value: '7d' },
            { name: '30 days', value: '30d' },
            { name: '90 days', value: '90d' },
            { name: '1 year', value: '1y' },
            { name: 'Never', value: null },
          ],
        },
      ]);
      if (ttl) data.ttl = ttl;
    }
  }

  // Permissions
  if (options.permissions) {
    data.permissions = options.permissions
      .split(',')
      .map((p: string) => p.trim());
  } else {
    const { permissions } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'permissions',
        message: 'Select permissions for this key:',
        choices: [
          { name: 'Read access', value: 'read', checked: true },
          { name: 'Write access', value: 'write' },
          { name: 'Admin access', value: 'admin' },
        ],
      },
    ]);
    data.permissions = permissions;
  }

  return data;
}

async function createKey(keyData: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    console.log(chalk.red.bold('\n❌ Configuration Missing'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );

    if (!apiKey) {
      console.log(chalk.yellow('• API Key is not set'));
    }
    if (!baseUrl) {
      console.log(chalk.yellow('• Base URL is not set'));
    }

    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    console.log(chalk.cyan('To set up your configuration, run:'));
    console.log(chalk.white('  cost-katana init'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    );

    throw new Error(
      'Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.'
    );
  }

  try {
    const response = await axios.post(`${baseUrl}/api/api-keys`, keyData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    if (response.status !== 201) {
      throw new Error(`API returned status ${response.status}`);
    }

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Invalid response format');
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
      );
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayCreateKeyResult(result: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(result, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Key ID,Name,Key,Permissions,Created At,Expires At');
    const expiresAt = result.expiresAt || 'Never';
    console.log(
      `"${result.id}","${result.name}","${result.key}","${result.permissions?.join(',') || ''}","${result.created}","${expiresAt}"`
    );
    return;
  }

  console.log(chalk.cyan.bold('\n✅ API Key Created Successfully'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  console.log(chalk.white('📝 Key ID:'), chalk.cyan(result.id));
  console.log(chalk.white('🔑 Name:'), chalk.cyan(result.name));
  console.log(chalk.white('🔐 API Key:'), chalk.green(result.key));

  if (result.permissions && result.permissions.length > 0) {
    console.log(
      chalk.white('🔓 Permissions:'),
      chalk.cyan(result.permissions.join(', '))
    );
  }

  if (result.budget) {
    console.log(
      chalk.white('💰 Budget:'),
      chalk.green(`${result.budget.toLocaleString()} tokens`)
    );
  }

  console.log(
    chalk.white('📅 Created:'),
    chalk.cyan(new Date(result.created).toLocaleString())
  );

  if (result.expiresAt) {
    console.log(
      chalk.white('⏰ Expires:'),
      chalk.yellow(new Date(result.expiresAt).toLocaleString())
    );
  } else {
    console.log(chalk.white('⏰ Expires:'), chalk.green('Never'));
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(chalk.yellow('💡 Usage Instructions:'));
  console.log(
    chalk.white('  • Header format:'),
    chalk.cyan(`X-API-Key: ${result.key}`)
  );
  console.log(chalk.white('  • Perfect for ChatGPT Custom GPT integration'));
  console.log(chalk.white('  • Use in your applications for cost tracking'));

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleListKeys(options: any) {
  logger.info('📋 Fetching API keys...');

  try {
    const keys = await getKeys();
    displayKeysList(keys, options);
  } catch (error) {
    logger.error('Failed to fetch API keys:', error);
    process.exit(1);
  }
}

async function getKeys() {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    console.log(chalk.red.bold('\n❌ Configuration Missing'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );

    if (!apiKey) {
      console.log(chalk.yellow('• API Key is not set'));
    }
    if (!baseUrl) {
      console.log(chalk.yellow('• Base URL is not set'));
    }

    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    console.log(chalk.cyan('To set up your configuration, run:'));
    console.log(chalk.white('  cost-katana init'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    );

    throw new Error(
      'Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.'
    );
  }

  try {
    const response = await axios.get(`${baseUrl}/api/api-keys`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    if (response.status !== 200) {
      throw new Error(`API returned status ${response.status}`);
    }

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Invalid response format');
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
      );
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayKeysList(keys: any[], options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(keys, null, 2));
    return;
  } else if (format === 'csv') {
    console.log(
      'Key ID,Name,Key Preview,Status,Permissions,Created At,Last Used,Expires At'
    );
    keys.forEach((key) => {
      const expiresAt = key.expiresAt || 'Never';
      const lastUsed = key.lastUsed || 'Never';
      console.log(
        `"${key.id}","${key.name}","${key.key_preview}","${key.status}","${key.permissions?.join(',') || ''}","${key.created}","${lastUsed}","${expiresAt}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold('\n📋 Your API Keys'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  if (keys.length === 0) {
    console.log(chalk.yellow('No API keys found.'));
    console.log(chalk.white('Create your first API key:'));
    console.log(chalk.cyan('  costkatana key create my-key'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    return;
  }

  keys.forEach((key, index) => {
    const statusColor = key.is_active ? chalk.green : chalk.red;
    const statusIcon = key.is_active ? '🟢' : '🔴';

    console.log(chalk.white(`\n${index + 1}. ${statusIcon} ${key.name}`));
    console.log(chalk.gray('   ─'.repeat(40)));

    console.log(chalk.white('   📝 Key ID:'), chalk.cyan(key.id));
    console.log(chalk.white('   🔑 Key Preview:'), chalk.cyan(key.key_preview));
    console.log(chalk.white('   📊 Status:'), statusColor(key.status));

    if (key.permissions && key.permissions.length > 0) {
      console.log(
        chalk.white('   🔓 Permissions:'),
        chalk.cyan(key.permissions.join(', '))
      );
    }

    console.log(
      chalk.white('   📅 Created:'),
      chalk.cyan(new Date(key.created).toLocaleDateString())
    );

    if (key.lastUsed) {
      console.log(
        chalk.white('   🕒 Last Used:'),
        chalk.cyan(new Date(key.lastUsed).toLocaleString())
      );
    } else {
      console.log(chalk.white('   🕒 Last Used:'), chalk.yellow('Never'));
    }

    if (key.expiresAt) {
      console.log(
        chalk.white('   ⏰ Expires:'),
        chalk.yellow(new Date(key.expiresAt).toLocaleString())
      );
    } else {
      console.log(chalk.white('   ⏰ Expires:'), chalk.green('Never'));
    }
  });

  console.log(
    chalk.gray('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(chalk.yellow('💡 Commands:'));
  console.log(chalk.white('  • Create key: costkatana key create <name>'));
  console.log(
    chalk.white('  • Regenerate key: costkatana key regenerate <id>')
  );
  console.log(
    chalk.white('  • Deactivate key: costkatana key deactivate <id>')
  );
}

async function handleRegenerateKey(keyId: string, options: any) {
  logger.info('🔄 Regenerating API key...');

  try {
    const result = await regenerateKey(keyId);
    displayRegenerateKeyResult(result, options);
  } catch (error) {
    logger.error('Failed to regenerate API key:', error);
    process.exit(1);
  }
}

async function regenerateKey(keyId: string) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    console.log(chalk.red.bold('\n❌ Configuration Missing'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );

    if (!apiKey) {
      console.log(chalk.yellow('• API Key is not set'));
    }
    if (!baseUrl) {
      console.log(chalk.yellow('• Base URL is not set'));
    }

    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    console.log(chalk.cyan('To set up your configuration, run:'));
    console.log(chalk.white('  cost-katana init'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    );

    throw new Error(
      'Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.'
    );
  }

  try {
    const response = await axios.patch(
      `${baseUrl}/api/api-keys/${keyId}/regenerate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    if (response.status !== 200) {
      throw new Error(`API returned status ${response.status}`);
    }

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Invalid response format');
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
      );
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayRegenerateKeyResult(result: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(result, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Key ID,Name,New Key,Created At');
    console.log(
      `"${result.id}","${result.name}","${result.key}","${result.created}"`
    );
    return;
  }

  console.log(chalk.cyan.bold('\n✅ API Key Regenerated Successfully'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  console.log(chalk.white('📝 Key ID:'), chalk.cyan(result.id));
  console.log(chalk.white('🔑 Name:'), chalk.cyan(result.name));
  console.log(chalk.white('🔐 New API Key:'), chalk.green(result.key));
  console.log(
    chalk.white('📅 Created:'),
    chalk.cyan(new Date(result.created).toLocaleString())
  );

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(chalk.red('⚠️  Warning:'));
  console.log(chalk.white('  • The old key is now invalid'));
  console.log(
    chalk.white('  • Update this key in your applications immediately')
  );
  console.log(
    chalk.white('  • Update ChatGPT Custom GPT Actions if applicable')
  );

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleDeactivateKey(keyId: string, options: any) {
  logger.info('❌ Deactivating API key...');

  try {
    const result = await deactivateKey(keyId);
    displayDeactivateKeyResult(result, options);
  } catch (error) {
    logger.error('Failed to deactivate API key:', error);
    process.exit(1);
  }
}

async function deactivateKey(keyId: string) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    console.log(chalk.red.bold('\n❌ Configuration Missing'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );

    if (!apiKey) {
      console.log(chalk.yellow('• API Key is not set'));
    }
    if (!baseUrl) {
      console.log(chalk.yellow('• Base URL is not set'));
    }

    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    console.log(chalk.cyan('To set up your configuration, run:'));
    console.log(chalk.white('  cost-katana init'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    );

    throw new Error(
      'Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.'
    );
  }

  try {
    const response = await axios.patch(
      `${baseUrl}/api/api-keys/${keyId}/deactivate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    if (response.status !== 200) {
      throw new Error(`API returned status ${response.status}`);
    }

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Invalid response format');
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
      );
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayDeactivateKeyResult(result: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(result, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Key ID,Name,Status,Deactivated At');
    console.log(
      `"${result.id}","${result.name}","${result.status}","${result.deactivatedAt}"`
    );
    return;
  }

  console.log(chalk.cyan.bold('\n✅ API Key Deactivated Successfully'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  console.log(chalk.white('📝 Key ID:'), chalk.cyan(result.id));
  console.log(chalk.white('🔑 Name:'), chalk.cyan(result.name));
  console.log(chalk.white('📊 Status:'), chalk.red('Inactive'));
  console.log(
    chalk.white('📅 Deactivated:'),
    chalk.cyan(new Date().toLocaleString())
  );

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(chalk.yellow('💡 Note:'));
  console.log(chalk.white('  • This key is now inactive and cannot be used'));
  console.log(
    chalk.white('  • Applications using this key will receive 401 errors')
  );
  console.log(chalk.white('  • You can reactivate it later if needed'));

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}
