import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function budgetCommand(program: Command) {
  program
    .command('budget')
    .description('💸 Manage and monitor budget alerts')
    .option('status', 'Show current budget status')
    .option('--project <project>', 'Filter by specific project')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export budget data to file')
    .action(async (options) => {
      try {
        await handleBudget(options);
      } catch (error) {
        logger.error('Budget command failed:', error);
        process.exit(1);
      }
    });
}

async function handleBudget(options: any) {
  logger.info('💸 Checking budget status...');

  try {
    const budgetData = await getBudgetStatus(options);
    displayBudgetStatus(budgetData, options);
  } catch (error) {
    logger.error('Failed to get budget status:', error);
    process.exit(1);
  }
}

async function getBudgetStatus(options: any) {
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
    const params = new URLSearchParams();
    if (options.project) {
      params.append('project', options.project);
    }

    const response = await axios.get(`${baseUrl}/api/budget/status?${params}`, {
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

function displayBudgetStatus(budgetData: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    displayBudgetJson(budgetData);
    return;
  } else if (format === 'csv') {
    displayBudgetCsv(budgetData);
    return;
  }

  console.log(chalk.cyan.bold('\n💸 Budget Status'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Overall Budget Status
  if (budgetData.overall) {
    displayOverallBudget(budgetData.overall);
  }

  // Project-specific budgets
  if (budgetData.projects && budgetData.projects.length > 0) {
    console.log(chalk.yellow.bold('\n📊 Project Budgets'));
    console.log(chalk.gray('─'.repeat(50)));
    
    budgetData.projects.forEach((project: any, index: number) => {
      displayProjectBudget(project, index + 1);
    });
  }

  // Budget Alerts
  if (budgetData.alerts && budgetData.alerts.length > 0) {
    console.log(chalk.yellow.bold('\n🚨 Budget Alerts'));
    console.log(chalk.gray('─'.repeat(50)));
    
    budgetData.alerts.forEach((alert: any, index: number) => {
      displayBudgetAlert(alert, index + 1);
    });
  }

  // Budget Recommendations
  if (budgetData.recommendations && budgetData.recommendations.length > 0) {
    console.log(chalk.yellow.bold('\n💡 Budget Recommendations'));
    console.log(chalk.gray('─'.repeat(50)));
    
    budgetData.recommendations.forEach((rec: any, index: number) => {
      displayBudgetRecommendation(rec, index + 1);
    });
  }

  // Export if requested
  if (options.export) {
    exportBudgetData(budgetData, options.export);
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

function displayOverallBudget(overall: any) {
  const usagePercentage = overall.usagePercentage || 0;
  const budget = overall.budget || 0;
  const used = overall.used || 0;
  const cost = overall.cost || 0;
  const remaining = overall.remaining || 0;

  // Determine status color and icon
  let statusIcon = '🟢';
  let statusColor = chalk.green;
  
  if (usagePercentage >= 90) {
    statusIcon = '🔴';
    statusColor = chalk.red;
  } else if (usagePercentage >= 75) {
    statusIcon = '🟡';
    statusColor = chalk.yellow;
  } else if (usagePercentage >= 50) {
    statusIcon = '🟠';
    statusColor = chalk.yellow;
  }

  console.log(chalk.yellow.bold('\n📈 Overall Budget Status'));
  console.log(chalk.gray('─'.repeat(50)));
  
  console.log(`${statusIcon} ${statusColor(`You've used ${usagePercentage.toFixed(1)}% of your ${budget.toLocaleString()} token budget this month.`)}`);
  console.log(chalk.white(`📊 Tokens Used: ${used.toLocaleString()}`));
  console.log(chalk.white(`💰 Cost: $${cost.toFixed(2)}`));
  console.log(chalk.white(`📉 Remaining: ${remaining.toLocaleString()} tokens`));
  
  // Progress bar
  const progressBar = generateProgressBar(usagePercentage);
  console.log(chalk.gray(`Progress: ${progressBar} ${usagePercentage.toFixed(1)}%`));
}

function displayProjectBudget(project: any, index: number) {
  const name = project.name || 'Unknown Project';
  const usagePercentage = project.usagePercentage || 0;
  const used = project.used || 0;
  const cost = project.cost || 0;

  // Determine status color
  let statusColor = chalk.green;
  if (usagePercentage >= 90) {
    statusColor = chalk.red;
  } else if (usagePercentage >= 75) {
    statusColor = chalk.yellow;
  } else if (usagePercentage >= 50) {
    statusColor = chalk.yellow;
  }

  console.log(chalk.white(`${index}. ${name}`));
  console.log(chalk.gray(`   Usage: ${statusColor(`${usagePercentage.toFixed(1)}%`)} | Tokens: ${used.toLocaleString()} | Cost: $${cost.toFixed(2)}`));
  
  // Progress bar for project
  const progressBar = generateProgressBar(usagePercentage);
  console.log(chalk.gray(`   ${progressBar} ${usagePercentage.toFixed(1)}%`));
  console.log('');
}

function displayBudgetAlert(alert: any, index: number) {
  const type = alert.type || 'general';
  const message = alert.message || '';
  const severity = alert.severity || 'medium';
  const timestamp = alert.timestamp || '';

  let severityColor = chalk.yellow;
  let severityIcon = '⚠️';
  
  if (severity === 'high') {
    severityColor = chalk.red;
    severityIcon = '🚨';
  } else if (severity === 'low') {
    severityColor = chalk.blue;
    severityIcon = 'ℹ️';
  }

  console.log(chalk.white(`${index}. ${severityIcon} ${severityColor(type.toUpperCase())}`));
  console.log(chalk.gray(`   ${message}`));
  if (timestamp) {
    console.log(chalk.gray(`   Time: ${timestamp}`));
  }
  console.log('');
}

function displayBudgetRecommendation(rec: any, index: number) {
  const type = rec.type || 'general';
  const message = rec.message || '';
  const impact = rec.impact || 'medium';
  const savings = rec.estimatedSavings || 0;

  let impactColor = chalk.yellow;
  let impactIcon = '💡';
  
  if (impact === 'high') {
    impactColor = chalk.green;
    impactIcon = '💰';
  } else if (impact === 'low') {
    impactColor = chalk.blue;
    impactIcon = '💭';
  }

  console.log(chalk.white(`${index}. ${impactIcon} ${impactColor(type.toUpperCase())}`));
  console.log(chalk.gray(`   ${message}`));
  if (savings > 0) {
    console.log(chalk.green(`   Estimated Savings: $${savings.toFixed(2)}`));
  }
  console.log('');
}

function generateProgressBar(percentage: number): string {
  const width = 20;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const filled = Math.round((clampedPercentage / 100) * width);
  const empty = width - filled;
  
  const filledBar = '█'.repeat(filled);
  const emptyBar = '░'.repeat(empty);
  
  return filledBar + emptyBar;
}

function displayBudgetJson(budgetData: any) {
  console.log(JSON.stringify(budgetData, null, 2));
}

function displayBudgetCsv(budgetData: any) {
  console.log('Project,Usage %,Budget,Used,Cost,Remaining,Status');
  
  if (budgetData.overall) {
    const overall = budgetData.overall;
    const status = overall.usagePercentage >= 90 ? 'CRITICAL' : 
                   overall.usagePercentage >= 75 ? 'WARNING' : 
                   overall.usagePercentage >= 50 ? 'NOTICE' : 'GOOD';
    
    console.log(`Overall,${overall.usagePercentage?.toFixed(1) || 0},${overall.budget || 0},${overall.used || 0},${overall.cost || 0},${overall.remaining || 0},"${status}"`);
  }
  
  if (budgetData.projects) {
    budgetData.projects.forEach((project: any) => {
      const status = project.usagePercentage >= 90 ? 'CRITICAL' : 
                     project.usagePercentage >= 75 ? 'WARNING' : 
                     project.usagePercentage >= 50 ? 'NOTICE' : 'GOOD';
      
      console.log(`"${project.name || 'Unknown'}",${project.usagePercentage?.toFixed(1) || 0},${project.budget || 0},${project.used || 0},${project.cost || 0},${project.remaining || 0},"${status}"`);
    });
  }
}

function exportBudgetData(budgetData: any, filePath: string) {
  try {
    const fullPath = require('path').resolve(filePath);
    const fs = require('fs');
    const content = JSON.stringify(budgetData, null, 2);
    
    // Ensure directory exists
    const dir = require('path').dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content);
    logger.success(`Budget data exported to: ${fullPath}`);
  } catch (error) {
    logger.error('Failed to export budget data:', error);
  }
}
