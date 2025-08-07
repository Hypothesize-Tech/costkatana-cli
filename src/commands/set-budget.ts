import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function setBudgetCommand(program: Command) {
  const budgetGroup = program
    .command('set-budget')
    .description('💰 Apply budget caps and receive real-time alerts when workflows exceed budget');

  // Main set-budget command
  budgetGroup
    .option('--project <name>', 'Project name for budget tracking')
    .option('--tokens <number>', 'Token budget limit')
    .option('--cost <amount>', 'Cost budget limit in USD')
    .option('--notify <type>', 'Notification type (slack, email, webhook)', 'webhook')
    .option('--webhook-url <url>', 'Webhook URL for notifications')
    .option('--slack-channel <channel>', 'Slack channel for notifications')
    .option('--email <address>', 'Email address for notifications')
    .option('--thresholds <thresholds>', 'Alert thresholds (e.g., 80,95)', '80,95')
    .option('--enforce', 'Enable hard cap enforcement')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export budget data to file')
    .option('-v, --verbose', 'Show detailed budget analysis')
    .option('--include-usage', 'Include current usage analysis')
    .option('--include-projections', 'Include usage projections')
    .option('--include-alerts', 'Include alert history')
    .action(async (options) => {
      try {
        await handleSetBudget(options);
      } catch (error) {
        logger.error('Set budget command failed:', error);
        process.exit(1);
      }
    });

  // List budgets
  budgetGroup
    .command('list')
    .description('💰 List all configured budgets')
    .option('--project <name>', 'Filter by project name')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export budget list to file')
    .option('-v, --verbose', 'Show detailed budget information')
    .option('--include-usage', 'Include current usage analysis')
    .option('--include-alerts', 'Include alert history')
    .action(async (options) => {
      try {
        await handleListBudgets(options);
      } catch (error) {
        logger.error('List budgets failed:', error);
        process.exit(1);
      }
    });

  // Update budget
  budgetGroup
    .command('update')
    .description('💰 Update existing budget configuration')
    .option('--project <name>', 'Project name to update')
    .option('--tokens <number>', 'New token budget limit')
    .option('--cost <amount>', 'New cost budget limit in USD')
    .option('--notify <type>', 'Notification type (slack, email, webhook)')
    .option('--webhook-url <url>', 'New webhook URL')
    .option('--slack-channel <channel>', 'New Slack channel')
    .option('--email <address>', 'New email address')
    .option('--thresholds <thresholds>', 'New alert thresholds')
    .option('--enforce', 'Enable hard cap enforcement')
    .option('--disable-enforce', 'Disable hard cap enforcement')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export updated budget to file')
    .option('-v, --verbose', 'Show detailed update analysis')
    .action(async (options) => {
      try {
        await handleUpdateBudget(options);
      } catch (error) {
        logger.error('Update budget failed:', error);
        process.exit(1);
      }
    });

  // Delete budget
  budgetGroup
    .command('delete')
    .description('💰 Delete budget configuration')
    .option('--project <name>', 'Project name to delete')
    .option('--confirm', 'Confirm deletion without prompt')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('-v, --verbose', 'Show detailed deletion information')
    .action(async (options) => {
      try {
        await handleDeleteBudget(options);
      } catch (error) {
        logger.error('Delete budget failed:', error);
        process.exit(1);
      }
    });

  // Budget status
  budgetGroup
    .command('status')
    .description('💰 Check budget status and usage')
    .option('--project <name>', 'Project name to check')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export status to file')
    .option('-v, --verbose', 'Show detailed status analysis')
    .option('--include-usage', 'Include detailed usage breakdown')
    .option('--include-projections', 'Include usage projections')
    .option('--include-alerts', 'Include recent alerts')
    .action(async (options) => {
      try {
        await handleBudgetStatus(options);
      } catch (error) {
        logger.error('Budget status failed:', error);
        process.exit(1);
      }
    });

  // Configure alerts
  budgetGroup
    .command('alerts')
    .description('💰 Configure budget alerts and notifications')
    .option('--project <name>', 'Project name for alerts')
    .option('--enable-slack', 'Enable Slack notifications')
    .option('--enable-email', 'Enable email notifications')
    .option('--enable-webhook', 'Enable webhook notifications')
    .option('--slack-channel <channel>', 'Slack channel for notifications')
    .option('--email <address>', 'Email address for notifications')
    .option('--webhook-url <url>', 'Webhook URL for notifications')
    .option('--thresholds <thresholds>', 'Alert thresholds (e.g., 80,95)', '80,95')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export alert configuration to file')
    .option('-v, --verbose', 'Show detailed alert configuration')
    .action(async (options) => {
      try {
        await handleConfigureAlerts(options);
      } catch (error) {
        logger.error('Configure alerts failed:', error);
        process.exit(1);
      }
    });

  // Test notifications
  budgetGroup
    .command('test')
    .description('💰 Test budget notifications')
    .option('--project <name>', 'Project name for testing')
    .option('--type <type>', 'Notification type to test (slack, email, webhook)')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('-v, --verbose', 'Show detailed test results')
    .action(async (options) => {
      try {
        await handleTestNotifications(options);
      } catch (error) {
        logger.error('Test notifications failed:', error);
        process.exit(1);
      }
    });
}

async function handleSetBudget(options: any) {
  logger.info('💰 Setting budget configuration...');

  try {
    const budget = await setBudget(options);
    displayBudgetConfiguration(budget, options);
  } catch (error) {
    logger.error('Failed to set budget:', error);
    process.exit(1);
  }
}

async function setBudget(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    console.log(chalk.red.bold('\n❌ Configuration Missing'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    
    if (!apiKey) {
      console.log(chalk.yellow('• API Key is not set'));
    }
    if (!baseUrl) {
      console.log(chalk.yellow('• Base URL is not set'));
    }
    
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.cyan('To set up your configuration, run:'));
    console.log(chalk.white('  cost-katana init'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
    
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const thresholds = options.thresholds ? options.thresholds.split(',').map((t: string) => parseInt(t.trim())) : [80, 95];
    
    const params = new URLSearchParams();
    if (options.project) params.append('project', options.project);
    if (options.tokens) params.append('tokens', options.tokens);
    if (options.cost) params.append('cost', options.cost);
    if (options.notify) params.append('notify', options.notify);
    if (options.webhookUrl) params.append('webhookUrl', options.webhookUrl);
    if (options.slackChannel) params.append('slackChannel', options.slackChannel);
    if (options.email) params.append('email', options.email);
    params.append('thresholds', thresholds.join(','));
    if (options.enforce) params.append('enforce', 'true');
    if (options.includeUsage) params.append('includeUsage', 'true');
    if (options.includeProjections) params.append('includeProjections', 'true');
    if (options.includeAlerts) params.append('includeAlerts', 'true');

    const response = await axios.post(`${baseUrl}/api/set-budget?${params}`, {
      project: options.project,
      tokens: options.tokens ? parseInt(options.tokens) : undefined,
      cost: options.cost ? parseFloat(options.cost) : undefined,
      notify: options.notify,
      webhookUrl: options.webhookUrl,
      slackChannel: options.slackChannel,
      email: options.email,
      thresholds: thresholds,
      enforce: options.enforce,
      options: {
        includeUsage: options.includeUsage,
        includeProjections: options.includeProjections,
        includeAlerts: options.includeAlerts
      }
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayBudgetConfiguration(budget: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(budget, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Project,Tokens,Cost,Notify,Thresholds,Enforce,Status');
    console.log(`"${budget.project}","${budget.tokens}","${budget.cost}","${budget.notify}","${budget.thresholds.join(',')}","${budget.enforce}","${budget.status}"`);
    return;
  }

  console.log(chalk.cyan.bold('\n💰 Budget Configuration'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Budget Details
  console.log(chalk.yellow.bold('\n📋 Budget Details'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Project:'), chalk.cyan(budget.project));
  console.log(chalk.white('Status:'), chalk.cyan(budget.status));
  console.log(chalk.white('Created:'), chalk.cyan(budget.created));
  console.log(chalk.white('Last Updated:'), chalk.cyan(budget.lastUpdated));

  // Budget Limits
  console.log(chalk.yellow.bold('\n🎯 Budget Limits'));
  console.log(chalk.gray('─'.repeat(50)));
  if (budget.tokens) {
    console.log(chalk.white('Token Limit:'), chalk.cyan(budget.tokens.toLocaleString()));
  }
  if (budget.cost) {
    console.log(chalk.white('Cost Limit:'), chalk.cyan(`$${budget.cost.toFixed(2)}`));
  }
  console.log(chalk.white('Enforcement:'), budget.enforce ? chalk.red('Hard Cap') : chalk.yellow('Soft Cap'));

  // Notifications
  console.log(chalk.yellow.bold('\n🔔 Notifications'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Type:'), chalk.cyan(budget.notify));
  if (budget.webhookUrl) {
    console.log(chalk.white('Webhook URL:'), chalk.gray(budget.webhookUrl));
  }
  if (budget.slackChannel) {
    console.log(chalk.white('Slack Channel:'), chalk.gray(budget.slackChannel));
  }
  if (budget.email) {
    console.log(chalk.white('Email:'), chalk.gray(budget.email));
  }

  // Alert Thresholds
  console.log(chalk.yellow.bold('\n⚠️ Alert Thresholds'));
  console.log(chalk.gray('─'.repeat(50)));
  budget.thresholds.forEach((threshold: number, index: number) => {
    const color = threshold >= 90 ? chalk.red : threshold >= 80 ? chalk.yellow : chalk.green;
    console.log(chalk.white(`Threshold ${index + 1}:`), color(`${threshold}%`));
  });

  // Current Usage
  if (budget.usage) {
    console.log(chalk.yellow.bold('\n📊 Current Usage'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('Tokens Used:'), chalk.cyan(budget.usage.tokensUsed.toLocaleString()));
    console.log(chalk.white('Cost Used:'), chalk.cyan(`$${budget.usage.costUsed.toFixed(4)}`));
    console.log(chalk.white('Token Usage:'), chalk.cyan(`${budget.usage.tokenUsage}%`));
    console.log(chalk.white('Cost Usage:'), chalk.cyan(`${budget.usage.costUsage}%`));
    
    const usageColor = budget.usage.tokenUsage > 90 ? chalk.red : 
                      budget.usage.tokenUsage > 80 ? chalk.yellow : chalk.green;
    console.log(chalk.white('Status:'), usageColor(budget.usage.status));
  }

  // Usage Projections
  if (budget.projections) {
    console.log(chalk.yellow.bold('\n📈 Usage Projections'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('Daily Average:'), chalk.cyan(budget.projections.dailyAverage.toLocaleString()));
    console.log(chalk.white('Weekly Projection:'), chalk.cyan(budget.projections.weeklyProjection.toLocaleString()));
    console.log(chalk.white('Monthly Projection:'), chalk.cyan(budget.projections.monthlyProjection.toLocaleString()));
    console.log(chalk.white('Days Until Limit:'), chalk.cyan(budget.projections.daysUntilLimit));
  }

  // Recent Alerts
  if (budget.alerts && budget.alerts.length > 0) {
    console.log(chalk.yellow.bold('\n🚨 Recent Alerts'));
    console.log(chalk.gray('─'.repeat(50)));
    budget.alerts.forEach((alert: any, index: number) => {
      const alertColor = alert.severity === 'high' ? chalk.red : 
                        alert.severity === 'medium' ? chalk.yellow : chalk.green;
      console.log(chalk.white(`\n${index + 1}. ${alert.type}:`));
      console.log(chalk.gray(`   ${alert.message}`));
      console.log(chalk.gray(`   Severity: ${alertColor(alert.severity)}`));
      console.log(chalk.gray(`   Time: ${alert.timestamp}`));
    });
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleListBudgets(options: any) {
  logger.info('💰 Listing budget configurations...');

  try {
    const budgets = await listBudgets(options);
    displayBudgetList(budgets, options);
  } catch (error) {
    logger.error('Failed to list budgets:', error);
    process.exit(1);
  }
}

async function listBudgets(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const params = new URLSearchParams();
    if (options.project) params.append('project', options.project);
    if (options.includeUsage) params.append('includeUsage', 'true');
    if (options.includeAlerts) params.append('includeAlerts', 'true');

    const response = await axios.get(`${baseUrl}/api/set-budget/list?${params}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayBudgetList(budgets: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(budgets, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n💰 Budget Configurations'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Summary
  console.log(chalk.yellow.bold('\n📊 Summary'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Total Budgets:'), chalk.cyan(budgets.totalBudgets));
  console.log(chalk.white('Active Budgets:'), chalk.green(budgets.activeBudgets));
  console.log(chalk.white('Over Budget:'), chalk.red(budgets.overBudget));
  console.log(chalk.white('Near Limit:'), chalk.yellow(budgets.nearLimit));

  // Budget List
  console.log(chalk.yellow.bold('\n📋 Budget List'));
  console.log(chalk.gray('─'.repeat(50)));
  
  budgets.budgets.forEach((budget: any, index: number) => {
    const statusColor = budget.status === 'over' ? chalk.red : 
                       budget.status === 'near' ? chalk.yellow : chalk.green;
    const enforceColor = budget.enforce ? chalk.red('Hard') : chalk.yellow('Soft');
    
    console.log(chalk.white(`\n${index + 1}. ${budget.project}:`));
    console.log(chalk.gray('   ─'.repeat(40)));
    console.log(chalk.white('   Status:'), statusColor(budget.status));
    console.log(chalk.white('   Tokens:'), chalk.cyan(`${budget.tokensUsed.toLocaleString()}/${budget.tokensLimit.toLocaleString()}`));
    console.log(chalk.white('   Cost:'), chalk.cyan(`$${budget.costUsed.toFixed(4)}/$${budget.costLimit.toFixed(2)}`));
    console.log(chalk.white('   Usage:'), chalk.cyan(`${budget.usagePercentage}%`));
    console.log(chalk.white('   Enforcement:'), enforceColor);
    console.log(chalk.white('   Notifications:'), chalk.cyan(budget.notify));
    console.log(chalk.white('   Last Updated:'), chalk.gray(budget.lastUpdated));
  });

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleUpdateBudget(options: any) {
  logger.info('💰 Updating budget configuration...');

  try {
    const budget = await updateBudget(options);
    displayBudgetUpdate(budget, options);
  } catch (error) {
    logger.error('Failed to update budget:', error);
    process.exit(1);
  }
}

async function updateBudget(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const params = new URLSearchParams();
    if (options.project) params.append('project', options.project);
    if (options.tokens) params.append('tokens', options.tokens);
    if (options.cost) params.append('cost', options.cost);
    if (options.notify) params.append('notify', options.notify);
    if (options.webhookUrl) params.append('webhookUrl', options.webhookUrl);
    if (options.slackChannel) params.append('slackChannel', options.slackChannel);
    if (options.email) params.append('email', options.email);
    if (options.thresholds) params.append('thresholds', options.thresholds);
    if (options.enforce) params.append('enforce', 'true');
    if (options.disableEnforce) params.append('disableEnforce', 'true');

    const response = await axios.put(`${baseUrl}/api/set-budget/update?${params}`, {
      project: options.project,
      tokens: options.tokens ? parseInt(options.tokens) : undefined,
      cost: options.cost ? parseFloat(options.cost) : undefined,
      notify: options.notify,
      webhookUrl: options.webhookUrl,
      slackChannel: options.slackChannel,
      email: options.email,
      thresholds: options.thresholds ? options.thresholds.split(',').map((t: string) => parseInt(t.trim())) : undefined,
      enforce: options.enforce,
      disableEnforce: options.disableEnforce
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayBudgetUpdate(budget: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(budget, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n💰 Budget Updated Successfully'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Update Summary
  console.log(chalk.yellow.bold('\n📋 Update Summary'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Project:'), chalk.cyan(budget.project));
  console.log(chalk.white('Updated:'), chalk.cyan(budget.updated));
  console.log(chalk.white('Changes Applied:'), chalk.cyan(budget.changesApplied));

  // Updated Configuration
  console.log(chalk.yellow.bold('\n⚙️ Updated Configuration'));
  console.log(chalk.gray('─'.repeat(50)));
  if (budget.tokens) {
    console.log(chalk.white('Token Limit:'), chalk.cyan(budget.tokens.toLocaleString()));
  }
  if (budget.cost) {
    console.log(chalk.white('Cost Limit:'), chalk.cyan(`$${budget.cost.toFixed(2)}`));
  }
  console.log(chalk.white('Enforcement:'), budget.enforce ? chalk.red('Hard Cap') : chalk.yellow('Soft Cap'));
  console.log(chalk.white('Notifications:'), chalk.cyan(budget.notify));

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleDeleteBudget(options: any) {
  logger.info('💰 Deleting budget configuration...');

  try {
    const result = await deleteBudget(options);
    displayBudgetDeletion(result, options);
  } catch (error) {
    logger.error('Failed to delete budget:', error);
    process.exit(1);
  }
}

async function deleteBudget(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const params = new URLSearchParams();
    if (options.project) params.append('project', options.project);
    if (options.confirm) params.append('confirm', 'true');

    const response = await axios.delete(`${baseUrl}/api/set-budget/delete?${params}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayBudgetDeletion(result: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n💰 Budget Deleted Successfully'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  console.log(chalk.yellow.bold('\n📋 Deletion Summary'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Project:'), chalk.cyan(result.project));
  console.log(chalk.white('Deleted:'), chalk.cyan(result.deleted));
  console.log(chalk.white('Alerts Removed:'), chalk.cyan(result.alertsRemoved));
  console.log(chalk.white('Notifications Disabled:'), chalk.cyan(result.notificationsDisabled));

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleBudgetStatus(options: any) {
  logger.info('💰 Checking budget status...');

  try {
    const status = await getBudgetStatus(options);
    displayBudgetStatus(status, options);
  } catch (error) {
    logger.error('Failed to get budget status:', error);
    process.exit(1);
  }
}

async function getBudgetStatus(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const params = new URLSearchParams();
    if (options.project) params.append('project', options.project);
    if (options.includeUsage) params.append('includeUsage', 'true');
    if (options.includeProjections) params.append('includeProjections', 'true');
    if (options.includeAlerts) params.append('includeAlerts', 'true');

    const response = await axios.get(`${baseUrl}/api/set-budget/status?${params}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayBudgetStatus(status: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(status, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n💰 Budget Status'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Status Overview
  console.log(chalk.yellow.bold('\n📊 Status Overview'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Project:'), chalk.cyan(status.project));
  console.log(chalk.white('Status:'), chalk.cyan(status.status));
  console.log(chalk.white('Last Check:'), chalk.cyan(status.lastCheck));

  // Usage Status
  console.log(chalk.yellow.bold('\n📈 Usage Status'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Tokens Used:'), chalk.cyan(status.tokensUsed.toLocaleString()));
  console.log(chalk.white('Token Limit:'), chalk.cyan(status.tokensLimit.toLocaleString()));
  console.log(chalk.white('Token Usage:'), chalk.cyan(`${status.tokenUsage}%`));
  console.log(chalk.white('Cost Used:'), chalk.cyan(`$${status.costUsed.toFixed(4)}`));
  console.log(chalk.white('Cost Limit:'), chalk.cyan(`$${status.costLimit.toFixed(2)}`));
  console.log(chalk.white('Cost Usage:'), chalk.cyan(`${status.costUsage}%`));

  // Alerts
  if (status.alerts && status.alerts.length > 0) {
    console.log(chalk.yellow.bold('\n🚨 Recent Alerts'));
    console.log(chalk.gray('─'.repeat(50)));
    status.alerts.forEach((alert: any, index: number) => {
      const alertColor = alert.severity === 'high' ? chalk.red : 
                        alert.severity === 'medium' ? chalk.yellow : chalk.green;
      console.log(chalk.white(`\n${index + 1}. ${alert.type}:`));
      console.log(chalk.gray(`   ${alert.message}`));
      console.log(chalk.gray(`   Severity: ${alertColor(alert.severity)}`));
      console.log(chalk.gray(`   Time: ${alert.timestamp}`));
    });
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleConfigureAlerts(options: any) {
  logger.info('💰 Configuring budget alerts...');

  try {
    const alerts = await configureAlerts(options);
    displayAlertConfiguration(alerts, options);
  } catch (error) {
    logger.error('Failed to configure alerts:', error);
    process.exit(1);
  }
}

async function configureAlerts(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const params = new URLSearchParams();
    if (options.project) params.append('project', options.project);
    if (options.enableSlack) params.append('enableSlack', 'true');
    if (options.enableEmail) params.append('enableEmail', 'true');
    if (options.enableWebhook) params.append('enableWebhook', 'true');
    if (options.slackChannel) params.append('slackChannel', options.slackChannel);
    if (options.email) params.append('email', options.email);
    if (options.webhookUrl) params.append('webhookUrl', options.webhookUrl);
    if (options.thresholds) params.append('thresholds', options.thresholds);

    const response = await axios.post(`${baseUrl}/api/set-budget/alerts?${params}`, {
      project: options.project,
      enableSlack: options.enableSlack,
      enableEmail: options.enableEmail,
      enableWebhook: options.enableWebhook,
      slackChannel: options.slackChannel,
      email: options.email,
      webhookUrl: options.webhookUrl,
      thresholds: options.thresholds ? options.thresholds.split(',').map((t: string) => parseInt(t.trim())) : [80, 95]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayAlertConfiguration(alerts: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(alerts, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n💰 Alert Configuration'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Configuration Summary
  console.log(chalk.yellow.bold('\n📋 Configuration Summary'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Project:'), chalk.cyan(alerts.project));
  console.log(chalk.white('Status:'), chalk.cyan(alerts.status));

  // Notification Channels
  console.log(chalk.yellow.bold('\n🔔 Notification Channels'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Slack:'), alerts.slackEnabled ? chalk.green('Enabled') : chalk.red('Disabled'));
  if (alerts.slackChannel) {
    console.log(chalk.white('Slack Channel:'), chalk.gray(alerts.slackChannel));
  }
  console.log(chalk.white('Email:'), alerts.emailEnabled ? chalk.green('Enabled') : chalk.red('Disabled'));
  if (alerts.email) {
    console.log(chalk.white('Email Address:'), chalk.gray(alerts.email));
  }
  console.log(chalk.white('Webhook:'), alerts.webhookEnabled ? chalk.green('Enabled') : chalk.red('Disabled'));
  if (alerts.webhookUrl) {
    console.log(chalk.white('Webhook URL:'), chalk.gray(alerts.webhookUrl));
  }

  // Alert Thresholds
  console.log(chalk.yellow.bold('\n⚠️ Alert Thresholds'));
  console.log(chalk.gray('─'.repeat(50)));
  alerts.thresholds.forEach((threshold: number, index: number) => {
    const color = threshold >= 90 ? chalk.red : threshold >= 80 ? chalk.yellow : chalk.green;
    console.log(chalk.white(`Threshold ${index + 1}:`), color(`${threshold}%`));
  });

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleTestNotifications(options: any) {
  logger.info('💰 Testing budget notifications...');

  try {
    const test = await testNotifications(options);
    displayTestResults(test, options);
  } catch (error) {
    logger.error('Failed to test notifications:', error);
    process.exit(1);
  }
}

async function testNotifications(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const params = new URLSearchParams();
    if (options.project) params.append('project', options.project);
    if (options.type) params.append('type', options.type);

    const response = await axios.post(`${baseUrl}/api/set-budget/test?${params}`, {
      project: options.project,
      type: options.type
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayTestResults(test: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(test, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n💰 Notification Test Results'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Test Summary
  console.log(chalk.yellow.bold('\n📋 Test Summary'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Project:'), chalk.cyan(test.project));
  console.log(chalk.white('Test Type:'), chalk.cyan(test.type));
  console.log(chalk.white('Status:'), test.success ? chalk.green('Success') : chalk.red('Failed'));
  console.log(chalk.white('Timestamp:'), chalk.cyan(test.timestamp));

  // Test Results
  console.log(chalk.yellow.bold('\n🔔 Test Results'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Message Sent:'), chalk.cyan(test.messageSent));
  console.log(chalk.white('Response Time:'), chalk.cyan(`${test.responseTime}ms`));
  console.log(chalk.white('Status Code:'), chalk.cyan(test.statusCode));
  
  if (test.error) {
    console.log(chalk.white('Error:'), chalk.red(test.error));
  }

  // Channel Status
  if (test.channels) {
    console.log(chalk.yellow.bold('\n📡 Channel Status'));
    console.log(chalk.gray('─'.repeat(50)));
    Object.entries(test.channels).forEach(([channel, status]: [string, any]) => {
      const statusColor = status.success ? chalk.green : chalk.red;
      console.log(chalk.white(`${channel}:`), statusColor(status.success ? 'Success' : 'Failed'));
      if (status.error) {
        console.log(chalk.gray(`   Error: ${status.error}`));
      }
    });
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}
