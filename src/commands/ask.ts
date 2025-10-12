import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import { ai } from 'cost-katana';
import * as fs from 'fs';

export function askCommand(program: Command) {
  program
    .command('ask <question>')
    .description('Ask a quick question without entering chat mode')
    .option('-m, --model <model>', 'AI model to use')
    .option('-o, --output <path>', 'Save answer to file')
    .option('--cortex', 'Enable Cortex optimization (70-95% savings)')
    .option('--cache', 'Enable caching')
    .option('-t, --temperature <temp>', 'Temperature (0-2)', '0.7')
    .option('--max-tokens <tokens>', 'Maximum response tokens', '1000')
    .action(async (question, options) => {
      try {
        await handleAsk(question, options);
      } catch (error) {
        logger.error('Ask command failed:', error);
        process.exit(1);
      }
    });
}

async function handleAsk(question: string, options: any) {
  // Get configuration
  const model = options.model || configManager.get('defaultModel') || 'gpt-4';
  const apiKey = configManager.get('apiKey');

  if (!apiKey) {
    console.log(chalk.red.bold('\n❌ API Key Not Found'));
    console.log(chalk.gray('━'.repeat(50)));
    console.log(chalk.yellow('Please run setup first:'));
    console.log(chalk.white('  cost-katana init'));
    console.log(chalk.gray('━'.repeat(50) + '\n'));
    process.exit(1);
  }

  // Show what we're doing
  const spinner = ora({
    text: chalk.cyan(`Asking ${model}...`),
    color: 'cyan'
  }).start();

  try {
    const startTime = Date.now();

    // Make the AI request
    const response = await ai(model, question, {
      temperature: parseFloat(options.temperature),
      maxTokens: parseInt(options.maxTokens),
      cache: options.cache,
      cortex: options.cortex
    });

    const responseTime = Date.now() - startTime;

    spinner.succeed(chalk.green('Answer received'));

    // Display answer
    console.log(chalk.gray('\n' + '━'.repeat(50)));
    console.log(chalk.white(response.text));
    console.log(chalk.gray('━'.repeat(50)));

    // Display stats
    console.log(chalk.gray('\n📊 Stats:'));
    console.log(chalk.yellow(`   Cost: $${response.cost.toFixed(6)}`));
    console.log(chalk.cyan(`   Tokens: ${response.tokens}`));
    console.log(chalk.gray(`   Time: ${responseTime}ms`));
    console.log(chalk.gray(`   Model: ${response.model}`));
    
    if (response.cached) {
      console.log(chalk.green('   ✓ Cached (saved money!)'));
    }
    
    if (response.optimized) {
      console.log(chalk.green('   ✓ Optimized with Cortex'));
    }

    // Save to file if requested
    if (options.output) {
      fs.writeFileSync(options.output, response.text, 'utf-8');
      console.log(chalk.green(`\n✅ Saved to ${options.output}`));
    }

    console.log(); // Empty line for spacing

  } catch (error) {
    spinner.fail(chalk.red('Failed to get answer'));
    
    if (error instanceof Error) {
      console.log(chalk.red(`\nError: ${error.message}`));
      
      // Provide helpful suggestions
      if (error.message.includes('API') || error.message.includes('key')) {
        console.log(chalk.yellow('\n💡 Tip: Check your API key with:'));
        console.log(chalk.white('   cost-katana config'));
      } else if (error.message.includes('model')) {
        console.log(chalk.yellow('\n💡 Tip: See available models with:'));
        console.log(chalk.white('   cost-katana models'));
      } else if (error.message.includes('rate limit')) {
        console.log(chalk.yellow('\n💡 Tip: Try a different model or wait a moment'));
      }
    }
    
    throw error;
  }
}
