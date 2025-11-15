import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function retryLogCommand(program: Command) {
  const retryGroup = program
    .command('retry-log')
    .description('🔁 Show which prompts failed and retried');

  // Main retry-log command
  retryGroup
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export retry data to file')
    .option('-v, --verbose', 'Show detailed retry information')
    .action(async (options) => {
      try {
        await handleRetryLog(options);
      } catch (error) {
        logger.error('Retry log command failed:', error);
        process.exit(1);
      }
    });

  // Show retry logs by time range
  retryGroup
    .command('range')
    .description('🔁 Show retry logs for a specific time range')
    .option('-r, --range <range>', 'Time range (1d, 7d, 30d, 90d)', '7d')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export retry data to file')
    .option('-v, --verbose', 'Show detailed retry information')
    .option('--include-successful', 'Include successful retries')
    .option('--include-failed', 'Include failed retries')
    .option('--include-timeout', 'Include timeout retries')
    .option('--include-rate-limit', 'Include rate limit retries')
    .action(async (options) => {
      try {
        await handleRetryLogByRange(options);
      } catch (error) {
        logger.error('Retry log by range failed:', error);
        process.exit(1);
      }
    });

  // Show retry logs by request ID
  retryGroup
    .command('id <requestId>')
    .description('🔁 Show detailed retry log for a specific request')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export retry data to file')
    .option('-v, --verbose', 'Show detailed retry information')
    .action(async (requestId, options) => {
      try {
        await handleRetryLogById(requestId, options);
      } catch (error) {
        logger.error('Retry log by ID failed:', error);
        process.exit(1);
      }
    });

  // Show retry logs by failure type
  retryGroup
    .command('failure <failureType>')
    .description('🔁 Show retry logs for a specific failure type')
    .option('-r, --range <range>', 'Time range (1d, 7d, 30d, 90d)', '7d')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export retry data to file')
    .option('-v, --verbose', 'Show detailed retry information')
    .action(async (failureType, options) => {
      try {
        await handleRetryLogByFailureType(failureType, options);
      } catch (error) {
        logger.error('Retry log by failure type failed:', error);
        process.exit(1);
      }
    });

  // Show retry logs by model
  retryGroup
    .command('model <modelName>')
    .description('🔁 Show retry logs for a specific model')
    .option('-r, --range <range>', 'Time range (1d, 7d, 30d, 90d)', '7d')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export retry data to file')
    .option('-v, --verbose', 'Show detailed retry information')
    .action(async (modelName, options) => {
      try {
        await handleRetryLogByModel(modelName, options);
      } catch (error) {
        logger.error('Retry log by model failed:', error);
        process.exit(1);
      }
    });

  // Show retry statistics
  retryGroup
    .command('stats')
    .description('📊 Show retry statistics and patterns')
    .option('-r, --range <range>', 'Time range (1d, 7d, 30d, 90d)', '7d')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export statistics data to file')
    .option('-v, --verbose', 'Show detailed statistics')
    .action(async (options) => {
      try {
        await handleRetryLogStats(options);
      } catch (error) {
        logger.error('Retry log stats failed:', error);
        process.exit(1);
      }
    });
}

async function handleRetryLog(_options: any) {
  console.log(chalk.cyan.bold('\n🔁 Retry Log & Failure Analysis'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  console.log(chalk.yellow('Available commands:'));
  console.log(
    chalk.white(
      '  costkatana retry-log range                    Show retry logs by time range'
    )
  );
  console.log(
    chalk.white(
      '  costkatana retry-log id <requestId>           Show retry log for specific request'
    )
  );
  console.log(
    chalk.white(
      '  costkatana retry-log failure <failureType>    Show retry logs by failure type'
    )
  );
  console.log(
    chalk.white(
      '  costkatana retry-log model <modelName>        Show retry logs by model'
    )
  );
  console.log(
    chalk.white(
      '  costkatana retry-log stats                    Show retry statistics'
    )
  );

  console.log(chalk.gray('\nExamples:'));
  console.log(chalk.white('  costkatana retry-log range --range 7d'));
  console.log(chalk.white('  costkatana retry-log id req-12345'));
  console.log(chalk.white('  costkatana retry-log failure timeout'));
  console.log(chalk.white('  costkatana retry-log model gpt-4'));
  console.log(chalk.white('  costkatana retry-log stats --range 30d'));

  console.log(chalk.gray('\nRetry Information:'));
  console.log(chalk.white('  • Request ID and failure cause'));
  console.log(chalk.white('  • Retry attempts and strategy used'));
  console.log(chalk.white('  • Final outcome (success/failure)'));
  console.log(chalk.white('  • Failure patterns and trends'));
  console.log(chalk.white('  • Retry success rates by type'));
  console.log(chalk.white('  • Performance impact analysis'));

  console.log(chalk.gray('\nFailure Types:'));
  console.log(chalk.white('  • 5xx - Server errors'));
  console.log(chalk.white('  • timeout - Request timeouts'));
  console.log(chalk.white('  • rate-limit - Rate limiting'));
  console.log(chalk.white('  • quota-exceeded - Quota limits'));
  console.log(chalk.white('  • network - Network connectivity'));
  console.log(chalk.white('  • invalid-request - Malformed requests'));

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleRetryLogByRange(options: any) {
  logger.info(`🔁 Fetching retry logs for range: ${options.range || '7d'}`);

  try {
    const range = options.range || '7d';
    const retryData = await getRetryLogsByRange(range, options);
    displayRetryLogs(retryData, options);
  } catch (error) {
    logger.error('Failed to fetch retry logs by range:', error);
    process.exit(1);
  }
}

async function getRetryLogsByRange(range: string, options: any) {
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
    if (options.includeSuccessful) params.append('includeSuccessful', 'true');
    if (options.includeFailed) params.append('includeFailed', 'true');
    if (options.includeTimeout) params.append('includeTimeout', 'true');
    if (options.includeRateLimit) params.append('includeRateLimit', 'true');

    const response = await axios.get(
      `${baseUrl}/api/retry-log/range?${params}`,
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

function displayRetryLogs(retryLogs: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(retryLogs, null, 2));
    return;
  } else if (format === 'csv') {
    console.log(
      'Request ID,Failure Cause,Retry Attempts,Strategy,Final Outcome,Model,Timestamp'
    );
    retryLogs.logs.forEach((log: any) => {
      console.log(
        `"${log.requestId}","${log.failureCause}","${log.retryAttempts}","${log.strategy}","${log.finalOutcome}","${log.model}","${log.timestamp}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold('\n🔁 Retry Log Analysis'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Summary Statistics
  console.log(chalk.yellow.bold('\n📊 Summary Statistics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('Total Retries:'),
    chalk.cyan(retryLogs.summary.totalRetries.toLocaleString())
  );
  console.log(
    chalk.white('Successful Retries:'),
    chalk.green(retryLogs.summary.successfulRetries.toLocaleString())
  );
  console.log(
    chalk.white('Failed Retries:'),
    chalk.red(retryLogs.summary.failedRetries.toLocaleString())
  );
  console.log(
    chalk.white('Success Rate:'),
    chalk.green(`${(retryLogs.summary.successRate * 100).toFixed(1)}%`)
  );
  console.log(
    chalk.white('Average Retry Attempts:'),
    chalk.cyan(retryLogs.summary.avgRetryAttempts.toFixed(1))
  );

  // Failure Type Breakdown
  if (retryLogs.failureBreakdown) {
    console.log(chalk.yellow.bold('\n🚨 Failure Type Breakdown'));
    console.log(chalk.gray('─'.repeat(50)));
    Object.entries(retryLogs.failureBreakdown).forEach(
      ([type, data]: [string, any]) => {
        const color = data.count > 0 ? chalk.red : chalk.gray;
        console.log(
          chalk.white(`${type}:`),
          color(`${data.count} (${(data.percentage * 100).toFixed(1)}%)`)
        );
        if (data.avgRetries) {
          console.log(
            chalk.gray(`  Avg Retries: ${data.avgRetries.toFixed(1)}`)
          );
        }
      }
    );
  }

  // Retry Logs
  if (retryLogs.logs && retryLogs.logs.length > 0) {
    console.log(chalk.yellow.bold('\n📋 Retry Logs'));
    console.log(chalk.gray('─'.repeat(50)));

    retryLogs.logs.forEach((log: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${log.requestId}`));
      console.log(chalk.gray('   ─'.repeat(40)));

      // Failure information
      const failureColor =
        log.failureCause === 'timeout'
          ? chalk.yellow
          : log.failureCause === 'rate-limit'
            ? chalk.magenta
            : chalk.red;
      console.log(
        chalk.white('   🚨 Failure:'),
        failureColor(log.failureCause)
      );

      // Retry attempts
      console.log(
        chalk.white('   🔄 Attempts:'),
        chalk.cyan(log.retryAttempts)
      );
      console.log(chalk.white('   🎯 Strategy:'), chalk.cyan(log.strategy));

      // Final outcome
      const outcomeColor =
        log.finalOutcome === 'success' ? chalk.green : chalk.red;
      console.log(
        chalk.white('   📊 Outcome:'),
        outcomeColor(log.finalOutcome)
      );

      // Model and timestamp
      console.log(chalk.white('   🤖 Model:'), chalk.cyan(log.model));
      console.log(
        chalk.white('   ⏰ Time:'),
        chalk.cyan(new Date(log.timestamp).toLocaleString())
      );

      // Additional details if verbose
      if (options.verbose && log.details) {
        console.log(chalk.white('   📝 Details:'));
        console.log(chalk.gray(`     Error: ${log.details.error}`));
        console.log(
          chalk.gray(`     Response Time: ${log.details.responseTime}ms`)
        );
        console.log(
          chalk.gray(`     Retry Delay: ${log.details.retryDelay}ms`)
        );
      }
    });
  } else {
    console.log(chalk.yellow('\nNo retry logs found for the specified range.'));
  }

  // Recommendations
  if (retryLogs.recommendations && retryLogs.recommendations.length > 0) {
    console.log(chalk.yellow.bold('\n💡 Recommendations'));
    console.log(chalk.gray('─'.repeat(50)));
    retryLogs.recommendations.forEach((rec: any, index: number) => {
      console.log(chalk.white(`${index + 1}. ${rec.type}:`));
      console.log(chalk.gray(`   ${rec.description}`));
      if (rec.impact) {
        console.log(chalk.gray(`   Impact: ${rec.impact}`));
      }
    });
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleRetryLogById(requestId: string, options: any) {
  logger.info(`🔁 Fetching retry log for request: ${requestId}`);

  try {
    const retryData = await getRetryLogById(requestId, options);
    displayRetryLogDetail(retryData, options);
  } catch (error) {
    logger.error('Failed to fetch retry log by ID:', error);
    process.exit(1);
  }
}

async function getRetryLogById(requestId: string, _options: any) {
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
    const response = await axios.get(`${baseUrl}/api/retry-log/${requestId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
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

function displayRetryLogDetail(retryLog: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(retryLog, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Attempt,Status,Error,Response Time,Retry Delay,Strategy');
    retryLog.attempts.forEach((attempt: any, index: number) => {
      console.log(
        `"${index + 1}","${attempt.status}","${attempt.error}","${attempt.responseTime}","${attempt.retryDelay}","${attempt.strategy}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold(`\n🔁 Retry Log Detail: ${retryLog.requestId}`));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Request Information
  console.log(chalk.yellow.bold('\n📋 Request Information'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Request ID:'), chalk.cyan(retryLog.requestId));
  console.log(chalk.white('Model:'), chalk.cyan(retryLog.model));
  console.log(chalk.white('Provider:'), chalk.cyan(retryLog.provider));
  console.log(
    chalk.white('Initial Failure:'),
    chalk.red(retryLog.initialFailure)
  );
  console.log(
    chalk.white('Final Outcome:'),
    retryLog.finalOutcome === 'success'
      ? chalk.green(retryLog.finalOutcome)
      : chalk.red(retryLog.finalOutcome)
  );
  console.log(
    chalk.white('Total Attempts:'),
    chalk.cyan(retryLog.totalAttempts)
  );
  console.log(
    chalk.white('Total Duration:'),
    chalk.cyan(`${retryLog.totalDuration}ms`)
  );

  // Retry Attempts Timeline
  console.log(chalk.yellow.bold('\n⏱️  Retry Attempts Timeline'));
  console.log(chalk.gray('─'.repeat(50)));

  retryLog.attempts.forEach((attempt: any, index: number) => {
    console.log(chalk.white(`\nAttempt ${index + 1}:`));
    console.log(chalk.gray('   ─'.repeat(30)));

    const statusColor =
      attempt.status === 'success'
        ? chalk.green
        : attempt.status === 'retry'
          ? chalk.yellow
          : chalk.red;
    console.log(chalk.white('   Status:'), statusColor(attempt.status));
    console.log(
      chalk.white('   Time:'),
      chalk.cyan(new Date(attempt.timestamp).toLocaleString())
    );
    console.log(
      chalk.white('   Response Time:'),
      chalk.cyan(`${attempt.responseTime}ms`)
    );

    if (attempt.error) {
      console.log(chalk.white('   Error:'), chalk.red(attempt.error));
    }

    if (attempt.retryDelay) {
      console.log(
        chalk.white('   Retry Delay:'),
        chalk.cyan(`${attempt.retryDelay}ms`)
      );
    }

    console.log(chalk.white('   Strategy:'), chalk.cyan(attempt.strategy));
  });

  // Performance Analysis
  if (retryLog.performance) {
    console.log(chalk.yellow.bold('\n📊 Performance Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Average Response Time:'),
      chalk.cyan(`${retryLog.performance.avgResponseTime}ms`)
    );
    console.log(
      chalk.white('Total Cost:'),
      chalk.green(`$${retryLog.performance.totalCost.toFixed(4)}`)
    );
    console.log(
      chalk.white('Cost per Attempt:'),
      chalk.cyan(`$${retryLog.performance.costPerAttempt.toFixed(4)}`)
    );
    console.log(
      chalk.white('Success Rate:'),
      chalk.green(`${(retryLog.performance.successRate * 100).toFixed(1)}%`)
    );
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleRetryLogByFailureType(failureType: string, options: any) {
  logger.info(`🔁 Fetching retry logs for failure type: ${failureType}`);

  try {
    const range = options.range || '7d';
    const retryData = await getRetryLogsByFailureType(
      failureType,
      range,
      options
    );
    displayRetryLogs(retryData, options);
  } catch (error) {
    logger.error('Failed to fetch retry logs by failure type:', error);
    process.exit(1);
  }
}

async function getRetryLogsByFailureType(
  failureType: string,
  range: string,
  _options: any
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
    params.append('failureType', failureType);
    params.append('range', range);

    const response = await axios.get(
      `${baseUrl}/api/retry-log/failure-type?${params}`,
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

async function handleRetryLogByModel(modelName: string, options: any) {
  logger.info(`🔁 Fetching retry logs for model: ${modelName}`);

  try {
    const range = options.range || '7d';
    const retryData = await getRetryLogsByModel(modelName, range, options);
    displayRetryLogs(retryData, options);
  } catch (error) {
    logger.error('Failed to fetch retry logs by model:', error);
    process.exit(1);
  }
}

async function getRetryLogsByModel(
  modelName: string,
  range: string,
  _options: any
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

    const response = await axios.get(
      `${baseUrl}/api/retry-log/model?${params}`,
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

async function handleRetryLogStats(options: any) {
  logger.info('📊 Generating retry statistics...');

  try {
    const range = options.range || '7d';
    const statsData = await getRetryLogStats(range, options);
    displayRetryLogStats(statsData, options);
  } catch (error) {
    logger.error('Failed to generate retry statistics:', error);
    process.exit(1);
  }
}

async function getRetryLogStats(range: string, _options: any) {
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

    const response = await axios.get(
      `${baseUrl}/api/retry-log/stats?${params}`,
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

function displayRetryLogStats(stats: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(stats, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Metric,Value,Unit,Change');
    Object.entries(stats.summary).forEach(([key, value]: [string, any]) => {
      console.log(
        `"${key}","${value.value}","${value.unit || ''}","${value.change || ''}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold('\n📊 Retry Statistics & Patterns'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Overall Statistics
  console.log(chalk.yellow.bold('\n📈 Overall Statistics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('Total Requests:'),
    chalk.cyan(stats.summary.totalRequests.toLocaleString())
  );
  console.log(
    chalk.white('Retried Requests:'),
    chalk.yellow(stats.summary.retriedRequests.toLocaleString())
  );
  console.log(
    chalk.white('Retry Rate:'),
    chalk.cyan(`${(stats.summary.retryRate * 100).toFixed(1)}%`)
  );
  console.log(
    chalk.white('Successful Retries:'),
    chalk.green(stats.summary.successfulRetries.toLocaleString())
  );
  console.log(
    chalk.white('Failed Retries:'),
    chalk.red(stats.summary.failedRetries.toLocaleString())
  );
  console.log(
    chalk.white('Retry Success Rate:'),
    chalk.green(`${(stats.summary.retrySuccessRate * 100).toFixed(1)}%`)
  );
  console.log(
    chalk.white('Average Retry Attempts:'),
    chalk.cyan(stats.summary.avgRetryAttempts.toFixed(1))
  );

  // Failure Type Analysis
  if (stats.failureTypes) {
    console.log(chalk.yellow.bold('\n🚨 Failure Type Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    Object.entries(stats.failureTypes).forEach(
      ([type, data]: [string, any]) => {
        console.log(chalk.white(`\n${type}:`));
        console.log(chalk.gray(`  Count: ${data.count.toLocaleString()}`));
        console.log(
          chalk.gray(`  Percentage: ${(data.percentage * 100).toFixed(1)}%`)
        );
        console.log(
          chalk.gray(`  Success Rate: ${(data.successRate * 100).toFixed(1)}%`)
        );
        console.log(chalk.gray(`  Avg Retries: ${data.avgRetries.toFixed(1)}`));
        console.log(
          chalk.gray(`  Avg Response Time: ${data.avgResponseTime}ms`)
        );
      }
    );
  }

  // Model Performance
  if (stats.modelPerformance) {
    console.log(chalk.yellow.bold('\n🤖 Model Performance'));
    console.log(chalk.gray('─'.repeat(50)));
    Object.entries(stats.modelPerformance).forEach(
      ([model, data]: [string, any]) => {
        console.log(chalk.white(`\n${model}:`));
        console.log(
          chalk.gray(`  Retry Rate: ${(data.retryRate * 100).toFixed(1)}%`)
        );
        console.log(
          chalk.gray(`  Success Rate: ${(data.successRate * 100).toFixed(1)}%`)
        );
        console.log(chalk.gray(`  Avg Retries: ${data.avgRetries.toFixed(1)}`));
        console.log(
          chalk.gray(`  Avg Response Time: ${data.avgResponseTime}ms`)
        );
      }
    );
  }

  // Time-based Patterns
  if (stats.timePatterns) {
    console.log(chalk.yellow.bold('\n⏰ Time-based Patterns'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Peak Retry Hours:'),
      chalk.cyan(stats.timePatterns.peakHours.join(', '))
    );
    console.log(
      chalk.white('Lowest Retry Hours:'),
      chalk.cyan(stats.timePatterns.lowestHours.join(', '))
    );
    console.log(
      chalk.white('Weekly Pattern:'),
      chalk.cyan(stats.timePatterns.weeklyPattern)
    );
    console.log(chalk.white('Trend:'), chalk.cyan(stats.timePatterns.trend));
  }

  // Cost Impact
  if (stats.costImpact) {
    console.log(chalk.yellow.bold('\n💰 Cost Impact'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Additional Cost from Retries:'),
      chalk.red(`$${stats.costImpact.additionalCost.toFixed(2)}`)
    );
    console.log(
      chalk.white('Cost Increase:'),
      chalk.red(`${(stats.costImpact.costIncrease * 100).toFixed(1)}%`)
    );
    console.log(
      chalk.white('Average Cost per Retry:'),
      chalk.cyan(`$${stats.costImpact.avgCostPerRetry.toFixed(4)}`)
    );
  }

  // Recommendations
  if (stats.recommendations && stats.recommendations.length > 0) {
    console.log(chalk.yellow.bold('\n💡 Recommendations'));
    console.log(chalk.gray('─'.repeat(50)));
    stats.recommendations.forEach((rec: any, index: number) => {
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
