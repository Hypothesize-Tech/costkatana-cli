import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export function optimizeCommand(program: Command) {
  program
    .command('optimize')
    .description('Optimize prompts for cost reduction and performance')
    .option('-p, --prompt <text>', 'Prompt to optimize')
    .option('-f, --file <path>', 'File containing prompt to optimize')
    .option('-m, --model <model>', 'Target model for optimization')
    .option('-t, --target-cost <cost>', 'Target cost reduction percentage')
    .option('-o, --output <path>', 'Output file for optimized prompt')
    .option('-v, --verbose', 'Show detailed optimization steps')
    .action(async (options) => {
      try {
        await handleOptimize(options);
      } catch (error) {
        logger.error('Optimization failed:', error);
        process.exit(1);
      }
    });
}

async function handleOptimize(options: any) {
  logger.info('🔧 Starting prompt optimization...');

  try {
    const prompt = await getPrompt(options);
    if (!prompt) {
      logger.error('No prompt provided. Use --prompt or --file option.');
      return;
    }

    const optimization = await optimizePrompt(prompt, options);
    displayOptimizationResults(optimization, options);
  } catch (error) {
    logger.error('Failed to optimize prompt:', error);
    process.exit(1);
  }
}

async function getPrompt(options: any): Promise<string | null> {
  if (options.prompt) {
    return options.prompt;
  }

  if (options.file) {
    try {
      const fullPath = path.resolve(options.file);
      if (!fs.existsSync(fullPath)) {
        logger.error(`File not found: ${fullPath}`);
        return null;
      }
      return fs.readFileSync(fullPath, 'utf8');
    } catch (error) {
      logger.error('Failed to read file:', error);
      return null;
    }
  }

  // Interactive prompt input
  const { prompt } = await inquirer.prompt([
    {
      type: 'editor',
      name: 'prompt',
      message: 'Enter the prompt to optimize:',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Prompt cannot be empty';
        }
        return true;
      },
    },
  ]);

  return prompt.trim();
}

async function optimizePrompt(prompt: string, options: any) {
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

  const spinner = ora('Optimizing prompt...').start();

  try {
    const requestData = {
      prompt,
      targetModel: options.model || configManager.get('defaultModel'),
      targetCostReduction: options.targetCost ? parseFloat(options.targetCost) : 20,
      includeAnalysis: options.verbose || false,
    };

    const response = await axios.post(`${baseUrl}/api/optimization/optimize`, requestData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60 seconds for optimization
    });

    if (response.status !== 200) {
      throw new Error(`API returned status ${response.status}`);
    }

    spinner.succeed('Optimization completed');
    return response.data;
  } catch (error: any) {
    spinner.fail('Optimization failed');
    if (error.response) {
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayOptimizationResults(optimization: any, options: any) {
  console.log(chalk.cyan.bold('\n⚡ Optimization Results'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Original vs Optimized
  if (optimization.original && optimization.optimized) {
    console.log(chalk.yellow.bold('\n📝 Original Prompt'));
    console.log(chalk.gray('─'.repeat(20)));
    console.log(chalk.white(optimization.original.prompt));
    console.log(chalk.gray(`Tokens: ${optimization.original.tokens?.toLocaleString() || 'N/A'}`));
    console.log(chalk.gray(`Estimated Cost: $${optimization.original.cost?.toFixed(4) || 'N/A'}`));

    console.log(chalk.yellow.bold('\n🚀 Optimized Prompt'));
    console.log(chalk.gray('─'.repeat(20)));
    console.log(chalk.white(optimization.optimized.prompt));
    console.log(chalk.gray(`Tokens: ${optimization.optimized.tokens?.toLocaleString() || 'N/A'}`));
    console.log(chalk.gray(`Estimated Cost: $${optimization.optimized.cost?.toFixed(4) || 'N/A'}`));
  }

  // Savings
  if (optimization.savings) {
    console.log(chalk.yellow.bold('\n💰 Cost Savings'));
    console.log(chalk.gray('─'.repeat(20)));
    
    const savings = optimization.savings;
    console.log(chalk.green(`Token Reduction: ${savings.tokenReduction?.toFixed(1) || 0}%`));
    console.log(chalk.green(`Cost Reduction: ${savings.costReduction?.toFixed(1) || 0}%`));
    console.log(chalk.green(`Tokens Saved: ${savings.tokensSaved?.toLocaleString() || 0}`));
    console.log(chalk.green(`Cost Saved: $${savings.costSaved?.toFixed(4) || '0.00'}`));
  }

  // Optimization Techniques
  if (optimization.techniques && optimization.techniques.length > 0) {
    console.log(chalk.yellow.bold('\n🔧 Applied Techniques'));
    console.log(chalk.gray('─'.repeat(20)));
    
    optimization.techniques.forEach((technique: any) => {
      const name = chalk.white(technique.name);
      const impact = chalk.green(`${technique.impact?.toFixed(1) || 0}% reduction`);
      const description = chalk.gray(technique.description || '');
      
      console.log(`${name}: ${impact}`);
      if (description) {
        console.log(chalk.gray(`  ${description}`));
      }
      console.log('');
    });
  }

  // Quality Assessment
  if (optimization.qualityAssessment) {
    console.log(chalk.yellow.bold('\n📊 Quality Assessment'));
    console.log(chalk.gray('─'.repeat(20)));
    
    const quality = optimization.qualityAssessment;
    console.log(chalk.yellow('Semantic Similarity:'), `${quality.semanticSimilarity?.toFixed(1) || 0}%`);
    console.log(chalk.yellow('Information Retention:'), `${quality.informationRetention?.toFixed(1) || 0}%`);
    console.log(chalk.yellow('Clarity Score:'), `${quality.clarityScore?.toFixed(1) || 0}%`);
    
    if (quality.recommendations) {
      console.log(chalk.yellow('\nRecommendations:'));
      quality.recommendations.forEach((rec: any) => {
        console.log(chalk.gray(`  • ${rec}`));
      });
    }
  }

  // Alternative Versions
  if (optimization.alternatives && optimization.alternatives.length > 0) {
    console.log(chalk.yellow.bold('\n🔄 Alternative Versions'));
    console.log(chalk.gray('─'.repeat(20)));
    
    optimization.alternatives.forEach((alt: any, index: number) => {
      console.log(chalk.blue(`Version ${index + 1} (${alt.costReduction?.toFixed(1) || 0}% cost reduction):`));
      console.log(chalk.white(alt.prompt));
      console.log(chalk.gray(`Tokens: ${alt.tokens?.toLocaleString() || 'N/A'}, Cost: $${alt.cost?.toFixed(4) || 'N/A'}`));
      console.log('');
    });
  }

  // Export if requested
  if (options.output) {
    exportOptimizationResults(optimization, options.output);
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

function exportOptimizationResults(optimization: any, filePath: string) {
  try {
    const fullPath = path.resolve(filePath);
    const content = JSON.stringify(optimization, null, 2);
    
    // Ensure directory exists
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content);
    logger.success(`Optimization results exported to: ${fullPath}`);
  } catch (error) {
    logger.error('Failed to export optimization results:', error);
  }
} 