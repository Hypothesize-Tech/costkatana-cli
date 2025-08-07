import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function analyticsCommand(program: Command) {
  program
    .command('analytics')
    .description('📊 Analyze usage analytics with detailed breakdowns')
    .option('-d, --days <number>', 'Number of days to analyze', '30')
    .option('-r, --range <range>', 'Time range (1h, 24h, 7d, 30d)', '30d')
    .option('-p, --project <project>', 'Filter by specific project')
    .option('-u, --user <user>', 'Filter by specific user')
    .option('-f, --format <format>', 'Output format (table, json, csv)', 'table')
    .option('-v, --verbose', 'Show detailed breakdowns')
    .option('--export <path>', 'Export analytics to file')
    .action(async (options) => {
      try {
        await handleAnalytics(options);
      } catch (error) {
        logger.error('Analytics failed:', error);
        process.exit(1);
      }
    });
}

async function handleAnalytics(options: any) {
  logger.info('📊 Fetching usage analytics...');

  try {
    const analytics = await fetchAnalytics(options);
    displayAnalytics(analytics, options);
  } catch (error) {
    logger.error('Failed to fetch analytics:', error);
    process.exit(1);
  }
}

async function fetchAnalytics(options: any) {
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

  // Convert range to days if specified
  let days = options.days;
  if (options.range) {
    days = convertRangeToDays(options.range);
  }

  const params = new URLSearchParams({
    days: days.toString(),
    format: options.format || 'table',
    includeBreakdown: 'true',
    includeTeamUsage: 'true',
  });

  if (options.project) {
    params.append('project', options.project);
  }

  if (options.user) {
    params.append('user', options.user);
  }

  try {
    const response = await axios.get(`${baseUrl}/api/usage/analytics/cli?${params}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    if (response.status !== 200) {
      throw new Error(`API returned status ${response.status}`);
    }

    return response.data;
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

function convertRangeToDays(range: string): number {
  switch (range.toLowerCase()) {
    case '1h':
      return 1; // 1 hour = 1 day for analytics purposes
    case '24h':
      return 1;
    case '7d':
      return 7;
    case '30d':
      return 30;
    default: {
      // Try to parse as number of days
      const days = parseInt(range);
      if (!isNaN(days)) {
        return days;
      }
      // Default to 30 days
      return 30;
    }
  }
}

function displayAnalytics(analytics: any, options: any) {
  const format = options.format || 'table';
  const verbose = options.verbose;

  switch (format) {
    case 'json':
      displayAnalyticsJson(analytics, verbose);
      break;
    case 'csv':
      displayAnalyticsCsv(analytics, verbose);
      break;
    case 'table':
    default:
      displayAnalyticsTable(analytics, verbose);
      break;
  }

  // Export if requested
  if (options.export) {
    exportAnalytics(analytics, options.export, format);
  }
}

function displayAnalyticsTable(analytics: any, verbose: boolean) {
  console.log(chalk.cyan.bold('\n📊 Usage Analytics Report'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Show project info if available
  if (analytics.project) {
    console.log(chalk.yellow.bold('\n🏢 Project:'), chalk.white(analytics.project));
  }

  // 1. Total Cost
  displayTotalCost(analytics.totalCost);

  // 2. Token Usage Breakdown
  displayTokenUsageBreakdown(analytics.tokenUsage, verbose);

  // 3. Top Models by Spend
  displayTopModelsBySpend(analytics.topModelsBySpend, verbose);

  // 4. Team Member Usage
  displayTeamMemberUsage(analytics.teamUsage, verbose);

  // Additional insights if available
  if (analytics.insights && analytics.insights.length > 0) {
    displayInsights(analytics.insights);
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

function displayTotalCost(totalCost: any) {
  console.log(chalk.yellow.bold('\n💰 Total Cost'));
  console.log(chalk.gray('─'.repeat(30)));
  
  if (totalCost) {
    const currentPeriod = chalk.green(`$${totalCost.currentPeriod?.toFixed(4) || '0.00'}`);
    const previousPeriod = chalk.gray(`$${totalCost.previousPeriod?.toFixed(4) || '0.00'}`);
    const change = totalCost.change || 0;
    const changeSymbol = change > 0 ? chalk.red('↗') : change < 0 ? chalk.green('↘') : chalk.gray('→');
    const changeColor = change > 0 ? chalk.red : change < 0 ? chalk.green : chalk.gray;
    
    console.log(chalk.white('Current Period:'), currentPeriod);
    console.log(chalk.white('Previous Period:'), previousPeriod);
    console.log(chalk.white('Change:'), `${changeColor(`${changeSymbol} ${Math.abs(change).toFixed(2)}%`)}`);
    
    if (totalCost.budget && totalCost.budget > 0) {
      const budgetUsage = (totalCost.currentPeriod / totalCost.budget) * 100;
      const budgetColor = budgetUsage > 80 ? chalk.red : budgetUsage > 60 ? chalk.yellow : chalk.green;
      console.log(chalk.white('Budget Usage:'), budgetColor(`${budgetUsage.toFixed(1)}%`));
    }
  } else {
    console.log(chalk.gray('No cost data available'));
  }
}

function displayTokenUsageBreakdown(tokenUsage: any, verbose: boolean) {
  console.log(chalk.yellow.bold('\n🔢 Token Usage Breakdown'));
  console.log(chalk.gray('─'.repeat(30)));
  
  if (tokenUsage && tokenUsage.total) {
    const total = tokenUsage.total.toLocaleString();
    const input = tokenUsage.input?.toLocaleString() || '0';
    const output = tokenUsage.output?.toLocaleString() || '0';
    const inputPercentage = tokenUsage.inputPercentage?.toFixed(1) || '0';
    const outputPercentage = tokenUsage.outputPercentage?.toFixed(1) || '0';
    
    console.log(chalk.white('Total Tokens:'), chalk.cyan(total));
    console.log(chalk.white('Input Tokens:'), chalk.blue(`${input} (${inputPercentage}%)`));
    console.log(chalk.white('Output Tokens:'), chalk.green(`${output} (${outputPercentage}%)`));
    
    if (verbose && tokenUsage.byModel) {
      console.log(chalk.gray('\n  Breakdown by Model:'));
      tokenUsage.byModel.forEach((model: any) => {
        const name = chalk.white(model.model);
        const tokens = chalk.cyan(model.tokens.toLocaleString());
        const percentage = chalk.gray(`${model.percentage.toFixed(1)}%`);
        console.log(`    ${name}: ${tokens} (${percentage})`);
      });
    }
  } else {
    console.log(chalk.gray('No token usage data available'));
  }
}

function displayTopModelsBySpend(topModels: any, verbose: boolean) {
  console.log(chalk.yellow.bold('\n🤖 Top Models by Spend'));
  console.log(chalk.gray('─'.repeat(30)));
  
  if (topModels && topModels.length > 0) {
    topModels.forEach((model: any, index: number) => {
      const rank = chalk.yellow(`#${index + 1}`);
      const name = chalk.white(model.model);
      const cost = chalk.green(`$${model.totalCost?.toFixed(4) || '0.00'}`);
      const requests = chalk.gray(`${model.requests?.toLocaleString() || '0'} requests`);
      const percentage = chalk.blue(`${model.percentage?.toFixed(1) || '0'}%`);
      
      console.log(`${rank} ${name}: ${cost} (${requests}, ${percentage})`);
      
      if (verbose && model.details) {
        console.log(chalk.gray(`    Avg cost/request: $${model.details.avgCostPerRequest?.toFixed(4) || '0.00'}`));
        console.log(chalk.gray(`    Total tokens: ${model.details.totalTokens?.toLocaleString() || '0'}`));
        console.log(chalk.gray(`    Success rate: ${model.details.successRate?.toFixed(1) || '0'}%`));
        console.log('');
      }
    });
  } else {
    console.log(chalk.gray('No model usage data available'));
  }
}

function displayTeamMemberUsage(teamUsage: any, verbose: boolean) {
  console.log(chalk.yellow.bold('\n👥 Team Member Usage'));
  console.log(chalk.gray('─'.repeat(30)));
  
  if (teamUsage && teamUsage.length > 0) {
    teamUsage.forEach((member: any, index: number) => {
      const rank = chalk.yellow(`#${index + 1}`);
      const name = chalk.white(member.name || member.email);
      const cost = chalk.green(`$${member.totalCost?.toFixed(4) || '0.00'}`);
      const requests = chalk.gray(`${member.requests?.toLocaleString() || '0'} requests`);
      const percentage = chalk.blue(`${member.percentage?.toFixed(1) || '0'}%`);
      
      console.log(`${rank} ${name}: ${cost} (${requests}, ${percentage})`);
      
      if (verbose && member.details) {
        console.log(chalk.gray(`    Top model: ${member.details.topModel || 'N/A'}`));
        console.log(chalk.gray(`    Avg cost/request: $${member.details.avgCostPerRequest?.toFixed(4) || '0.00'}`));
        console.log(chalk.gray(`    Last active: ${member.details.lastActive || 'N/A'}`));
        console.log('');
      }
    });
  } else {
    console.log(chalk.gray('No team usage data available'));
  }
}

function displayInsights(insights: any[]) {
  console.log(chalk.yellow.bold('\n💡 Insights'));
  console.log(chalk.gray('─'.repeat(30)));
  
  insights.forEach((insight: any) => {
    const type = insight.type === 'warning' ? chalk.red('⚠️') : 
                 insight.type === 'suggestion' ? chalk.blue('💡') : 
                 insight.type === 'success' ? chalk.green('✅') :
                 chalk.yellow('ℹ️');
    console.log(`${type} ${insight.message}`);
  });
}

function displayAnalyticsJson(analytics: any, verbose: boolean) {
  const output = verbose ? analytics : {
    totalCost: analytics.totalCost,
    tokenUsage: analytics.tokenUsage,
    topModelsBySpend: analytics.topModelsBySpend,
    teamUsage: analytics.teamUsage,
    insights: analytics.insights,
  };

  console.log(JSON.stringify(output, null, 2));
}

function displayAnalyticsCsv(analytics: any, verbose: boolean) {
  // Total Cost CSV
  if (analytics.totalCost) {
    console.log('Total Cost');
    console.log('Current Period,Previous Period,Change %,Budget Usage %');
    const cost = analytics.totalCost;
    const budgetUsage = cost.budget && cost.budget > 0 ? (cost.currentPeriod / cost.budget) * 100 : 0;
    console.log(`${cost.currentPeriod || 0},${cost.previousPeriod || 0},${cost.change || 0},${budgetUsage.toFixed(2)}`);
    console.log('');
  }

  // Token Usage CSV
  if (analytics.tokenUsage) {
    console.log('Token Usage');
    console.log('Total Tokens,Input Tokens,Output Tokens,Input %,Output %');
    const usage = analytics.tokenUsage;
    console.log(`${usage.total || 0},${usage.input || 0},${usage.output || 0},${usage.inputPercentage || 0},${usage.outputPercentage || 0}`);
    console.log('');
  }

  // Top Models CSV
  if (analytics.topModelsBySpend) {
    console.log('Top Models by Spend');
    console.log('Rank,Model,Total Cost,Requests,Percentage,Avg Cost/Request');
    analytics.topModelsBySpend.forEach((model: any, index: number) => {
      console.log(`${index + 1},"${model.model || 'Unknown'}",${model.totalCost || 0},${model.requests || 0},${model.percentage || 0},${model.details?.avgCostPerRequest || 0}`);
    });
    console.log('');
  }

  // Team Usage CSV
  if (analytics.teamUsage) {
    console.log('Team Member Usage');
    console.log('Rank,Name,Total Cost,Requests,Percentage,Top Model');
    analytics.teamUsage.forEach((member: any, index: number) => {
      console.log(`${index + 1},"${member.name || member.email || 'Unknown'}",${member.totalCost || 0},${member.requests || 0},${member.percentage || 0},"${member.details?.topModel || 'N/A'}"`);
    });
  }
}

function exportAnalytics(analytics: any, filePath: string, format: string) {
  const fs = require('fs');
  const path = require('path');

  try {
    const fullPath = path.resolve(filePath);
    let content = '';

    if (format === 'json') {
      content = JSON.stringify(analytics, null, 2);
    } else if (format === 'csv') {
      const lines = [];
      
      // Total Cost
      if (analytics.totalCost) {
        lines.push('Total Cost');
        lines.push('Current Period,Previous Period,Change %,Budget Usage %');
        const cost = analytics.totalCost;
        const budgetUsage = cost.budget && cost.budget > 0 ? (cost.currentPeriod / cost.budget) * 100 : 0;
        lines.push(`${cost.currentPeriod || 0},${cost.previousPeriod || 0},${cost.change || 0},${budgetUsage.toFixed(2)}`);
        lines.push('');
      }

      // Token Usage
      if (analytics.tokenUsage) {
        lines.push('Token Usage');
        lines.push('Total Tokens,Input Tokens,Output Tokens,Input %,Output %');
        const usage = analytics.tokenUsage;
        lines.push(`${usage.total || 0},${usage.input || 0},${usage.output || 0},${usage.inputPercentage || 0},${usage.outputPercentage || 0}`);
        lines.push('');
      }

      // Top Models
      if (analytics.topModelsBySpend) {
        lines.push('Top Models by Spend');
        lines.push('Rank,Model,Total Cost,Requests,Percentage,Avg Cost/Request');
        analytics.topModelsBySpend.forEach((model: any, index: number) => {
          lines.push(`${index + 1},"${model.model || 'Unknown'}",${model.totalCost || 0},${model.requests || 0},${model.percentage || 0},${model.details?.avgCostPerRequest || 0}`);
        });
        lines.push('');
      }

      // Team Usage
      if (analytics.teamUsage) {
        lines.push('Team Member Usage');
        lines.push('Rank,Name,Total Cost,Requests,Percentage,Top Model');
        analytics.teamUsage.forEach((member: any, index: number) => {
          lines.push(`${index + 1},"${member.name || member.email || 'Unknown'}",${member.totalCost || 0},${member.requests || 0},${member.percentage || 0},"${member.details?.topModel || 'N/A'}"`);
        });
      }

      content = lines.join('\n');
    }

    // Ensure directory exists
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content);
    logger.success(`Analytics exported to: ${fullPath}`);
  } catch (error) {
    logger.error('Failed to export analytics:', error);
  }
}
