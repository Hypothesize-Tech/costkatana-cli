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
    .description('✂️ Optimize prompts for cost reduction and performance')
    .argument('[prompt]', 'Prompt to optimize')
    .option('-f, --file <path>', 'File containing prompt to optimize')
    .option('-m, --model <model>', 'Target model for optimization')
    .option('-t, --target-cost <cost>', 'Target cost reduction percentage')
    .option('-o, --output <path>', 'Output file for optimized prompt')
    .option('-v, --verbose', 'Show detailed optimization steps')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--cortex', 'Enable Cortex meta-language processing')
    .option(
      '--cortex-operation <op>',
      'Cortex operation: optimize, compress, analyze, transform, sast',
      'optimize'
    )
    .option(
      '--cortex-style <style>',
      'Output style: formal, casual, technical, conversational',
      'conversational'
    )
    .option(
      '--cortex-format <format>',
      'Output format: plain, markdown, structured, json',
      'plain'
    )
    .option('--semantic-cache', 'Enable semantic caching')
    .action(async (prompt, options) => {
      try {
        await handleOptimize(prompt, options);
      } catch (error) {
        logger.error('Optimization failed:', error);
        process.exit(1);
      }
    });
}

async function handleOptimize(promptArg: string | undefined, options: any) {
  logger.info('🔧 Starting prompt optimization...');

  try {
    const prompt = await getPrompt(promptArg, options);
    if (!prompt) {
      logger.error(
        'No prompt provided. Use a prompt argument or --file option.'
      );
      return;
    }

    const optimization = await optimizePrompt(prompt, options);
    displayOptimizationResults(optimization, options);
  } catch (error) {
    logger.error('Failed to optimize prompt:', error);
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

  const spinner = ora('Optimizing prompt...').start();

  try {
    // Determine Cortex/SAST mode
    const enableCortex = options.cortex || options.sast;
    const cortexOperation = options.sast
      ? 'sast'
      : options.cortexOperation || 'optimize';

    const requestData: any = {
      prompt,
      service: 'openai',
      model: options.model || 'gpt-4o-mini',
      options: {
        targetReduction: options.targetCost
          ? parseFloat(options.targetCost)
          : 20,
        preserveIntent: true,
        suggestAlternatives: options.verbose || false,
      },
      // Cortex/SAST parameters
      enableCortex,
      cortexOperation,
      cortexStyle: options.cortexStyle || 'conversational',
      cortexFormat: options.cortexFormat || 'plain',
      cortexSemanticCache: options.semanticCache || enableCortex,
      cortexPreserveSemantics: true,
      cortexIntelligentRouting: enableCortex,
      // SAST-specific parameters
      cortexSastProcessing: options.sast || false,
      cortexAmbiguityResolution: options.ambiguityResolution || options.sast,
      cortexCrossLingualMode: options.crossLingual || false,
    };

    // Only include context if it's provided
    if (options.context) {
      requestData.context = options.context;
    }

    const response = await axios.post(
      `${baseUrl}/api/optimizations`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 seconds for optimization
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`API returned status ${response.status}`);
    }

    spinner.succeed('Optimization completed');

    // Handle the backend's response format
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Invalid response format');
    }
  } catch (error: any) {
    spinner.fail('Optimization failed');
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

function displayOptimizationResults(optimization: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    displayOptimizationJson(optimization);
    return;
  } else if (format === 'csv') {
    displayOptimizationCsv(optimization);
    return;
  }

  console.log(chalk.cyan.bold('\n✂️ Optimization Results'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // 1. Optimized Version
  if (optimization.optimizedPrompt) {
    console.log(chalk.yellow.bold('\n🚀 Optimized Version'));
    console.log(chalk.gray('─'.repeat(30)));
    console.log(chalk.white(optimization.optimizedPrompt));
  }

  // 2. Token Delta
  if (
    optimization.tokenDelta !== undefined ||
    optimization.tokensSaved !== undefined
  ) {
    console.log(chalk.yellow.bold('\n🔢 Token Delta'));
    console.log(chalk.gray('─'.repeat(30)));

    const originalTokens = optimization.originalTokens || 0;
    const optimizedTokens = optimization.optimizedTokens || 0;
    const tokenDelta =
      optimization.tokenDelta || originalTokens - optimizedTokens;
    const tokenSavings = optimization.tokensSaved || Math.abs(tokenDelta);

    console.log(
      chalk.white('Original Tokens:'),
      chalk.cyan(originalTokens.toLocaleString())
    );
    console.log(
      chalk.white('Optimized Tokens:'),
      chalk.cyan(optimizedTokens.toLocaleString())
    );
    console.log(
      chalk.white('Token Delta:'),
      chalk.green(`${tokenDelta > 0 ? '+' : ''}${tokenDelta.toLocaleString()}`)
    );
    console.log(
      chalk.white('Tokens Saved:'),
      chalk.green(`${tokenSavings.toLocaleString()}`)
    );
  }

  // 3. Estimated Cost Savings
  if (
    optimization.costSaved !== undefined ||
    optimization.improvementPercentage !== undefined
  ) {
    console.log(chalk.yellow.bold('\n💰 Estimated Cost Savings'));
    console.log(chalk.gray('─'.repeat(30)));

    const originalCost = optimization.originalCost || 0;
    const optimizedCost = optimization.optimizedCost || 0;
    const costSaved = optimization.costSaved || originalCost - optimizedCost;
    const improvementPercentage =
      optimization.improvementPercentage ||
      (originalCost > 0 ? (costSaved / originalCost) * 100 : 0);

    console.log(
      chalk.white('Original Cost:'),
      chalk.red(`$${originalCost.toFixed(6)}`)
    );
    console.log(
      chalk.white('Optimized Cost:'),
      chalk.green(`$${optimizedCost.toFixed(6)}`)
    );
    console.log(
      chalk.white('Cost Saved:'),
      chalk.green(`$${costSaved.toFixed(6)}`)
    );
    console.log(
      chalk.white('Savings:'),
      chalk.green(`${improvementPercentage.toFixed(1)}%`)
    );
  }

  // Optimization Techniques
  if (optimization.suggestions && optimization.suggestions.length > 0) {
    console.log(chalk.yellow.bold('\n🔧 Applied Techniques'));
    console.log(chalk.gray('─'.repeat(20)));

    optimization.suggestions.forEach((suggestion: any) => {
      const type = chalk.white(suggestion.type || 'Unknown');
      const impact = chalk.green(suggestion.impact || 'N/A');
      const description = chalk.gray(suggestion.description || '');

      console.log(`${type}: ${impact} impact`);
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
    console.log(
      chalk.yellow('Semantic Similarity:'),
      `${quality.semanticSimilarity?.toFixed(1) || 0}%`
    );
    console.log(
      chalk.yellow('Information Retention:'),
      `${quality.informationRetention?.toFixed(1) || 0}%`
    );
    console.log(
      chalk.yellow('Clarity Score:'),
      `${quality.clarityScore?.toFixed(1) || 0}%`
    );

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
      console.log(
        chalk.blue(
          `Version ${index + 1} (${alt.costReduction?.toFixed(1) || 0}% cost reduction):`
        )
      );
      console.log(chalk.white(alt.prompt));
      console.log(
        chalk.gray(
          `Tokens: ${alt.tokens?.toLocaleString() || 'N/A'}, Cost: $${alt.cost?.toFixed(4) || 'N/A'}`
        )
      );
      console.log('');
    });
  }

  // Export if requested
  if (options.output) {
    exportOptimizationResults(optimization, options.output);
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

function displayOptimizationJson(optimization: any) {
  const output = {
    optimizedVersion: optimization.optimizedPrompt,
    tokenDelta: {
      originalTokens: optimization.originalTokens || 0,
      optimizedTokens: optimization.optimizedTokens || 0,
      tokenDelta:
        optimization.tokenDelta ||
        optimization.originalTokens - optimization.optimizedTokens,
      tokensSaved:
        optimization.tokensSaved || Math.abs(optimization.tokenDelta || 0),
    },
    estimatedCostSavings: {
      originalCost: optimization.originalCost || 0,
      optimizedCost: optimization.optimizedCost || 0,
      costSaved:
        optimization.costSaved ||
        optimization.originalCost - optimization.optimizedCost,
      savingsPercentage: optimization.improvementPercentage || 0,
    },
  };

  console.log(JSON.stringify(output, null, 2));
}

function displayOptimizationCsv(optimization: any) {
  console.log(
    'Optimized Version,Original Tokens,Optimized Tokens,Token Delta,Tokens Saved,Original Cost,Optimized Cost,Cost Saved,Savings %'
  );

  const originalTokens = optimization.originalTokens || 0;
  const optimizedTokens = optimization.optimizedTokens || 0;
  const tokenDelta =
    optimization.tokenDelta || originalTokens - optimizedTokens;
  const tokensSaved = optimization.tokensSaved || Math.abs(tokenDelta);

  const originalCost = optimization.originalCost || 0;
  const optimizedCost = optimization.optimizedCost || 0;
  const costSaved = optimization.costSaved || originalCost - optimizedCost;
  const savingsPercentage =
    optimization.improvementPercentage ||
    (originalCost > 0 ? (costSaved / originalCost) * 100 : 0);

  const optimizedVersion = optimization.optimizedPrompt || '';

  console.log(
    `"${optimizedVersion.replace(/"/g, '""')}",${originalTokens},${optimizedTokens},${tokenDelta},${tokensSaved},${originalCost},${optimizedCost},${costSaved},${savingsPercentage.toFixed(1)}`
  );
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
