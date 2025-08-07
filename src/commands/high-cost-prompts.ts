import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function highCostPromptsCommand(program: Command) {
  const highCostGroup = program
    .command('high-cost-prompts')
    .description('📈 List your most expensive prompts by cost or token consumption');

  // Main high-cost-prompts command
  highCostGroup
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export high-cost prompts data to file')
    .option('-v, --verbose', 'Show detailed cost analysis')
    .action(async (options) => {
      try {
        await handleHighCostPrompts(options);
      } catch (error) {
        logger.error('High cost prompts command failed:', error);
        process.exit(1);
      }
    });

  // List high cost prompts by range
  highCostGroup
    .command('range')
    .description('📈 List high cost prompts for a specific time range')
    .option('-r, --range <range>', 'Time range (1d, 7d, 30d, 90d)', '7d')
    .option('--project <project>', 'Filter by project ID')
    .option('--user <email>', 'Filter by user email')
    .option('--model <model>', 'Filter by model name')
    .option('--sort-by <sortBy>', 'Sort by (cost, tokens, frequency, avg-cost)', 'cost')
    .option('--limit <limit>', 'Number of prompts to show', '20')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export high-cost prompts data to file')
    .option('-v, --verbose', 'Show detailed cost analysis')
    .option('--include-optimizations', 'Include optimization suggestions')
    .option('--include-breakdown', 'Include detailed cost breakdown')
    .option('--include-trends', 'Include cost trends analysis')
    .action(async (options) => {
      try {
        await handleHighCostPromptsByRange(options);
      } catch (error) {
        logger.error('High cost prompts by range failed:', error);
        process.exit(1);
      }
    });

  // List high cost prompts by project
  highCostGroup
    .command('project <projectId>')
    .description('📈 List high cost prompts for a specific project')
    .option('-r, --range <range>', 'Time range (1d, 7d, 30d, 90d)', '7d')
    .option('--user <email>', 'Filter by user email')
    .option('--model <model>', 'Filter by model name')
    .option('--sort-by <sortBy>', 'Sort by (cost, tokens, frequency, avg-cost)', 'cost')
    .option('--limit <limit>', 'Number of prompts to show', '20')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export high-cost prompts data to file')
    .option('-v, --verbose', 'Show detailed cost analysis')
    .option('--include-optimizations', 'Include optimization suggestions')
    .option('--include-breakdown', 'Include detailed cost breakdown')
    .option('--include-trends', 'Include cost trends analysis')
    .action(async (projectId, options) => {
      try {
        await handleHighCostPromptsByProject(projectId, options);
      } catch (error) {
        logger.error('High cost prompts by project failed:', error);
        process.exit(1);
      }
    });

  // List high cost prompts by user
  highCostGroup
    .command('user <email>')
    .description('📈 List high cost prompts for a specific user')
    .option('-r, --range <range>', 'Time range (1d, 7d, 30d, 90d)', '7d')
    .option('--project <project>', 'Filter by project ID')
    .option('--model <model>', 'Filter by model name')
    .option('--sort-by <sortBy>', 'Sort by (cost, tokens, frequency, avg-cost)', 'cost')
    .option('--limit <limit>', 'Number of prompts to show', '20')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export high-cost prompts data to file')
    .option('-v, --verbose', 'Show detailed cost analysis')
    .option('--include-optimizations', 'Include optimization suggestions')
    .option('--include-breakdown', 'Include detailed cost breakdown')
    .option('--include-trends', 'Include cost trends analysis')
    .action(async (email, options) => {
      try {
        await handleHighCostPromptsByUser(email, options);
      } catch (error) {
        logger.error('High cost prompts by user failed:', error);
        process.exit(1);
      }
    });

  // List high cost prompts by model
  highCostGroup
    .command('model <modelName>')
    .description('📈 List high cost prompts for a specific model')
    .option('-r, --range <range>', 'Time range (1d, 7d, 30d, 90d)', '7d')
    .option('--project <project>', 'Filter by project ID')
    .option('--user <email>', 'Filter by user email')
    .option('--sort-by <sortBy>', 'Sort by (cost, tokens, frequency, avg-cost)', 'cost')
    .option('--limit <limit>', 'Number of prompts to show', '20')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export high-cost prompts data to file')
    .option('-v, --verbose', 'Show detailed cost analysis')
    .option('--include-optimizations', 'Include optimization suggestions')
    .option('--include-breakdown', 'Include detailed cost breakdown')
    .option('--include-trends', 'Include cost trends analysis')
    .action(async (modelName, options) => {
      try {
        await handleHighCostPromptsByModel(modelName, options);
      } catch (error) {
        logger.error('High cost prompts by model failed:', error);
        process.exit(1);
      }
    });

  // High cost prompts summary
  highCostGroup
    .command('summary')
    .description('📊 Show high cost prompts summary and insights')
    .option('-r, --range <range>', 'Time range (1d, 7d, 30d, 90d)', '7d')
    .option('--project <project>', 'Filter by project ID')
    .option('--user <email>', 'Filter by user email')
    .option('--model <model>', 'Filter by model name')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export summary data to file')
    .option('-v, --verbose', 'Show detailed summary')
    .action(async (options) => {
      try {
        await handleHighCostPromptsSummary(options);
      } catch (error) {
        logger.error('High cost prompts summary failed:', error);
        process.exit(1);
      }
    });
}

async function handleHighCostPrompts(options: any) {
  console.log(chalk.cyan.bold('\n📈 High Cost Prompts Analysis'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  
  console.log(chalk.yellow('Available commands:'));
  console.log(chalk.white('  costkatana high-cost-prompts range              List by time range'));
  console.log(chalk.white('  costkatana high-cost-prompts project <id>       List by project'));
  console.log(chalk.white('  costkatana high-cost-prompts user <email>       List by user'));
  console.log(chalk.white('  costkatana high-cost-prompts model <name>       List by model'));
  console.log(chalk.white('  costkatana high-cost-prompts summary            Show summary and insights'));
  
  console.log(chalk.gray('\nExamples:'));
  console.log(chalk.white('  costkatana high-cost-prompts range --range 7d'));
  console.log(chalk.white('  costkatana high-cost-prompts project my-project --sort-by cost'));
  console.log(chalk.white('  costkatana high-cost-prompts user john@example.com --limit 10'));
  console.log(chalk.white('  costkatana high-cost-prompts model gpt-4 --include-optimizations'));
  console.log(chalk.white('  costkatana high-cost-prompts summary --range 30d'));
  
  console.log(chalk.gray('\nSort Options:'));
  console.log(chalk.white('  • cost - Sort by total cost (highest first)'));
  console.log(chalk.white('  • tokens - Sort by total tokens (highest first)'));
  console.log(chalk.white('  • frequency - Sort by usage frequency (highest first)'));
  console.log(chalk.white('  • avg-cost - Sort by average cost per request'));
  
  console.log(chalk.gray('\nOutput Information:'));
  console.log(chalk.white('  • Prompt ID and content preview'));
  console.log(chalk.white('  • Token consumption (total and average)'));
  console.log(chalk.white('  • Cost breakdown (total and per request)'));
  console.log(chalk.white('  • Model and provider information'));
  console.log(chalk.white('  • Usage frequency and patterns'));
  console.log(chalk.white('  • Optimization suggestions'));
  console.log(chalk.white('  • Cost trends and analysis'));
  
  console.log(chalk.gray('\nFilter Options:'));
  console.log(chalk.white('  • --project - Filter by specific project'));
  console.log(chalk.white('  • --user - Filter by specific user'));
  console.log(chalk.white('  • --model - Filter by specific model'));
  console.log(chalk.white('  • --range - Time range for analysis'));
  console.log(chalk.white('  • --limit - Number of results to show'));
  
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleHighCostPromptsByRange(options: any) {
  logger.info(`📈 Analyzing high cost prompts for range: ${options.range || '7d'}`);

  try {
    const range = options.range || '7d';
    const prompts = await getHighCostPromptsByRange(range, options);
    displayHighCostPrompts(prompts, options);
  } catch (error) {
    logger.error('Failed to get high cost prompts by range:', error);
    process.exit(1);
  }
}

async function getHighCostPromptsByRange(range: string, options: any) {
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
    params.append('range', range);
    if (options.project) params.append('project', options.project);
    if (options.user) params.append('user', options.user);
    if (options.model) params.append('model', options.model);
    params.append('sortBy', options.sortBy || 'cost');
    params.append('limit', options.limit || '20');
    if (options.includeOptimizations) params.append('includeOptimizations', 'true');
    if (options.includeBreakdown) params.append('includeBreakdown', 'true');
    if (options.includeTrends) params.append('includeTrends', 'true');

    const response = await axios.get(`${baseUrl}/api/high-cost-prompts/range?${params}`, {
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

function displayHighCostPrompts(prompts: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(prompts, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Prompt ID,Tokens,Cost,Model,Frequency,Optimization Suggestion');
    prompts.prompts.forEach((prompt: any) => {
      console.log(`"${prompt.promptId}","${prompt.totalTokens}","${prompt.totalCost}","${prompt.model}","${prompt.frequency}","${prompt.optimizationSuggestion}"`);
    });
    return;
  }

  console.log(chalk.cyan.bold('\n📈 High Cost Prompts Analysis'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Summary Statistics
  if (prompts.summary) {
    console.log(chalk.yellow.bold('\n📊 Summary Statistics'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('Total Prompts Analyzed:'), chalk.cyan(prompts.summary.totalPrompts.toLocaleString()));
    console.log(chalk.white('Total Cost:'), chalk.red(`$${prompts.summary.totalCost.toFixed(2)}`));
    console.log(chalk.white('Total Tokens:'), chalk.cyan(prompts.summary.totalTokens.toLocaleString()));
    console.log(chalk.white('Average Cost per Prompt:'), chalk.yellow(`$${prompts.summary.avgCostPerPrompt.toFixed(4)}`));
    console.log(chalk.white('Most Expensive Model:'), chalk.cyan(prompts.summary.mostExpensiveModel));
    console.log(chalk.white('Potential Savings:'), chalk.green(`$${prompts.summary.potentialSavings.toFixed(2)}`));
  }

  // High Cost Prompts List
  console.log(chalk.yellow.bold('\n💰 High Cost Prompts'));
  console.log(chalk.gray('─'.repeat(50)));

  if (prompts.prompts && prompts.prompts.length > 0) {
    prompts.prompts.forEach((prompt: any, index: number) => {
      const costColor = prompt.totalCost > 1.0 ? chalk.red : 
                       prompt.totalCost > 0.5 ? chalk.yellow : chalk.green;
      
      console.log(chalk.white(`\n${index + 1}. ${prompt.promptId}`));
      console.log(chalk.gray('   ─'.repeat(40)));
      
      // Basic Info
      console.log(chalk.white('   Prompt Preview:'), chalk.gray(prompt.promptPreview));
      console.log(chalk.white('   Model:'), chalk.cyan(prompt.model));
      console.log(chalk.white('   Provider:'), chalk.cyan(prompt.provider));
      
      // Cost Information
      console.log(chalk.white('   Total Cost:'), costColor(`$${prompt.totalCost.toFixed(4)}`));
      console.log(chalk.white('   Total Tokens:'), chalk.cyan(prompt.totalTokens.toLocaleString()));
      console.log(chalk.white('   Avg Cost/Request:'), chalk.yellow(`$${prompt.avgCostPerRequest.toFixed(4)}`));
      console.log(chalk.white('   Avg Tokens/Request:'), chalk.cyan(prompt.avgTokensPerRequest.toLocaleString()));
      
      // Usage Information
      console.log(chalk.white('   Frequency:'), chalk.cyan(prompt.frequency));
      console.log(chalk.white('   First Used:'), chalk.gray(new Date(prompt.firstUsed).toLocaleDateString()));
      console.log(chalk.white('   Last Used:'), chalk.gray(new Date(prompt.lastUsed).toLocaleDateString()));
      
      // Optimization Suggestion
      if (prompt.optimizationSuggestion) {
        console.log(chalk.white('   💡 Optimization:'), chalk.green(prompt.optimizationSuggestion));
      }
      
      // Cost Breakdown (if verbose)
      if (options.includeBreakdown && prompt.costBreakdown) {
        console.log(chalk.white('   Cost Breakdown:'));
        console.log(chalk.gray(`     Input tokens: ${prompt.costBreakdown.inputTokens} ($${prompt.costBreakdown.inputCost.toFixed(4)})`));
        console.log(chalk.gray(`     Output tokens: ${prompt.costBreakdown.outputTokens} ($${prompt.costBreakdown.outputCost.toFixed(4)})`));
        console.log(chalk.gray(`     Total tokens: ${prompt.costBreakdown.totalTokens} ($${prompt.costBreakdown.totalCost.toFixed(4)})`));
      }
      
      // Cost Trend (if verbose)
      if (options.includeTrends && prompt.costTrend) {
        console.log(chalk.white('   Cost Trend:'), chalk.cyan(prompt.costTrend));
      }
    });
  } else {
    console.log(chalk.yellow('\nNo high cost prompts found for the specified criteria.'));
  }

  // Optimization Recommendations
  if (prompts.optimizations && prompts.optimizations.length > 0) {
    console.log(chalk.yellow.bold('\n💡 Optimization Recommendations'));
    console.log(chalk.gray('─'.repeat(50)));
    prompts.optimizations.forEach((opt: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${opt.type}:`));
      console.log(chalk.gray(`   ${opt.description}`));
      console.log(chalk.gray(`   Potential Savings: $${opt.potentialSavings.toFixed(2)}`));
      console.log(chalk.gray(`   Implementation: ${opt.implementation}`));
    });
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleHighCostPromptsByProject(projectId: string, options: any) {
  logger.info(`📈 Analyzing high cost prompts for project: ${projectId}`);

  try {
    const range = options.range || '7d';
    const prompts = await getHighCostPromptsByProject(projectId, range, options);
    displayHighCostPrompts(prompts, options);
  } catch (error) {
    logger.error('Failed to get high cost prompts by project:', error);
    process.exit(1);
  }
}

async function getHighCostPromptsByProject(projectId: string, range: string, options: any) {
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
    params.append('projectId', projectId);
    params.append('range', range);
    if (options.user) params.append('user', options.user);
    if (options.model) params.append('model', options.model);
    params.append('sortBy', options.sortBy || 'cost');
    params.append('limit', options.limit || '20');
    if (options.includeOptimizations) params.append('includeOptimizations', 'true');
    if (options.includeBreakdown) params.append('includeBreakdown', 'true');
    if (options.includeTrends) params.append('includeTrends', 'true');

    const response = await axios.get(`${baseUrl}/api/high-cost-prompts/project?${params}`, {
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

async function handleHighCostPromptsByUser(email: string, options: any) {
  logger.info(`📈 Analyzing high cost prompts for user: ${email}`);

  try {
    const range = options.range || '7d';
    const prompts = await getHighCostPromptsByUser(email, range, options);
    displayHighCostPrompts(prompts, options);
  } catch (error) {
    logger.error('Failed to get high cost prompts by user:', error);
    process.exit(1);
  }
}

async function getHighCostPromptsByUser(email: string, range: string, options: any) {
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
    params.append('email', email);
    params.append('range', range);
    if (options.project) params.append('project', options.project);
    if (options.model) params.append('model', options.model);
    params.append('sortBy', options.sortBy || 'cost');
    params.append('limit', options.limit || '20');
    if (options.includeOptimizations) params.append('includeOptimizations', 'true');
    if (options.includeBreakdown) params.append('includeBreakdown', 'true');
    if (options.includeTrends) params.append('includeTrends', 'true');

    const response = await axios.get(`${baseUrl}/api/high-cost-prompts/user?${params}`, {
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

async function handleHighCostPromptsByModel(modelName: string, options: any) {
  logger.info(`📈 Analyzing high cost prompts for model: ${modelName}`);

  try {
    const range = options.range || '7d';
    const prompts = await getHighCostPromptsByModel(modelName, range, options);
    displayHighCostPrompts(prompts, options);
  } catch (error) {
    logger.error('Failed to get high cost prompts by model:', error);
    process.exit(1);
  }
}

async function getHighCostPromptsByModel(modelName: string, range: string, options: any) {
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
    params.append('modelName', modelName);
    params.append('range', range);
    if (options.project) params.append('project', options.project);
    if (options.user) params.append('user', options.user);
    params.append('sortBy', options.sortBy || 'cost');
    params.append('limit', options.limit || '20');
    if (options.includeOptimizations) params.append('includeOptimizations', 'true');
    if (options.includeBreakdown) params.append('includeBreakdown', 'true');
    if (options.includeTrends) params.append('includeTrends', 'true');

    const response = await axios.get(`${baseUrl}/api/high-cost-prompts/model?${params}`, {
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

async function handleHighCostPromptsSummary(options: any) {
  logger.info('📊 Generating high cost prompts summary...');

  try {
    const range = options.range || '7d';
    const summary = await getHighCostPromptsSummary(range, options);
    displayHighCostPromptsSummary(summary, options);
  } catch (error) {
    logger.error('Failed to generate high cost prompts summary:', error);
    process.exit(1);
  }
}

async function getHighCostPromptsSummary(range: string, options: any) {
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
    params.append('range', range);
    if (options.project) params.append('project', options.project);
    if (options.user) params.append('user', options.user);
    if (options.model) params.append('model', options.model);

    const response = await axios.get(`${baseUrl}/api/high-cost-prompts/summary?${params}`, {
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

function displayHighCostPromptsSummary(summary: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(summary, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Metric,Value,Change,Insight');
    Object.entries(summary.metrics).forEach(([metric, data]: [string, any]) => {
      console.log(`"${metric}","${data.value}","${data.change || ''}","${data.insight || ''}"`);
    });
    return;
  }

  console.log(chalk.cyan.bold('\n📊 High Cost Prompts Summary'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Overall Statistics
  console.log(chalk.yellow.bold('\n📈 Overall Statistics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Total High Cost Prompts:'), chalk.cyan(summary.totalHighCostPrompts.toLocaleString()));
  console.log(chalk.white('Total Cost:'), chalk.red(`$${summary.totalCost.toFixed(2)}`));
  console.log(chalk.white('Total Tokens:'), chalk.cyan(summary.totalTokens.toLocaleString()));
  console.log(chalk.white('Average Cost per Prompt:'), chalk.yellow(`$${summary.avgCostPerPrompt.toFixed(4)}`));
  console.log(chalk.white('Potential Savings:'), chalk.green(`$${summary.potentialSavings.toFixed(2)}`));

  // Cost Distribution by Model
  if (summary.costByModel) {
    console.log(chalk.yellow.bold('\n💰 Cost Distribution by Model'));
    console.log(chalk.gray('─'.repeat(50)));
    Object.entries(summary.costByModel).forEach(([model, data]: [string, any]) => {
      console.log(chalk.white(`\n${model}:`));
      console.log(chalk.gray(`  Total Cost: $${data.totalCost.toFixed(2)}`));
      console.log(chalk.gray(`  Percentage: ${(data.percentage * 100).toFixed(1)}%`));
      console.log(chalk.gray(`  Prompt Count: ${data.promptCount.toLocaleString()}`));
      console.log(chalk.gray(`  Avg Cost/Prompt: $${data.avgCostPerPrompt.toFixed(4)}`));
    });
  }

  // Top Expensive Prompts
  if (summary.topExpensivePrompts) {
    console.log(chalk.yellow.bold('\n🏆 Top 5 Most Expensive Prompts'));
    console.log(chalk.gray('─'.repeat(50)));
    summary.topExpensivePrompts.forEach((prompt: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${prompt.promptId}`));
      console.log(chalk.gray(`   Cost: $${prompt.cost.toFixed(4)}`));
      console.log(chalk.gray(`   Tokens: ${prompt.tokens.toLocaleString()}`));
      console.log(chalk.gray(`   Model: ${prompt.model}`));
      console.log(chalk.gray(`   Frequency: ${prompt.frequency}`));
    });
  }

  // Cost Trends
  if (summary.costTrends) {
    console.log(chalk.yellow.bold('\n📈 Cost Trends'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('Week-over-Week Change:'), chalk.cyan(`${summary.costTrends.weekOverWeek}%`));
    console.log(chalk.white('Month-over-Month Change:'), chalk.cyan(`${summary.costTrends.monthOverMonth}%`));
    console.log(chalk.white('Trend Direction:'), chalk.cyan(summary.costTrends.direction));
    console.log(chalk.white('Peak Usage Day:'), chalk.cyan(summary.costTrends.peakDay));
    console.log(chalk.white('Peak Usage Time:'), chalk.cyan(summary.costTrends.peakTime));
  }

  // Optimization Opportunities
  if (summary.optimizationOpportunities) {
    console.log(chalk.yellow.bold('\n💡 Optimization Opportunities'));
    console.log(chalk.gray('─'.repeat(50)));
    summary.optimizationOpportunities.forEach((opp: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${opp.type}:`));
      console.log(chalk.gray(`   ${opp.description}`));
      console.log(chalk.gray(`   Potential Savings: $${opp.potentialSavings.toFixed(2)}`));
      console.log(chalk.gray(`   Impact: ${opp.impact}`));
      console.log(chalk.gray(`   Implementation: ${opp.implementation}`));
    });
  }

  // Alerts and Insights
  if (summary.alerts) {
    console.log(chalk.yellow.bold('\n🚨 Alerts and Insights'));
    console.log(chalk.gray('─'.repeat(50)));
    summary.alerts.forEach((alert: any, index: number) => {
      const alertColor = alert.severity === 'high' ? chalk.red : 
                        alert.severity === 'medium' ? chalk.yellow : chalk.green;
      console.log(alertColor(`\n${index + 1}. ${alert.title}`));
      console.log(chalk.gray(`   ${alert.description}`));
      console.log(chalk.gray(`   Severity: ${alert.severity}`));
      if (alert.recommendation) {
        console.log(chalk.gray(`   Recommendation: ${alert.recommendation}`));
      }
    });
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}
