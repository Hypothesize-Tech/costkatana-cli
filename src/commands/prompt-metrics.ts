import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function promptMetricsCommand(program: Command) {
  const metricsGroup = program
    .command('prompt-metrics')
    .description(
      '📊 Generate performance metrics for prompts and prompt classes'
    );

  // Main prompt-metrics command
  metricsGroup
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export metrics data to file')
    .option('-v, --verbose', 'Show detailed metrics information')
    .action(async (options) => {
      try {
        await handlePromptMetrics(options);
      } catch (error) {
        logger.error('Prompt metrics command failed:', error);
        process.exit(1);
      }
    });

  // Generate metrics by tag
  metricsGroup
    .command('tag <tag>')
    .description('📊 Generate metrics for prompts with a specific tag')
    .option('-r, --range <range>', 'Time range (7d, 30d, 90d, 1y)', '30d')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export metrics data to file')
    .option('-v, --verbose', 'Show detailed metrics information')
    .option('--include-roas', 'Include ROAS (Return on AI Spend) analysis')
    .option('--include-trends', 'Include trend analysis')
    .option('--include-breakdown', 'Include detailed breakdown by model')
    .action(async (tag, options) => {
      try {
        await handlePromptMetricsByTag(tag, options);
      } catch (error) {
        logger.error('Prompt metrics by tag failed:', error);
        process.exit(1);
      }
    });

  // Generate metrics by content pattern
  metricsGroup
    .command('pattern <pattern>')
    .description('📊 Generate metrics for prompts matching a content pattern')
    .option('-r, --range <range>', 'Time range (7d, 30d, 90d, 1y)', '30d')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export metrics data to file')
    .option('-v, --verbose', 'Show detailed metrics information')
    .option('--include-roas', 'Include ROAS (Return on AI Spend) analysis')
    .option('--include-trends', 'Include trend analysis')
    .option('--include-breakdown', 'Include detailed breakdown by model')
    .action(async (pattern, options) => {
      try {
        await handlePromptMetricsByPattern(pattern, options);
      } catch (error) {
        logger.error('Prompt metrics by pattern failed:', error);
        process.exit(1);
      }
    });

  // Generate metrics by model
  metricsGroup
    .command('model <modelName>')
    .description('📊 Generate metrics for prompts using a specific model')
    .option('-r, --range <range>', 'Time range (7d, 30d, 90d, 1y)', '30d')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export metrics data to file')
    .option('-v, --verbose', 'Show detailed metrics information')
    .option('--include-roas', 'Include ROAS (Return on AI Spend) analysis')
    .option('--include-trends', 'Include trend analysis')
    .option('--include-breakdown', 'Include detailed breakdown by prompt type')
    .action(async (modelName, options) => {
      try {
        await handlePromptMetricsByModel(modelName, options);
      } catch (error) {
        logger.error('Prompt metrics by model failed:', error);
        process.exit(1);
      }
    });

  // Generate metrics by project
  metricsGroup
    .command('project <projectName>')
    .description('📊 Generate metrics for prompts in a specific project')
    .option('-r, --range <range>', 'Time range (7d, 30d, 90d, 1y)', '30d')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export metrics data to file')
    .option('-v, --verbose', 'Show detailed metrics information')
    .option('--include-roas', 'Include ROAS (Return on AI Spend) analysis')
    .option('--include-trends', 'Include trend analysis')
    .option('--include-breakdown', 'Include detailed breakdown by prompt type')
    .action(async (projectName, options) => {
      try {
        await handlePromptMetricsByProject(projectName, options);
      } catch (error) {
        logger.error('Prompt metrics by project failed:', error);
        process.exit(1);
      }
    });

  // Generate comprehensive metrics
  metricsGroup
    .command('comprehensive')
    .description('📊 Generate comprehensive metrics across all prompts')
    .option('-r, --range <range>', 'Time range (7d, 30d, 90d, 1y)', '30d')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export metrics data to file')
    .option('-v, --verbose', 'Show detailed metrics information')
    .option('--include-roas', 'Include ROAS (Return on AI Spend) analysis')
    .option('--include-trends', 'Include trend analysis')
    .option('--include-breakdown', 'Include detailed breakdown by category')
    .action(async (options) => {
      try {
        await handlePromptMetricsComprehensive(options);
      } catch (error) {
        logger.error('Comprehensive prompt metrics failed:', error);
        process.exit(1);
      }
    });
}

async function handlePromptMetrics(_options: any) {
  console.log(chalk.cyan.bold('\n📊 Prompt Performance Metrics & Analysis'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  console.log(chalk.yellow('Available commands:'));
  console.log(
    chalk.white(
      '  costkatana prompt-metrics tag <tag>              Generate metrics by tag'
    )
  );
  console.log(
    chalk.white(
      '  costkatana prompt-metrics pattern <pattern>      Generate metrics by content pattern'
    )
  );
  console.log(
    chalk.white(
      '  costkatana prompt-metrics model <model>          Generate metrics by model'
    )
  );
  console.log(
    chalk.white(
      '  costkatana prompt-metrics project <project>      Generate metrics by project'
    )
  );
  console.log(
    chalk.white(
      '  costkatana prompt-metrics comprehensive          Generate comprehensive metrics'
    )
  );

  console.log(chalk.gray('\nExamples:'));
  console.log(
    chalk.white(
      '  costkatana prompt-metrics tag support_chat_greeting --range 30d'
    )
  );
  console.log(
    chalk.white(
      '  costkatana prompt-metrics pattern "customer service" --include-roas'
    )
  );
  console.log(
    chalk.white('  costkatana prompt-metrics model gpt-4 --include-trends')
  );
  console.log(
    chalk.white('  costkatana prompt-metrics project my-project --verbose')
  );
  console.log(
    chalk.white('  costkatana prompt-metrics comprehensive --range 90d')
  );

  console.log(chalk.gray('\nMetrics Generated:'));
  console.log(chalk.white('  • Average token usage'));
  console.log(chalk.white('  • Average cost per prompt'));
  console.log(chalk.white('  • Error rate and failure analysis'));
  console.log(chalk.white('  • Feedback ratings and sentiment'));
  console.log(chalk.white('  • ROAS (Return on AI Spend)'));
  console.log(chalk.white('  • Performance trends over time'));
  console.log(chalk.white('  • Model efficiency comparison'));

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handlePromptMetricsByTag(tag: string, options: any) {
  logger.info(`📊 Generating metrics for tag: ${tag}`);

  try {
    const range = options.range || '30d';
    const metricsData = await getPromptMetricsByTag(tag, range, options);
    displayPromptMetrics(metricsData, options);
  } catch (error) {
    logger.error('Failed to generate metrics by tag:', error);
    process.exit(1);
  }
}

async function getPromptMetricsByTag(tag: string, range: string, options: any) {
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
    params.append('tag', tag);
    params.append('range', range);
    if (options.includeRoas) params.append('includeRoas', 'true');
    if (options.includeTrends) params.append('includeTrends', 'true');
    if (options.includeBreakdown) params.append('includeBreakdown', 'true');

    const response = await axios.get(
      `${baseUrl}/api/prompt-metrics/tag?${params}`,
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

function displayPromptMetrics(metrics: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(metrics, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Metric,Value,Unit,Change');
    Object.entries(metrics.summary).forEach(([key, value]: [string, any]) => {
      console.log(
        `"${key}","${value.value}","${value.unit || ''}","${value.change || ''}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold('\n📊 Prompt Performance Metrics'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Summary Statistics
  console.log(chalk.yellow.bold('\n📈 Summary Statistics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('Total Prompts:'),
    chalk.cyan(metrics.summary.totalPrompts.toLocaleString())
  );
  console.log(
    chalk.white('Time Range:'),
    chalk.cyan(metrics.summary.timeRange)
  );
  console.log(
    chalk.white('Average Tokens:'),
    chalk.cyan(metrics.summary.avgTokens.toLocaleString())
  );
  console.log(
    chalk.white('Average Cost:'),
    chalk.green(`$${metrics.summary.avgCost.toFixed(4)}`)
  );
  console.log(
    chalk.white('Total Cost:'),
    chalk.green(`$${metrics.summary.totalCost.toFixed(2)}`)
  );

  // Performance Metrics
  console.log(chalk.yellow.bold('\n⚡ Performance Metrics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('Error Rate:'),
    chalk.red(`${(metrics.performance.errorRate * 100).toFixed(1)}%`)
  );
  console.log(
    chalk.white('Success Rate:'),
    chalk.green(`${(metrics.performance.successRate * 100).toFixed(1)}%`)
  );
  console.log(
    chalk.white('Average Latency:'),
    chalk.cyan(`${metrics.performance.avgLatency}ms`)
  );
  console.log(
    chalk.white('Throughput:'),
    chalk.cyan(`${metrics.performance.throughput} prompts/min`)
  );
  console.log(
    chalk.white('Cache Hit Rate:'),
    chalk.cyan(`${(metrics.performance.cacheHitRate * 100).toFixed(1)}%`)
  );

  // Feedback Analysis
  if (metrics.feedback) {
    console.log(chalk.yellow.bold('\n🏷️  Feedback Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Average Rating:'),
      chalk.cyan(metrics.feedback.avgRating.toFixed(1) + '/5')
    );
    console.log(
      chalk.white('Positive Feedback:'),
      chalk.green(`${(metrics.feedback.positiveRate * 100).toFixed(1)}%`)
    );
    console.log(
      chalk.white('Negative Feedback:'),
      chalk.red(`${(metrics.feedback.negativeRate * 100).toFixed(1)}%`)
    );
    console.log(
      chalk.white('Neutral Feedback:'),
      chalk.yellow(`${(metrics.feedback.neutralRate * 100).toFixed(1)}%`)
    );

    if (metrics.feedback.sentiment) {
      console.log(
        chalk.white('Sentiment Score:'),
        chalk.cyan(metrics.feedback.sentiment.toFixed(2))
      );
    }
  }

  // ROAS Analysis
  if (options.includeRoas && metrics.roas) {
    console.log(chalk.yellow.bold('\n💰 ROAS Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('ROAS Score:'),
      chalk.green(`${metrics.roas.score.toFixed(2)}`)
    );
    console.log(
      chalk.white('Revenue Generated:'),
      chalk.green(`$${metrics.roas.revenue.toFixed(2)}`)
    );
    console.log(
      chalk.white('Cost per Revenue:'),
      chalk.cyan(`$${metrics.roas.costPerRevenue.toFixed(4)}`)
    );
    console.log(chalk.white('ROAS Trend:'), chalk.cyan(metrics.roas.trend));

    if (metrics.roas.breakdown) {
      console.log(chalk.white('ROAS by Category:'));
      Object.entries(metrics.roas.breakdown).forEach(
        ([category, roas]: [string, any]) => {
          const color = roas > 1 ? chalk.green : chalk.red;
          console.log(chalk.gray(`  • ${category}: ${color(roas.toFixed(2))}`));
        }
      );
    }
  }

  // Trend Analysis
  if (options.includeTrends && metrics.trends) {
    console.log(chalk.yellow.bold('\n📈 Trend Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Cost Trend:'),
      chalk.cyan(metrics.trends.costTrend)
    );
    console.log(
      chalk.white('Usage Trend:'),
      chalk.cyan(metrics.trends.usageTrend)
    );
    console.log(
      chalk.white('Performance Trend:'),
      chalk.cyan(metrics.trends.performanceTrend)
    );
    console.log(
      chalk.white('Feedback Trend:'),
      chalk.cyan(metrics.trends.feedbackTrend)
    );

    if (metrics.trends.forecast) {
      console.log(chalk.white('Forecast (Next 30d):'));
      console.log(
        chalk.gray(
          `  • Predicted Cost: $${metrics.trends.forecast.predictedCost.toFixed(2)}`
        )
      );
      console.log(
        chalk.gray(
          `  • Predicted Usage: ${metrics.trends.forecast.predictedUsage.toLocaleString()} prompts`
        )
      );
    }
  }

  // Model Breakdown
  if (options.includeBreakdown && metrics.modelBreakdown) {
    console.log(chalk.yellow.bold('\n🤖 Model Breakdown'));
    console.log(chalk.gray('─'.repeat(50)));
    Object.entries(metrics.modelBreakdown).forEach(
      ([model, data]: [string, any]) => {
        console.log(chalk.white(`\n${model}:`));
        console.log(chalk.gray(`  Prompts: ${data.prompts.toLocaleString()}`));
        console.log(
          chalk.gray(`  Avg Tokens: ${data.avgTokens.toLocaleString()}`)
        );
        console.log(chalk.gray(`  Avg Cost: $${data.avgCost.toFixed(4)}`));
        console.log(
          chalk.gray(`  Success Rate: ${(data.successRate * 100).toFixed(1)}%`)
        );
        console.log(chalk.gray(`  Avg Latency: ${data.avgLatency}ms`));
      }
    );
  }

  // Recommendations
  if (metrics.recommendations && metrics.recommendations.length > 0) {
    console.log(chalk.yellow.bold('\n💡 Recommendations'));
    console.log(chalk.gray('─'.repeat(50)));
    metrics.recommendations.forEach((rec: any, index: number) => {
      console.log(chalk.white(`${index + 1}. ${rec.type}:`));
      console.log(chalk.gray(`   ${rec.description}`));
      if (rec.impact) {
        console.log(chalk.gray(`   Impact: ${rec.impact}`));
      }
      if (rec.implementation) {
        console.log(chalk.gray(`   Implementation: ${rec.implementation}`));
      }
    });
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handlePromptMetricsByPattern(pattern: string, options: any) {
  logger.info(`📊 Generating metrics for pattern: ${pattern}`);

  try {
    const range = options.range || '30d';
    const metricsData = await getPromptMetricsByPattern(
      pattern,
      range,
      options
    );
    displayPromptMetrics(metricsData, options);
  } catch (error) {
    logger.error('Failed to generate metrics by pattern:', error);
    process.exit(1);
  }
}

async function getPromptMetricsByPattern(
  pattern: string,
  range: string,
  options: any
) {
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
    params.append('pattern', pattern);
    params.append('range', range);
    if (options.includeRoas) params.append('includeRoas', 'true');
    if (options.includeTrends) params.append('includeTrends', 'true');
    if (options.includeBreakdown) params.append('includeBreakdown', 'true');

    const response = await axios.get(
      `${baseUrl}/api/prompt-metrics/pattern?${params}`,
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

async function handlePromptMetricsByModel(modelName: string, options: any) {
  logger.info(`📊 Generating metrics for model: ${modelName}`);

  try {
    const range = options.range || '30d';
    const metricsData = await getPromptMetricsByModel(
      modelName,
      range,
      options
    );
    displayPromptMetrics(metricsData, options);
  } catch (error) {
    logger.error('Failed to generate metrics by model:', error);
    process.exit(1);
  }
}

async function getPromptMetricsByModel(
  modelName: string,
  range: string,
  options: any
) {
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
    params.append('model', modelName);
    params.append('range', range);
    if (options.includeRoas) params.append('includeRoas', 'true');
    if (options.includeTrends) params.append('includeTrends', 'true');
    if (options.includeBreakdown) params.append('includeBreakdown', 'true');

    const response = await axios.get(
      `${baseUrl}/api/prompt-metrics/model?${params}`,
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

async function handlePromptMetricsByProject(projectName: string, options: any) {
  logger.info(`📊 Generating metrics for project: ${projectName}`);

  try {
    const range = options.range || '30d';
    const metricsData = await getPromptMetricsByProject(
      projectName,
      range,
      options
    );
    displayPromptMetrics(metricsData, options);
  } catch (error) {
    logger.error('Failed to generate metrics by project:', error);
    process.exit(1);
  }
}

async function getPromptMetricsByProject(
  projectName: string,
  range: string,
  options: any
) {
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
    params.append('project', projectName);
    params.append('range', range);
    if (options.includeRoas) params.append('includeRoas', 'true');
    if (options.includeTrends) params.append('includeTrends', 'true');
    if (options.includeBreakdown) params.append('includeBreakdown', 'true');

    const response = await axios.get(
      `${baseUrl}/api/prompt-metrics/project?${params}`,
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

async function handlePromptMetricsComprehensive(options: any) {
  logger.info('📊 Generating comprehensive prompt metrics...');

  try {
    const range = options.range || '30d';
    const metricsData = await getPromptMetricsComprehensive(range, options);
    displayComprehensiveMetrics(metricsData, options);
  } catch (error) {
    logger.error('Failed to generate comprehensive metrics:', error);
    process.exit(1);
  }
}

async function getPromptMetricsComprehensive(range: string, options: any) {
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
    params.append('range', range);
    if (options.includeRoas) params.append('includeRoas', 'true');
    if (options.includeTrends) params.append('includeTrends', 'true');
    if (options.includeBreakdown) params.append('includeBreakdown', 'true');

    const response = await axios.get(
      `${baseUrl}/api/prompt-metrics/comprehensive?${params}`,
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

function displayComprehensiveMetrics(metrics: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(metrics, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Category,Metric,Value,Unit,Change');
    Object.entries(metrics.categories).forEach(
      ([category, data]: [string, any]) => {
        Object.entries(data).forEach(([metric, value]: [string, any]) => {
          console.log(
            `"${category}","${metric}","${value.value}","${value.unit || ''}","${value.change || ''}"`
          );
        });
      }
    );
    return;
  }

  console.log(chalk.cyan.bold('\n📊 Comprehensive Prompt Metrics'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Overall Summary
  console.log(chalk.yellow.bold('\n📈 Overall Summary'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('Total Prompts:'),
    chalk.cyan(metrics.summary.totalPrompts.toLocaleString())
  );
  console.log(
    chalk.white('Total Cost:'),
    chalk.green(`$${metrics.summary.totalCost.toFixed(2)}`)
  );
  console.log(
    chalk.white('Average Cost:'),
    chalk.green(`$${metrics.summary.avgCost.toFixed(4)}`)
  );
  console.log(
    chalk.white('Success Rate:'),
    chalk.green(`${(metrics.summary.successRate * 100).toFixed(1)}%`)
  );
  console.log(
    chalk.white('Average Rating:'),
    chalk.cyan(metrics.summary.avgRating.toFixed(1) + '/5')
  );

  // Category Breakdown
  if (options.includeBreakdown && metrics.categories) {
    console.log(chalk.yellow.bold('\n📊 Category Breakdown'));
    console.log(chalk.gray('─'.repeat(50)));

    Object.entries(metrics.categories).forEach(
      ([category, data]: [string, any]) => {
        console.log(chalk.white(`\n${category}:`));
        console.log(chalk.gray(`  Prompts: ${data.prompts.toLocaleString()}`));
        console.log(chalk.gray(`  Cost: $${data.cost.toFixed(2)}`));
        console.log(
          chalk.gray(`  Success Rate: ${(data.successRate * 100).toFixed(1)}%`)
        );
        console.log(chalk.gray(`  Avg Rating: ${data.avgRating.toFixed(1)}/5`));
        console.log(
          chalk.gray(`  Avg Tokens: ${data.avgTokens.toLocaleString()}`)
        );
      }
    );
  }

  // Top Performers
  if (metrics.topPerformers) {
    console.log(chalk.yellow.bold('\n🏆 Top Performers'));
    console.log(chalk.gray('─'.repeat(50)));

    metrics.topPerformers.forEach((performer: any, index: number) => {
      console.log(chalk.white(`${index + 1}. ${performer.name}:`));
      console.log(
        chalk.gray(
          `   Success Rate: ${(performer.successRate * 100).toFixed(1)}%`
        )
      );
      console.log(
        chalk.gray(`   Avg Rating: ${performer.avgRating.toFixed(1)}/5`)
      );
      console.log(
        chalk.gray(
          `   Cost Efficiency: $${performer.costEfficiency.toFixed(4)}`
        )
      );
    });
  }

  // Performance Insights
  if (metrics.insights) {
    console.log(chalk.yellow.bold('\n💡 Performance Insights'));
    console.log(chalk.gray('─'.repeat(50)));

    metrics.insights.forEach((insight: any, index: number) => {
      console.log(chalk.white(`${index + 1}. ${insight.type}:`));
      console.log(chalk.gray(`   ${insight.description}`));
      if (insight.impact) {
        console.log(chalk.gray(`   Impact: ${insight.impact}`));
      }
    });
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}
