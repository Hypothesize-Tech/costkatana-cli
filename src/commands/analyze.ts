import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function analyzeCommand(program: Command) {
  program
    .command('analyze')
    .description('Analyze AI usage costs and performance')
    .option('-d, --days <number>', 'Number of days to analyze', '30')
    .option('-m, --model <model>', 'Filter by specific model')
    .option('-p, --provider <provider>', 'Filter by provider')
    .option('-f, --format <format>', 'Output format (table, json, csv)', 'table')
    .option('-v, --verbose', 'Show detailed analysis')
    .option('--export <path>', 'Export analysis to file')
    .action(async (options) => {
      try {
        await handleAnalyze(options);
      } catch (error) {
        logger.error('Analysis failed:', error);
        process.exit(1);
      }
    });
}

async function handleAnalyze(options: any) {
  logger.info('📊 Analyzing AI usage costs...');

  try {
    const analysis = await fetchAnalysis(options);
    displayAnalysis(analysis, options);
  } catch (error) {
    logger.error('Failed to fetch analysis:', error);
    process.exit(1);
  }
}

async function fetchAnalysis(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Missing configuration. Run "cost-katana init" to set up.');
  }

  const params = new URLSearchParams({
    days: options.days.toString(),
    format: options.format || 'table',
  });

  if (options.model) {
    params.append('model', options.model);
  }

  if (options.provider) {
    params.append('provider', options.provider);
  }

  try {
    const response = await axios.get(`${baseUrl}/analytics/costs?${params}`, {
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

function displayAnalysis(analysis: any, options: any) {
  const format = options.format || 'table';
  const verbose = options.verbose;

  switch (format) {
    case 'json':
      displayAnalysisJson(analysis, verbose);
      break;
    case 'csv':
      displayAnalysisCsv(analysis, verbose);
      break;
    case 'table':
    default:
      displayAnalysisTable(analysis, verbose);
      break;
  }

  // Export if requested
  if (options.export) {
    exportAnalysis(analysis, options.export, format);
  }
}

function displayAnalysisTable(analysis: any, verbose: boolean) {
  console.log(chalk.cyan.bold('\n📈 Cost Analysis Report'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Summary
  if (analysis.summary) {
    console.log(chalk.yellow.bold('\n📊 Summary'));
    console.log(chalk.gray('─'.repeat(20)));
    
    const summary = analysis.summary;
    console.log(chalk.yellow('Total Cost:'), `$${summary.totalCost?.toFixed(4) || '0.00'}`);
    console.log(chalk.yellow('Total Requests:'), summary.totalRequests?.toLocaleString() || '0');
    console.log(chalk.yellow('Total Tokens:'), summary.totalTokens?.toLocaleString() || '0');
    console.log(chalk.yellow('Average Cost/Request:'), `$${summary.avgCostPerRequest?.toFixed(4) || '0.00'}`);
    console.log(chalk.yellow('Average Tokens/Request:'), summary.avgTokensPerRequest?.toFixed(0) || '0');
  }

  // Cost by Model
  if (analysis.costsByModel && analysis.costsByModel.length > 0) {
    console.log(chalk.yellow.bold('\n🤖 Cost by Model'));
    console.log(chalk.gray('─'.repeat(20)));
    
    analysis.costsByModel.forEach((model: any) => {
      const name = chalk.white(model.model || 'Unknown');
      const cost = chalk.green(`$${model.totalCost?.toFixed(4) || '0.00'}`);
      const requests = chalk.gray(`${model.requests?.toLocaleString() || '0'} requests`);
      const percentage = chalk.blue(`${model.percentage?.toFixed(1) || '0'}%`);
      
      console.log(`${name}: ${cost} (${requests}, ${percentage})`);
      
      if (verbose && model.details) {
        console.log(chalk.gray(`  Input tokens: ${model.details.inputTokens?.toLocaleString() || '0'}`));
        console.log(chalk.gray(`  Output tokens: ${model.details.outputTokens?.toLocaleString() || '0'}`));
        console.log(chalk.gray(`  Avg cost/request: $${model.details.avgCostPerRequest?.toFixed(4) || '0.00'}`));
        console.log('');
      }
    });
  }

  // Cost by Provider
  if (analysis.costsByProvider && analysis.costsByProvider.length > 0) {
    console.log(chalk.yellow.bold('\n🏢 Cost by Provider'));
    console.log(chalk.gray('─'.repeat(20)));
    
    analysis.costsByProvider.forEach((provider: any) => {
      const name = chalk.white(provider.provider || 'Unknown');
      const cost = chalk.green(`$${provider.totalCost?.toFixed(4) || '0.00'}`);
      const requests = chalk.gray(`${provider.requests?.toLocaleString() || '0'} requests`);
      const percentage = chalk.blue(`${provider.percentage?.toFixed(1) || '0'}%`);
      
      console.log(`${name}: ${cost} (${requests}, ${percentage})`);
    });
  }

  // Daily Trends
  if (analysis.dailyTrends && analysis.dailyTrends.length > 0) {
    console.log(chalk.yellow.bold('\n📅 Daily Trends'));
    console.log(chalk.gray('─'.repeat(20)));
    
    const recentDays = analysis.dailyTrends.slice(-7); // Last 7 days
    recentDays.forEach((day: any) => {
      const date = chalk.white(day.date);
      const cost = chalk.green(`$${day.cost?.toFixed(4) || '0.00'}`);
      const requests = chalk.gray(`${day.requests || '0'} requests`);
      
      console.log(`${date}: ${cost} (${requests})`);
    });
  }

  // Top Expensive Requests
  if (analysis.topExpensiveRequests && analysis.topExpensiveRequests.length > 0) {
    console.log(chalk.yellow.bold('\n💰 Top Expensive Requests'));
    console.log(chalk.gray('─'.repeat(20)));
    
    analysis.topExpensiveRequests.slice(0, 5).forEach((request: any, index: number) => {
      const rank = chalk.yellow(`#${index + 1}`);
      const cost = chalk.red(`$${request.cost?.toFixed(4) || '0.00'}`);
      const model = chalk.blue(request.model || 'Unknown');
      const tokens = chalk.gray(`${request.tokens?.toLocaleString() || '0'} tokens`);
      
      console.log(`${rank} ${cost} - ${model} (${tokens})`);
      
      if (verbose && request.prompt) {
        const preview = request.prompt.length > 100 
          ? request.prompt.substring(0, 100) + '...'
          : request.prompt;
        console.log(chalk.gray(`  Prompt: ${preview}`));
      }
      console.log('');
    });
  }

  // Insights
  if (analysis.insights && analysis.insights.length > 0) {
    console.log(chalk.yellow.bold('\n💡 Insights'));
    console.log(chalk.gray('─'.repeat(20)));
    
    analysis.insights.forEach((insight: any) => {
      const type = insight.type === 'warning' ? chalk.red('⚠️') : 
                   insight.type === 'suggestion' ? chalk.blue('💡') : 
                   chalk.green('✅');
      console.log(`${type} ${insight.message}`);
    });
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

function displayAnalysisJson(analysis: any, verbose: boolean) {
  const output = verbose ? analysis : {
    summary: analysis.summary,
    costsByModel: analysis.costsByModel,
    costsByProvider: analysis.costsByProvider,
    insights: analysis.insights,
  };

  console.log(JSON.stringify(output, null, 2));
}

function displayAnalysisCsv(analysis: any, verbose: boolean) {
  // Summary CSV
  if (analysis.summary) {
    console.log('Summary');
    console.log('Total Cost,Total Requests,Total Tokens,Avg Cost/Request,Avg Tokens/Request');
    const summary = analysis.summary;
    console.log(`${summary.totalCost || 0},${summary.totalRequests || 0},${summary.totalTokens || 0},${summary.avgCostPerRequest || 0},${summary.avgTokensPerRequest || 0}`);
    console.log('');
  }

  // Models CSV
  if (analysis.costsByModel) {
    console.log('Model,Total Cost,Requests,Percentage,Input Tokens,Output Tokens');
    analysis.costsByModel.forEach((model: any) => {
      console.log(`"${model.model || 'Unknown'}",${model.totalCost || 0},${model.requests || 0},${model.percentage || 0},${model.details?.inputTokens || 0},${model.details?.outputTokens || 0}`);
    });
    console.log('');
  }

  // Providers CSV
  if (analysis.costsByProvider) {
    console.log('Provider,Total Cost,Requests,Percentage');
    analysis.costsByProvider.forEach((provider: any) => {
      console.log(`"${provider.provider || 'Unknown'}",${provider.totalCost || 0},${provider.requests || 0},${provider.percentage || 0}`);
    });
  }
}

function exportAnalysis(analysis: any, filePath: string, format: string) {
  const fs = require('fs');
  const path = require('path');

  try {
    const fullPath = path.resolve(filePath);
    let content = '';

    if (format === 'json') {
      content = JSON.stringify(analysis, null, 2);
    } else if (format === 'csv') {
      // Generate CSV content
      const lines = [];
      
      // Summary
      if (analysis.summary) {
        lines.push('Summary');
        lines.push('Total Cost,Total Requests,Total Tokens,Avg Cost/Request,Avg Tokens/Request');
        const summary = analysis.summary;
        lines.push(`${summary.totalCost || 0},${summary.totalRequests || 0},${summary.totalTokens || 0},${summary.avgCostPerRequest || 0},${summary.avgTokensPerRequest || 0}`);
        lines.push('');
      }

      // Models
      if (analysis.costsByModel) {
        lines.push('Model,Total Cost,Requests,Percentage,Input Tokens,Output Tokens');
        analysis.costsByModel.forEach((model: any) => {
          lines.push(`"${model.model || 'Unknown'}",${model.totalCost || 0},${model.requests || 0},${model.percentage || 0},${model.details?.inputTokens || 0},${model.details?.outputTokens || 0}`);
        });
        lines.push('');
      }

      // Providers
      if (analysis.costsByProvider) {
        lines.push('Provider,Total Cost,Requests,Percentage');
        analysis.costsByProvider.forEach((provider: any) => {
          lines.push(`"${provider.provider || 'Unknown'}",${provider.totalCost || 0},${provider.requests || 0},${provider.percentage || 0}`);
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
    logger.success(`Analysis exported to: ${fullPath}`);
  } catch (error) {
    logger.error('Failed to export analysis:', error);
  }
} 