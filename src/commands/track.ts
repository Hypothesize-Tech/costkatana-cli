import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function trackCommand(program: Command) {
  program
    .command('track')
    .description('📦 Track requests manually for cost monitoring')
    .option('-m, --model <model>', 'AI model used (e.g., gpt-4, claude-3)')
    .option('-t, --tokens <number>', 'Number of tokens used')
    .option('-p, --project <project>', 'Project name')
    .option('-u, --user <user>', 'User who made the request')
    .option('-f, --feedback <feedback>', 'User feedback (positive, negative, neutral)')
    .option('-c, --cost <cost>', 'Actual cost in USD')
    .option('-d, --description <description>', 'Request description')
    .option('--provider <provider>', 'AI provider (openai, anthropic, etc.)')
    .option('--prompt <prompt>', 'The actual prompt used')
    .option('--response <response>', 'The response received')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export tracking data to file')
    .option('-v, --verbose', 'Show detailed tracking information')
    .action(async (options) => {
      try {
        await handleTrack(options);
      } catch (error) {
        logger.error('Track command failed:', error);
        process.exit(1);
      }
    });
}

async function handleTrack(options: any) {
  logger.info('📦 Tracking request manually...');

  try {
    // Collect missing information interactively if not provided
    const trackingData = await collectTrackingData(options);
    
    // Send tracking data to backend
    const result = await trackRequest(trackingData);
    
    // Display results
    displayTrackingResult(result, options);
  } catch (error) {
    logger.error('Failed to track request:', error);
    process.exit(1);
  }
}

async function collectTrackingData(options: any) {
  const data: any = {};

  // Model (required)
  if (options.model) {
    data.model = options.model;
  } else {
    const { model } = await inquirer.prompt([
      {
        type: 'input',
        name: 'model',
        message: 'Enter the AI model used:',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Model is required';
          }
          return true;
        },
      },
    ]);
    data.model = model;
  }

  // Tokens (required)
  if (options.tokens) {
    data.tokens = parseInt(options.tokens);
  } else {
    const { tokens } = await inquirer.prompt([
      {
        type: 'number',
        name: 'tokens',
        message: 'Enter the number of tokens used:',
        validate: (input: number) => {
          if (!input || input <= 0) {
            return 'Tokens must be a positive number';
          }
          return true;
        },
      },
    ]);
    data.tokens = tokens;
  }

  // Project (optional but recommended)
  if (options.project) {
    data.project = options.project;
  } else {
    const { useProject } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useProject',
        message: 'Do you want to associate this with a project?',
        default: true,
      },
    ]);
    
    if (useProject) {
      const { project } = await inquirer.prompt([
        {
          type: 'input',
          name: 'project',
          message: 'Enter the project name:',
        },
      ]);
      data.project = project;
    }
  }

  // User (optional)
  if (options.user) {
    data.user = options.user;
  } else {
    const { user } = await inquirer.prompt([
      {
        type: 'input',
        name: 'user',
        message: 'Enter the user (optional):',
      },
    ]);
    if (user) data.user = user;
  }

  // Feedback (optional)
  if (options.feedback) {
    data.feedback = options.feedback;
  } else {
    const { feedback } = await inquirer.prompt([
      {
        type: 'list',
        name: 'feedback',
        message: 'Select feedback (optional):',
        choices: [
          { name: 'Skip', value: null },
          { name: 'Positive', value: 'positive' },
          { name: 'Negative', value: 'negative' },
          { name: 'Neutral', value: 'neutral' },
        ],
      },
    ]);
    if (feedback) data.feedback = feedback;
  }

  // Cost (optional)
  if (options.cost) {
    data.cost = parseFloat(options.cost);
  } else {
    const { cost } = await inquirer.prompt([
      {
        type: 'number',
        name: 'cost',
        message: 'Enter the cost in USD (optional):',
        default: null,
      },
    ]);
    if (cost) data.cost = cost;
  }

  // Description (optional)
  if (options.description) {
    data.description = options.description;
  } else {
    const { description } = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: 'Enter a description (optional):',
      },
    ]);
    if (description) data.description = description;
  }

  // Provider (optional)
  if (options.provider) {
    data.provider = options.provider;
  } else {
    const { provider } = await inquirer.prompt([
      {
        type: 'list',
        name: 'provider',
        message: 'Select AI provider (optional):',
        choices: [
          { name: 'Skip', value: null },
          { name: 'OpenAI', value: 'openai' },
          { name: 'Anthropic', value: 'anthropic' },
          { name: 'Google', value: 'google' },
          { name: 'Cohere', value: 'cohere' },
          { name: 'Other', value: 'other' },
        ],
      },
    ]);
    if (provider) data.provider = provider;
  }

  // Prompt (optional)
  if (options.prompt) {
    data.prompt = options.prompt;
  } else {
    const { includePrompt } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'includePrompt',
        message: 'Do you want to include the prompt?',
        default: false,
      },
    ]);
    
    if (includePrompt) {
      const { prompt } = await inquirer.prompt([
        {
          type: 'editor',
          name: 'prompt',
          message: 'Enter the prompt:',
        },
      ]);
      data.prompt = prompt;
    }
  }

  // Response (optional)
  if (options.response) {
    data.response = options.response;
  } else {
    const { includeResponse } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'includeResponse',
        message: 'Do you want to include the response?',
        default: false,
      },
    ]);
    
    if (includeResponse) {
      const { response } = await inquirer.prompt([
        {
          type: 'editor',
          name: 'response',
          message: 'Enter the response:',
        },
      ]);
      data.response = response;
    }
  }

  return data;
}

async function trackRequest(trackingData: any) {
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
    const response = await axios.post(`${baseUrl}/api/tracking/manual`, trackingData, {
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

function displayTrackingResult(result: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    displayTrackingJson(result);
    return;
  } else if (format === 'csv') {
    displayTrackingCsv(result);
    return;
  }

  console.log(chalk.cyan.bold('\n📦 Request Tracking Result'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Tracking Summary
  console.log(chalk.yellow.bold('\n✅ Request Tracked Successfully'));
  console.log(chalk.gray('─'.repeat(50)));
  
  console.log(chalk.white('📝 Request ID:'), chalk.cyan(result.requestId || 'N/A'));
  console.log(chalk.white('🤖 Model:'), chalk.cyan(result.model || 'N/A'));
  console.log(chalk.white('🔢 Tokens:'), chalk.cyan(result.tokens?.toLocaleString() || 'N/A'));
  console.log(chalk.white('💰 Cost:'), chalk.green(`$${result.cost?.toFixed(4) || '0.0000'}`));
  
  if (result.project) {
    console.log(chalk.white('📁 Project:'), chalk.cyan(result.project));
  }
  if (result.user) {
    console.log(chalk.white('👤 User:'), chalk.cyan(result.user));
  }
  if (result.provider) {
    console.log(chalk.white('🏢 Provider:'), chalk.cyan(result.provider));
  }
  if (result.feedback) {
    const feedbackColor = result.feedback === 'positive' ? chalk.green : 
                         result.feedback === 'negative' ? chalk.red : chalk.yellow;
    console.log(chalk.white('💬 Feedback:'), feedbackColor(result.feedback));
  }

  // Cost Analysis
  if (result.costAnalysis) {
    console.log(chalk.yellow.bold('\n📊 Cost Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    
    const analysis = result.costAnalysis;
    console.log(chalk.white('Token Cost:'), chalk.cyan(`$${analysis.tokenCost?.toFixed(4) || '0.0000'}`));
    console.log(chalk.white('API Cost:'), chalk.cyan(`$${analysis.apiCost?.toFixed(4) || '0.0000'}`));
    console.log(chalk.white('Total Cost:'), chalk.green(`$${analysis.totalCost?.toFixed(4) || '0.0000'}`));
    
    if (analysis.costPerToken) {
      console.log(chalk.white('Cost per Token:'), chalk.cyan(`$${analysis.costPerToken.toFixed(6)}`));
    }
  }

  // Usage Impact
  if (result.usageImpact) {
    console.log(chalk.yellow.bold('\n📈 Usage Impact'));
    console.log(chalk.gray('─'.repeat(50)));
    
    const impact = result.usageImpact;
    console.log(chalk.white('Monthly Usage:'), chalk.cyan(`${impact.monthlyUsage?.toLocaleString() || 0} tokens`));
    console.log(chalk.white('Monthly Cost:'), chalk.cyan(`$${impact.monthlyCost?.toFixed(2) || '0.00'}`));
    console.log(chalk.white('Budget Usage:'), chalk.cyan(`${impact.budgetUsage?.toFixed(1) || 0}%`));
    
    if (impact.budgetRemaining) {
      console.log(chalk.white('Budget Remaining:'), chalk.cyan(`${impact.budgetRemaining.toLocaleString()} tokens`));
    }
  }

  // Export if requested
  if (options.export) {
    exportTrackingData(result, options.export);
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

function displayTrackingJson(result: any) {
  console.log(JSON.stringify(result, null, 2));
}

function displayTrackingCsv(result: any) {
  console.log('Request ID,Model,Tokens,Cost,Project,User,Provider,Feedback,Timestamp');
  
  const requestId = result.requestId || 'N/A';
  const model = result.model || 'N/A';
  const tokens = result.tokens || 0;
  const cost = result.cost || 0;
  const project = result.project || 'N/A';
  const user = result.user || 'N/A';
  const provider = result.provider || 'N/A';
  const feedback = result.feedback || 'N/A';
  const timestamp = result.timestamp || new Date().toISOString();
  
  console.log(`"${requestId}","${model}",${tokens},${cost},"${project}","${user}","${provider}","${feedback}","${timestamp}"`);
}

function exportTrackingData(trackingData: any, filePath: string) {
  try {
    const fullPath = require('path').resolve(filePath);
    const fs = require('fs');
    const content = JSON.stringify(trackingData, null, 2);
    
    // Ensure directory exists
    const dir = require('path').dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content);
    logger.success(`Tracking data exported to: ${fullPath}`);
  } catch (error) {
    logger.error('Failed to export tracking data:', error);
  }
}
