import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';
import * as fs from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

export function bulkOptimizeCommand(program: Command) {
  const bulkGroup = program
    .command('bulk-optimize')
    .description(
      '🚀 Analyze and optimize multiple high-frequency prompts in one go'
    );

  // Main bulk-optimize command
  bulkGroup
    .option('--file <path>', 'CSV file with prompts to optimize')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export optimization results to file')
    .option('-v, --verbose', 'Show detailed optimization analysis')
    .option('--include-token-analysis', 'Include detailed token analysis')
    .option('--include-cost-breakdown', 'Include detailed cost breakdown')
    .option(
      '--include-optimization-suggestions',
      'Include optimization suggestions'
    )
    .option('--include-priority-ranking', 'Include priority ranking')
    .action(async (options) => {
      try {
        await handleBulkOptimize(options);
      } catch (error) {
        logger.error('Bulk optimize command failed:', error);
        process.exit(1);
      }
    });

  // Batch optimization with different strategies
  bulkGroup
    .command('strategies')
    .description('🚀 Optimize prompts using different strategies')
    .option('--file <path>', 'CSV file with prompts to optimize')
    .option(
      '--strategies <strategies>',
      'Comma-separated optimization strategies'
    )
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export strategy results to file')
    .option('-v, --verbose', 'Show detailed strategy analysis')
    .option('--include-token-analysis', 'Include detailed token analysis')
    .option('--include-cost-breakdown', 'Include detailed cost breakdown')
    .option('--include-comparison', 'Include strategy comparison')
    .action(async (options) => {
      try {
        await handleStrategyOptimization(options);
      } catch (error) {
        logger.error('Strategy optimization failed:', error);
        process.exit(1);
      }
    });

  // Priority-based optimization
  bulkGroup
    .command('priority')
    .description('🚀 Optimize prompts based on priority and impact')
    .option('--file <path>', 'CSV file with prompts to optimize')
    .option(
      '--priority-criteria <criteria>',
      'Priority criteria (cost, frequency, impact)',
      'cost'
    )
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export priority results to file')
    .option('-v, --verbose', 'Show detailed priority analysis')
    .option('--include-token-analysis', 'Include detailed token analysis')
    .option('--include-cost-breakdown', 'Include detailed cost breakdown')
    .option('--include-impact-analysis', 'Include impact analysis')
    .action(async (options) => {
      try {
        await handlePriorityOptimization(options);
      } catch (error) {
        logger.error('Priority optimization failed:', error);
        process.exit(1);
      }
    });

  // Model-specific optimization
  bulkGroup
    .command('models')
    .description('🚀 Optimize prompts for specific models')
    .option('--file <path>', 'CSV file with prompts to optimize')
    .option('--target-models <models>', 'Comma-separated target models')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export model results to file')
    .option('-v, --verbose', 'Show detailed model analysis')
    .option('--include-token-analysis', 'Include detailed token analysis')
    .option('--include-cost-breakdown', 'Include detailed cost breakdown')
    .option('--include-model-comparison', 'Include model comparison')
    .action(async (options) => {
      try {
        await handleModelOptimization(options);
      } catch (error) {
        logger.error('Model optimization failed:', error);
        process.exit(1);
      }
    });

  // Frequency-based optimization
  bulkGroup
    .command('frequency')
    .description('🚀 Optimize prompts based on usage frequency')
    .option('--file <path>', 'CSV file with prompts to optimize')
    .option(
      '--frequency-threshold <threshold>',
      'Minimum frequency threshold',
      '100'
    )
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export frequency results to file')
    .option('-v, --verbose', 'Show detailed frequency analysis')
    .option('--include-token-analysis', 'Include detailed token analysis')
    .option('--include-cost-breakdown', 'Include detailed cost breakdown')
    .option('--include-frequency-analysis', 'Include frequency analysis')
    .action(async (options) => {
      try {
        await handleFrequencyOptimization(options);
      } catch (error) {
        logger.error('Frequency optimization failed:', error);
        process.exit(1);
      }
    });

  // Cost-based optimization
  bulkGroup
    .command('cost')
    .description('🚀 Optimize prompts based on cost impact')
    .option('--file <path>', 'CSV file with prompts to optimize')
    .option('--cost-threshold <threshold>', 'Minimum cost threshold', '0.01')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export cost results to file')
    .option('-v, --verbose', 'Show detailed cost analysis')
    .option('--include-token-analysis', 'Include detailed token analysis')
    .option('--include-cost-breakdown', 'Include detailed cost breakdown')
    .option('--include-cost-analysis', 'Include cost analysis')
    .action(async (options) => {
      try {
        await handleCostOptimization(options);
      } catch (error) {
        logger.error('Cost optimization failed:', error);
        process.exit(1);
      }
    });
}

async function handleBulkOptimize(options: any) {
  logger.info('🚀 Running bulk optimization...');

  try {
    const prompts = await loadPromptsFromFile(options.file);
    const optimization = await runBulkOptimization(prompts, options);
    displayBulkOptimizationResults(optimization, options);
  } catch (error) {
    logger.error('Failed to run bulk optimization:', error);
    process.exit(1);
  }
}

async function loadPromptsFromFile(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const prompts: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row: any) => {
        prompts.push({
          promptId: row.prompt_id,
          promptText: row.prompt_text,
          model: row.model,
          frequency: parseInt(row.frequency) || 1,
          currentCost: parseFloat(row.current_cost) || 0,
        });
      })
      .on('end', () => {
        resolve(prompts);
      })
      .on('error', (error: any) => {
        reject(new Error(`Failed to read CSV file: ${error.message}`));
      });
  });
}

async function runBulkOptimization(prompts: any[], options: any) {
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

  try {
    const params = new URLSearchParams();
    if (options.includeTokenAnalysis)
      params.append('includeTokenAnalysis', 'true');
    if (options.includeCostBreakdown)
      params.append('includeCostBreakdown', 'true');
    if (options.includeOptimizationSuggestions)
      params.append('includeOptimizationSuggestions', 'true');
    if (options.includePriorityRanking)
      params.append('includePriorityRanking', 'true');

    const response = await axios.post(
      `${baseUrl}/api/bulk-optimize?${params}`,
      {
        prompts: prompts,
        options: {
          includeTokenAnalysis: options.includeTokenAnalysis,
          includeCostBreakdown: options.includeCostBreakdown,
          includeOptimizationSuggestions:
            options.includeOptimizationSuggestions,
          includePriorityRanking: options.includePriorityRanking,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

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

function displayBulkOptimizationResults(optimization: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(optimization, null, 2));
    return;
  } else if (format === 'csv') {
    console.log(
      'Prompt ID,Original Tokens,Optimized Tokens,Token Reduction,Original Cost,Optimized Cost,Cost Savings,Priority'
    );
    optimization.results.forEach((result: any) => {
      console.log(
        `"${result.promptId}","${result.originalTokens}","${result.optimizedTokens}","${result.tokenReduction}","${result.originalCost}","${result.optimizedCost}","${result.costSavings}","${result.priority}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold('\n🚀 Bulk Optimization Results'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Summary Statistics
  console.log(chalk.yellow.bold('\n📊 Summary Statistics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('Total Prompts:'),
    chalk.cyan(optimization.totalPrompts)
  );
  console.log(
    chalk.white('Total Token Reduction:'),
    chalk.green(`${optimization.totalTokenReduction.toLocaleString()} tokens`)
  );
  console.log(
    chalk.white('Total Cost Savings:'),
    chalk.green(`$${optimization.totalCostSavings.toFixed(4)}`)
  );
  console.log(
    chalk.white('Average Token Reduction:'),
    chalk.cyan(`${optimization.averageTokenReduction}%`)
  );
  console.log(
    chalk.white('Average Cost Savings:'),
    chalk.cyan(`${optimization.averageCostSavings}%`)
  );
  console.log(
    chalk.white('High Impact Prompts:'),
    chalk.yellow(optimization.highImpactPrompts)
  );

  // Individual Results
  console.log(chalk.yellow.bold('\n🔍 Individual Results'));
  console.log(chalk.gray('─'.repeat(50)));

  optimization.results.forEach((result: any, index: number) => {
    const priorityColor =
      result.priority === 'high'
        ? chalk.red
        : result.priority === 'medium'
          ? chalk.yellow
          : chalk.green;
    const savingsColor = result.costSavings > 0 ? chalk.green : chalk.red;

    console.log(chalk.white(`\n${index + 1}. ${result.promptId}:`));
    console.log(chalk.gray('   ─'.repeat(40)));

    // Basic Info
    console.log(chalk.white('   Model:'), chalk.cyan(result.model));
    console.log(chalk.white('   Priority:'), priorityColor(result.priority));
    console.log(chalk.white('   Frequency:'), chalk.cyan(result.frequency));

    // Token Analysis
    console.log(
      chalk.white('   Original Tokens:'),
      chalk.cyan(result.originalTokens.toLocaleString())
    );
    console.log(
      chalk.white('   Optimized Tokens:'),
      chalk.cyan(result.optimizedTokens.toLocaleString())
    );
    console.log(
      chalk.white('   Token Reduction:'),
      chalk.green(`${result.tokenReduction}%`)
    );

    // Cost Analysis
    console.log(
      chalk.white('   Original Cost:'),
      chalk.cyan(`$${result.originalCost.toFixed(4)}`)
    );
    console.log(
      chalk.white('   Optimized Cost:'),
      chalk.cyan(`$${result.optimizedCost.toFixed(4)}`)
    );
    console.log(
      chalk.white('   Cost Savings:'),
      savingsColor(`$${result.costSavings.toFixed(4)}`)
    );

    // Impact Analysis
    if (result.impact) {
      console.log(
        chalk.white('   Impact Score:'),
        chalk.cyan(result.impact.score)
      );
      console.log(
        chalk.white('   Impact Notes:'),
        chalk.gray(result.impact.notes)
      );
    }
  });

  // Token Analysis
  if (optimization.tokenAnalysis) {
    console.log(chalk.yellow.bold('\n🔢 Token Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Total Token Reduction:'),
      chalk.green(
        `${optimization.tokenAnalysis.totalReduction.toLocaleString()} tokens`
      )
    );
    console.log(
      chalk.white('Average Token Reduction:'),
      chalk.cyan(`${optimization.tokenAnalysis.averageReduction}%`)
    );
    console.log(
      chalk.white('Max Token Reduction:'),
      chalk.green(`${optimization.tokenAnalysis.maxReduction}%`)
    );
    console.log(
      chalk.white('Min Token Reduction:'),
      chalk.cyan(`${optimization.tokenAnalysis.minReduction}%`)
    );

    if (optimization.tokenAnalysis.breakdown) {
      console.log(chalk.white('\nToken Reduction Breakdown:'));
      Object.entries(optimization.tokenAnalysis.breakdown).forEach(
        ([range, count]: [string, any]) => {
          console.log(chalk.gray(`   ${range}: ${count} prompts`));
        }
      );
    }
  }

  // Cost Breakdown
  if (optimization.costBreakdown) {
    console.log(chalk.yellow.bold('\n💰 Cost Breakdown'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Total Cost Savings:'),
      chalk.green(`$${optimization.costBreakdown.totalSavings.toFixed(4)}`)
    );
    console.log(
      chalk.white('Average Cost Savings:'),
      chalk.cyan(`${optimization.costBreakdown.averageSavings}%`)
    );
    console.log(
      chalk.white('Max Cost Savings:'),
      chalk.green(`$${optimization.costBreakdown.maxSavings.toFixed(4)}`)
    );
    console.log(
      chalk.white('ROI Impact:'),
      chalk.cyan(`${optimization.costBreakdown.roiImpact}%`)
    );

    if (optimization.costBreakdown.byModel) {
      console.log(chalk.white('\nSavings by Model:'));
      Object.entries(optimization.costBreakdown.byModel).forEach(
        ([model, data]: [string, any]) => {
          console.log(
            chalk.gray(
              `   ${model}: $${data.savings.toFixed(4)} (${data.percentage}%)`
            )
          );
        }
      );
    }
  }

  // Priority Ranking
  if (optimization.priorityRanking) {
    console.log(chalk.yellow.bold('\n🏆 Priority Ranking'));
    console.log(chalk.gray('─'.repeat(50)));
    optimization.priorityRanking.forEach((prompt: any, index: number) => {
      const rankColor =
        index < 3 ? chalk.green : index < 6 ? chalk.yellow : chalk.gray;
      console.log(chalk.white(`${index + 1}. ${prompt.promptId}:`));
      console.log(chalk.gray(`   Priority: ${rankColor(prompt.priority)}`));
      console.log(chalk.gray(`   Impact Score: ${prompt.impactScore}`));
      console.log(
        chalk.gray(
          `   Potential Savings: $${prompt.potentialSavings.toFixed(4)}`
        )
      );
    });
  }

  // Optimization Suggestions
  if (optimization.suggestions && optimization.suggestions.length > 0) {
    console.log(chalk.yellow.bold('\n💡 Optimization Suggestions'));
    console.log(chalk.gray('─'.repeat(50)));
    optimization.suggestions.forEach((suggestion: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${suggestion.type}:`));
      console.log(chalk.gray(`   ${suggestion.description}`));
      console.log(
        chalk.gray(
          `   Potential Savings: $${suggestion.potentialSavings.toFixed(4)}`
        )
      );
      console.log(
        chalk.gray(`   Implementation: ${suggestion.implementation}`)
      );
      console.log(chalk.gray(`   Priority: ${suggestion.priority}`));
    });
  }

  // Export Results
  if (options.export) {
    try {
      exportResults(optimization, options.export, format);
      console.log(chalk.green(`\n✅ Results exported to: ${options.export}`));
    } catch (error) {
      console.log(chalk.red(`\n❌ Failed to export results: ${error}`));
    }
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function exportResults(
  optimization: any,
  filePath: string,
  format: string
) {
  if (format === 'json') {
    fs.writeFileSync(filePath, JSON.stringify(optimization, null, 2));
  } else if (format === 'csv') {
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'promptId', title: 'Prompt ID' },
        { id: 'model', title: 'Model' },
        { id: 'originalTokens', title: 'Original Tokens' },
        { id: 'optimizedTokens', title: 'Optimized Tokens' },
        { id: 'tokenReduction', title: 'Token Reduction %' },
        { id: 'originalCost', title: 'Original Cost' },
        { id: 'optimizedCost', title: 'Optimized Cost' },
        { id: 'costSavings', title: 'Cost Savings' },
        { id: 'priority', title: 'Priority' },
        { id: 'frequency', title: 'Frequency' },
      ],
    });

    await csvWriter.writeRecords(optimization.results);
  }
}

async function handleStrategyOptimization(options: any) {
  logger.info('🚀 Running strategy-based optimization...');

  try {
    const prompts = await loadPromptsFromFile(options.file);
    const strategies = options.strategies
      ? options.strategies.split(',')
      : ['token-reduction', 'cost-optimization', 'quality-preservation'];
    const optimization = await runStrategyOptimization(
      prompts,
      strategies,
      options
    );
    displayStrategyOptimizationResults(optimization, options);
  } catch (error) {
    logger.error('Failed to run strategy optimization:', error);
    process.exit(1);
  }
}

async function runStrategyOptimization(
  prompts: any[],
  strategies: string[],
  options: any
) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error(
      'Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.'
    );
  }

  try {
    const params = new URLSearchParams();
    params.append('strategies', strategies.join(','));
    if (options.includeTokenAnalysis)
      params.append('includeTokenAnalysis', 'true');
    if (options.includeCostBreakdown)
      params.append('includeCostBreakdown', 'true');
    if (options.includeComparison) params.append('includeComparison', 'true');

    const response = await axios.post(
      `${baseUrl}/api/bulk-optimize/strategies?${params}`,
      {
        prompts: prompts,
        strategies: strategies,
        options: {
          includeTokenAnalysis: options.includeTokenAnalysis,
          includeCostBreakdown: options.includeCostBreakdown,
          includeComparison: options.includeComparison,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

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

function displayStrategyOptimizationResults(optimization: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(optimization, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n🚀 Strategy Optimization Results'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Strategy Comparison
  console.log(chalk.yellow.bold('\n📊 Strategy Comparison'));
  console.log(chalk.gray('─'.repeat(50)));

  optimization.strategyResults.forEach((strategy: any) => {
    console.log(chalk.white(`\n${strategy.name}:`));
    console.log(chalk.gray('   ─'.repeat(40)));
    console.log(
      chalk.white('   Total Savings:'),
      chalk.green(`$${strategy.totalSavings.toFixed(4)}`)
    );
    console.log(
      chalk.white('   Token Reduction:'),
      chalk.cyan(`${strategy.tokenReduction}%`)
    );
    console.log(
      chalk.white('   Cost Reduction:'),
      chalk.green(`${strategy.costReduction}%`)
    );
    console.log(
      chalk.white('   Quality Impact:'),
      chalk.cyan(`${strategy.qualityImpact}%`)
    );
    console.log(
      chalk.white('   Prompts Optimized:'),
      chalk.cyan(strategy.promptsOptimized)
    );
  });

  // Best Strategy
  console.log(chalk.yellow.bold('\n🏆 Best Strategy'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('Strategy:'),
    chalk.cyan(optimization.bestStrategy.name)
  );
  console.log(
    chalk.white('Total Savings:'),
    chalk.green(`$${optimization.bestStrategy.savings.toFixed(4)}`)
  );
  console.log(
    chalk.white('Efficiency Score:'),
    chalk.cyan(`${optimization.bestStrategy.efficiencyScore}%`)
  );
  console.log(
    chalk.white('Implementation:'),
    chalk.gray(optimization.bestStrategy.implementation)
  );

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handlePriorityOptimization(options: any) {
  logger.info('🚀 Running priority-based optimization...');

  try {
    const prompts = await loadPromptsFromFile(options.file);
    const optimization = await runPriorityOptimization(prompts, options);
    displayPriorityOptimizationResults(optimization, options);
  } catch (error) {
    logger.error('Failed to run priority optimization:', error);
    process.exit(1);
  }
}

async function runPriorityOptimization(prompts: any[], options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error(
      'Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.'
    );
  }

  try {
    const params = new URLSearchParams();
    params.append('priorityCriteria', options.priorityCriteria || 'cost');
    if (options.includeTokenAnalysis)
      params.append('includeTokenAnalysis', 'true');
    if (options.includeCostBreakdown)
      params.append('includeCostBreakdown', 'true');
    if (options.includeImpactAnalysis)
      params.append('includeImpactAnalysis', 'true');

    const response = await axios.post(
      `${baseUrl}/api/bulk-optimize/priority?${params}`,
      {
        prompts: prompts,
        priorityCriteria: options.priorityCriteria || 'cost',
        options: {
          includeTokenAnalysis: options.includeTokenAnalysis,
          includeCostBreakdown: options.includeCostBreakdown,
          includeImpactAnalysis: options.includeImpactAnalysis,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

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

function displayPriorityOptimizationResults(optimization: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(optimization, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n🚀 Priority Optimization Results'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Priority Breakdown
  console.log(chalk.yellow.bold('\n📊 Priority Breakdown'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('High Priority:'),
    chalk.red(`${optimization.priorityBreakdown.high} prompts`)
  );
  console.log(
    chalk.white('Medium Priority:'),
    chalk.yellow(`${optimization.priorityBreakdown.medium} prompts`)
  );
  console.log(
    chalk.white('Low Priority:'),
    chalk.green(`${optimization.priorityBreakdown.low} prompts`)
  );

  // Impact Analysis
  if (optimization.impactAnalysis) {
    console.log(chalk.yellow.bold('\n🎯 Impact Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('High Impact Savings:'),
      chalk.green(
        `$${optimization.impactAnalysis.highImpactSavings.toFixed(4)}`
      )
    );
    console.log(
      chalk.white('Medium Impact Savings:'),
      chalk.yellow(
        `$${optimization.impactAnalysis.mediumImpactSavings.toFixed(4)}`
      )
    );
    console.log(
      chalk.white('Low Impact Savings:'),
      chalk.cyan(`$${optimization.impactAnalysis.lowImpactSavings.toFixed(4)}`)
    );
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleModelOptimization(options: any) {
  logger.info('🚀 Running model-specific optimization...');

  try {
    const prompts = await loadPromptsFromFile(options.file);
    const targetModels = options.targetModels
      ? options.targetModels.split(',')
      : ['gpt-4', 'gpt-3.5-turbo', 'claude-3-sonnet'];
    const optimization = await runModelOptimization(
      prompts,
      targetModels,
      options
    );
    displayModelOptimizationResults(optimization, options);
  } catch (error) {
    logger.error('Failed to run model optimization:', error);
    process.exit(1);
  }
}

async function runModelOptimization(
  prompts: any[],
  targetModels: string[],
  options: any
) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error(
      'Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.'
    );
  }

  try {
    const params = new URLSearchParams();
    params.append('targetModels', targetModels.join(','));
    if (options.includeTokenAnalysis)
      params.append('includeTokenAnalysis', 'true');
    if (options.includeCostBreakdown)
      params.append('includeCostBreakdown', 'true');
    if (options.includeModelComparison)
      params.append('includeModelComparison', 'true');

    const response = await axios.post(
      `${baseUrl}/api/bulk-optimize/models?${params}`,
      {
        prompts: prompts,
        targetModels: targetModels,
        options: {
          includeTokenAnalysis: options.includeTokenAnalysis,
          includeCostBreakdown: options.includeCostBreakdown,
          includeModelComparison: options.includeModelComparison,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

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

function displayModelOptimizationResults(optimization: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(optimization, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n🚀 Model Optimization Results'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Model Comparison
  console.log(chalk.yellow.bold('\n📊 Model Comparison'));
  console.log(chalk.gray('─'.repeat(50)));

  optimization.modelResults.forEach((model: any) => {
    console.log(chalk.white(`\n${model.name}:`));
    console.log(chalk.gray('   ─'.repeat(40)));
    console.log(
      chalk.white('   Total Savings:'),
      chalk.green(`$${model.totalSavings.toFixed(4)}`)
    );
    console.log(
      chalk.white('   Token Reduction:'),
      chalk.cyan(`${model.tokenReduction}%`)
    );
    console.log(
      chalk.white('   Cost Reduction:'),
      chalk.green(`${model.costReduction}%`)
    );
    console.log(
      chalk.white('   Prompts Optimized:'),
      chalk.cyan(model.promptsOptimized)
    );
  });

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleFrequencyOptimization(options: any) {
  logger.info('🚀 Running frequency-based optimization...');

  try {
    const prompts = await loadPromptsFromFile(options.file);
    const threshold = parseInt(options.frequencyThreshold) || 100;
    const optimization = await runFrequencyOptimization(
      prompts,
      threshold,
      options
    );
    displayFrequencyOptimizationResults(optimization, options);
  } catch (error) {
    logger.error('Failed to run frequency optimization:', error);
    process.exit(1);
  }
}

async function runFrequencyOptimization(
  prompts: any[],
  threshold: number,
  options: any
) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error(
      'Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.'
    );
  }

  try {
    const params = new URLSearchParams();
    params.append('threshold', threshold.toString());
    if (options.includeTokenAnalysis)
      params.append('includeTokenAnalysis', 'true');
    if (options.includeCostBreakdown)
      params.append('includeCostBreakdown', 'true');
    if (options.includeFrequencyAnalysis)
      params.append('includeFrequencyAnalysis', 'true');

    const response = await axios.post(
      `${baseUrl}/api/bulk-optimize/frequency?${params}`,
      {
        prompts: prompts,
        threshold: threshold,
        options: {
          includeTokenAnalysis: options.includeTokenAnalysis,
          includeCostBreakdown: options.includeCostBreakdown,
          includeFrequencyAnalysis: options.includeFrequencyAnalysis,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

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

function displayFrequencyOptimizationResults(optimization: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(optimization, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n🚀 Frequency Optimization Results'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Frequency Analysis
  console.log(chalk.yellow.bold('\n📊 Frequency Analysis'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Threshold:'), chalk.cyan(optimization.threshold));
  console.log(
    chalk.white('High Frequency Prompts:'),
    chalk.red(optimization.highFrequencyPrompts)
  );
  console.log(
    chalk.white('Medium Frequency Prompts:'),
    chalk.yellow(optimization.mediumFrequencyPrompts)
  );
  console.log(
    chalk.white('Low Frequency Prompts:'),
    chalk.green(optimization.lowFrequencyPrompts)
  );

  // Frequency Impact
  if (optimization.frequencyImpact) {
    console.log(chalk.yellow.bold('\n🎯 Frequency Impact'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('High Frequency Savings:'),
      chalk.green(
        `$${optimization.frequencyImpact.highFrequencySavings.toFixed(4)}`
      )
    );
    console.log(
      chalk.white('Medium Frequency Savings:'),
      chalk.yellow(
        `$${optimization.frequencyImpact.mediumFrequencySavings.toFixed(4)}`
      )
    );
    console.log(
      chalk.white('Low Frequency Savings:'),
      chalk.cyan(
        `$${optimization.frequencyImpact.lowFrequencySavings.toFixed(4)}`
      )
    );
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleCostOptimization(options: any) {
  logger.info('🚀 Running cost-based optimization...');

  try {
    const prompts = await loadPromptsFromFile(options.file);
    const threshold = parseFloat(options.costThreshold) || 0.01;
    const optimization = await runCostOptimization(prompts, threshold, options);
    displayCostOptimizationResults(optimization, options);
  } catch (error) {
    logger.error('Failed to run cost optimization:', error);
    process.exit(1);
  }
}

async function runCostOptimization(
  prompts: any[],
  threshold: number,
  options: any
) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error(
      'Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.'
    );
  }

  try {
    const params = new URLSearchParams();
    params.append('threshold', threshold.toString());
    if (options.includeTokenAnalysis)
      params.append('includeTokenAnalysis', 'true');
    if (options.includeCostBreakdown)
      params.append('includeCostBreakdown', 'true');
    if (options.includeCostAnalysis)
      params.append('includeCostAnalysis', 'true');

    const response = await axios.post(
      `${baseUrl}/api/bulk-optimize/cost?${params}`,
      {
        prompts: prompts,
        threshold: threshold,
        options: {
          includeTokenAnalysis: options.includeTokenAnalysis,
          includeCostBreakdown: options.includeCostBreakdown,
          includeCostAnalysis: options.includeCostAnalysis,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

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

function displayCostOptimizationResults(optimization: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(optimization, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n🚀 Cost Optimization Results'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Cost Analysis
  console.log(chalk.yellow.bold('\n📊 Cost Analysis'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('Threshold:'),
    chalk.cyan(`$${optimization.threshold}`)
  );
  console.log(
    chalk.white('High Cost Prompts:'),
    chalk.red(optimization.highCostPrompts)
  );
  console.log(
    chalk.white('Medium Cost Prompts:'),
    chalk.yellow(optimization.mediumCostPrompts)
  );
  console.log(
    chalk.white('Low Cost Prompts:'),
    chalk.green(optimization.lowCostPrompts)
  );

  // Cost Impact
  if (optimization.costImpact) {
    console.log(chalk.yellow.bold('\n🎯 Cost Impact'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('High Cost Savings:'),
      chalk.green(`$${optimization.costImpact.highCostSavings.toFixed(4)}`)
    );
    console.log(
      chalk.white('Medium Cost Savings:'),
      chalk.yellow(`$${optimization.costImpact.mediumCostSavings.toFixed(4)}`)
    );
    console.log(
      chalk.white('Low Cost Savings:'),
      chalk.cyan(`$${optimization.costImpact.lowCostSavings.toFixed(4)}`)
    );
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}
