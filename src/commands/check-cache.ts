import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function checkCacheCommand(program: Command) {
  program
    .command('check-cache')
    .description('🔁 Check cache status and fallback routes for prompts')
    .argument('[prompt]', 'Prompt to check cache for')
    .option('-f, --file <path>', 'File containing prompt to check')
    .option('-m, --model <model>', 'Target model for cache check')
    .option('-p, --provider <provider>', 'AI provider to check')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('-v, --verbose', 'Show detailed cache information')
    .option('--export <path>', 'Export cache check results to file')
    .action(async (prompt, options) => {
      try {
        await handleCheckCache(prompt, options);
      } catch (error) {
        logger.error('Cache check failed:', error);
        process.exit(1);
      }
    });
}

async function handleCheckCache(promptArg: string | undefined, options: any) {
  logger.info('🔁 Checking cache status...');

  try {
    const prompt = await getPrompt(promptArg, options);
    if (!prompt) {
      logger.error(
        'No prompt provided. Use a prompt argument or --file option.'
      );
      return;
    }

    const cacheResult = await checkCache(prompt, options);
    displayCacheResults(cacheResult, options);
  } catch (error) {
    logger.error('Failed to check cache:', error);
    process.exit(1);
  }
}

async function getPrompt(
  promptArg: string | undefined,
  options: any
): Promise<string | null> {
  if (promptArg) {
    return promptArg;
  }

  if (options.file) {
    try {
      const fullPath = require('path').resolve(options.file);
      const fs = require('fs');
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
      message: 'Enter the prompt to check cache for:',
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

async function checkCache(prompt: string, options: any) {
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

  const spinner = ora('Checking cache status...').start();

  try {
    const requestData: any = {
      prompt,
      model: options.model || 'gpt-4o-mini',
      provider: options.provider || 'openai',
      includeFallbacks: true,
      includeCacheDetails: options.verbose || false,
    };

    const response = await axios.post(
      `${baseUrl}/api/cache/check`,
      requestData,
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

    spinner.succeed('Cache check completed');

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Invalid response format');
    }
  } catch (error: any) {
    spinner.fail('Cache check failed');
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

function displayCacheResults(cacheResult: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    displayCacheJson(cacheResult);
    return;
  } else if (format === 'csv') {
    displayCacheCsv(cacheResult);
    return;
  }

  console.log(chalk.cyan.bold('\n🔁 Cache Check Results'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // 1. Cache Status
  if (cacheResult.cacheStatus) {
    console.log(chalk.yellow.bold('\n📋 Cache Status'));
    console.log(chalk.gray('─'.repeat(30)));

    const status = cacheResult.cacheStatus;
    const isHit = status === 'HIT';
    const statusColor = isHit ? chalk.green : chalk.red;
    const statusIcon = isHit ? '✅' : '❌';

    console.log(`${statusIcon} Status: ${statusColor(status)}`);

    if (cacheResult.cacheDetails) {
      console.log(
        chalk.white('Cache Key:'),
        chalk.cyan(cacheResult.cacheDetails.key || 'N/A')
      );
      console.log(
        chalk.white('Cache Age:'),
        chalk.cyan(cacheResult.cacheDetails.age || 'N/A')
      );
      console.log(
        chalk.white('Cache Size:'),
        chalk.cyan(cacheResult.cacheDetails.size || 'N/A')
      );
    }
  }

  // 2. Suggested Reuse or Retry
  if (cacheResult.suggestions) {
    console.log(chalk.yellow.bold('\n💡 Suggestions'));
    console.log(chalk.gray('─'.repeat(30)));

    cacheResult.suggestions.forEach((suggestion: any, index: number) => {
      const type = suggestion.type || 'general';
      const action = suggestion.action || 'N/A';
      const reason = suggestion.reason || '';
      const confidence = suggestion.confidence || 0;

      console.log(
        chalk.white(`${index + 1}. ${type.toUpperCase()}:`),
        chalk.cyan(action)
      );
      if (reason) {
        console.log(chalk.gray(`   Reason: ${reason}`));
      }
      if (confidence > 0) {
        console.log(chalk.gray(`   Confidence: ${confidence}%`));
      }
      console.log('');
    });
  }

  // 3. Fallback Routes
  if (cacheResult.fallbackRoutes) {
    console.log(chalk.yellow.bold('\n🔄 Fallback Routes'));
    console.log(chalk.gray('─'.repeat(30)));

    cacheResult.fallbackRoutes.forEach((route: any, index: number) => {
      const provider = route.provider || 'Unknown';
      const model = route.model || 'Unknown';
      const priority = route.priority || 1;
      const status = route.status || 'available';
      const cost = route.estimatedCost || 'N/A';

      const statusColor = status === 'available' ? chalk.green : chalk.red;
      const statusIcon = status === 'available' ? '✅' : '❌';

      console.log(chalk.white(`${index + 1}. ${provider}/${model}`));
      console.log(chalk.gray(`   Priority: ${priority}`));
      console.log(
        chalk.gray(`   Status: ${statusIcon} ${statusColor(status)}`)
      );
      console.log(chalk.gray(`   Estimated Cost: $${cost}`));

      if (route.reason) {
        console.log(chalk.gray(`   Reason: ${route.reason}`));
      }
      console.log('');
    });
  }

  // 4. Cache Performance Metrics
  if (cacheResult.performance) {
    console.log(chalk.yellow.bold('\n📊 Performance Metrics'));
    console.log(chalk.gray('─'.repeat(30)));

    const perf = cacheResult.performance;
    console.log(
      chalk.white('Response Time:'),
      chalk.cyan(`${perf.responseTime || 0}ms`)
    );
    console.log(
      chalk.white('Cache Hit Rate:'),
      chalk.cyan(`${perf.hitRate || 0}%`)
    );
    console.log(
      chalk.white('Cost Savings:'),
      chalk.green(`$${perf.costSavings || 0}`)
    );
    console.log(
      chalk.white('Bandwidth Saved:'),
      chalk.cyan(`${perf.bandwidthSaved || 0}KB`)
    );
  }

  // Export if requested
  if (options.export) {
    exportCacheResults(cacheResult, options.export);
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

function displayCacheJson(cacheResult: any) {
  const output = {
    cacheStatus: cacheResult.cacheStatus,
    cacheDetails: cacheResult.cacheDetails,
    suggestions: cacheResult.suggestions,
    fallbackRoutes: cacheResult.fallbackRoutes,
    performance: cacheResult.performance,
  };

  console.log(JSON.stringify(output, null, 2));
}

function displayCacheCsv(cacheResult: any) {
  console.log(
    'Cache Status,Cache Key,Cache Age,Response Time,Hit Rate,Cost Savings,Primary Provider,Fallback Provider,Status'
  );

  const status = cacheResult.cacheStatus || 'UNKNOWN';
  const key = cacheResult.cacheDetails?.key || 'N/A';
  const age = cacheResult.cacheDetails?.age || 'N/A';
  const responseTime = cacheResult.performance?.responseTime || 0;
  const hitRate = cacheResult.performance?.hitRate || 0;
  const costSavings = cacheResult.performance?.costSavings || 0;
  const primaryProvider = cacheResult.fallbackRoutes?.[0]?.provider || 'N/A';
  const fallbackProvider = cacheResult.fallbackRoutes?.[1]?.provider || 'N/A';
  const routeStatus = cacheResult.fallbackRoutes?.[0]?.status || 'N/A';

  console.log(
    `"${status}","${key}","${age}",${responseTime},${hitRate},${costSavings},"${primaryProvider}","${fallbackProvider}","${routeStatus}"`
  );
}

function exportCacheResults(cacheResult: any, filePath: string) {
  try {
    const fullPath = require('path').resolve(filePath);
    const fs = require('fs');
    const content = JSON.stringify(cacheResult, null, 2);

    // Ensure directory exists
    const dir = require('path').dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content);
    logger.success(`Cache check results exported to: ${fullPath}`);
  } catch (error) {
    logger.error('Failed to export cache check results:', error);
  }
}
