import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function traceCommand(program: Command) {
  const traceGroup = program
    .command('trace')
    .description('🧪 Debug request trails and GALLM decisions');

  // Main trace command
  traceGroup
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export trace data to file')
    .option('-v, --verbose', 'Show detailed trace information')
    .action(async (options) => {
      try {
        await handleTrace(options);
      } catch (error) {
        logger.error('Trace command failed:', error);
        process.exit(1);
      }
    });

  // Trace by request ID
  traceGroup
    .command('id <requestId>')
    .description('🧪 Trace a specific request by ID')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export trace data to file')
    .option('-v, --verbose', 'Show detailed trace information')
    .action(async (requestId, options) => {
      try {
        await handleTraceById(requestId, options);
      } catch (error) {
        logger.error('Trace by ID failed:', error);
        process.exit(1);
      }
    });

  // Trace recent requests
  traceGroup
    .command('recent')
    .description('📋 Show recent request traces')
    .option('-n, --number <count>', 'Number of recent requests to show', '10')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export trace data to file')
    .option('-v, --verbose', 'Show detailed trace information')
    .action(async (options) => {
      try {
        await handleTraceRecent(options);
      } catch (error) {
        logger.error('Trace recent failed:', error);
        process.exit(1);
      }
    });

  // Trace by project
  traceGroup
    .command('project <projectName>')
    .description('📁 Trace requests for a specific project')
    .option('-d, --days <days>', 'Number of days to look back', '7')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export trace data to file')
    .option('-v, --verbose', 'Show detailed trace information')
    .action(async (projectName, options) => {
      try {
        await handleTraceByProject(projectName, options);
      } catch (error) {
        logger.error('Trace by project failed:', error);
        process.exit(1);
      }
    });
}

async function handleTrace(_options: any) {
  console.log(chalk.cyan.bold('\n🧪 Request Tracing & Debugging'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  console.log(chalk.yellow('Available commands:'));
  console.log(
    chalk.white(
      '  costkatana trace id <requestId>     Trace a specific request'
    )
  );
  console.log(
    chalk.white(
      '  costkatana trace recent             Show recent request traces'
    )
  );
  console.log(
    chalk.white(
      '  costkatana trace project <name>     Trace requests for a project'
    )
  );

  console.log(chalk.gray('\nExamples:'));
  console.log(chalk.white('  costkatana trace id req-8230'));
  console.log(chalk.white('  costkatana trace recent --number 5'));
  console.log(chalk.white('  costkatana trace project my-project --days 30'));
  console.log(chalk.white('  costkatana trace id req-8230 --format json'));

  console.log(chalk.gray('\nTrace Information:'));
  console.log(chalk.white('  • Model used and provider'));
  console.log(chalk.white('  • Prompt and response'));
  console.log(chalk.white('  • Cost breakdown'));
  console.log(chalk.white('  • Retry/caching history'));
  console.log(chalk.white('  • GALLM decisions'));
  console.log(chalk.white('  • Performance metrics'));

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleTraceById(requestId: string, options: any) {
  logger.info(`🧪 Tracing request: ${requestId}`);

  try {
    const traceData = await getTraceById(requestId);
    displayTraceResult(traceData, options);
  } catch (error) {
    logger.error('Failed to trace request:', error);
    process.exit(1);
  }
}

async function getTraceById(requestId: string) {
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
    const response = await axios.get(`${baseUrl}/api/trace/${requestId}`, {
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

function displayTraceResult(trace: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(trace, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Request ID,Model,Provider,Cost,Status,Duration,Tokens');
    console.log(
      `"${trace.requestId}","${trace.model}","${trace.provider}","${trace.cost}","${trace.status}","${trace.duration}","${trace.tokens}"`
    );
    return;
  }

  console.log(chalk.cyan.bold('\n🧪 Request Trace'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Basic Information
  console.log(chalk.yellow.bold('\n📋 Request Information'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('🆔 Request ID:'), chalk.cyan(trace.requestId));
  console.log(
    chalk.white('📅 Timestamp:'),
    chalk.cyan(new Date(trace.timestamp).toLocaleString())
  );
  console.log(chalk.white('📊 Status:'), chalk.green(trace.status));
  console.log(chalk.white('⏱️  Duration:'), chalk.cyan(`${trace.duration}ms`));

  // Model Information
  console.log(chalk.yellow.bold('\n🤖 Model & Provider'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('🧠 Model:'), chalk.cyan(trace.model));
  console.log(chalk.white('🏢 Provider:'), chalk.cyan(trace.provider));
  console.log(
    chalk.white('🔢 Tokens:'),
    chalk.cyan(
      `${trace.inputTokens} input + ${trace.outputTokens} output = ${trace.totalTokens} total`
    )
  );
  console.log(
    chalk.white('💰 Cost:'),
    chalk.green(`$${trace.cost.toFixed(4)}`)
  );

  // Prompt and Response
  if (options.verbose) {
    console.log(chalk.yellow.bold('\n💬 Prompt & Response'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('📝 Prompt:'));
    console.log(chalk.gray(trace.prompt));
    console.log(chalk.white('\n🤖 Response:'));
    console.log(chalk.gray(trace.response));
  }

  // Cost Breakdown
  console.log(chalk.yellow.bold('\n💰 Cost Breakdown'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('Token Cost:'),
    chalk.cyan(`$${trace.costBreakdown?.tokenCost?.toFixed(4) || '0.0000'}`)
  );
  console.log(
    chalk.white('API Cost:'),
    chalk.cyan(`$${trace.costBreakdown?.apiCost?.toFixed(4) || '0.0000'}`)
  );
  console.log(
    chalk.white('Total Cost:'),
    chalk.green(`$${trace.cost.toFixed(4)}`)
  );
  console.log(
    chalk.white('Cost per Token:'),
    chalk.cyan(
      `$${trace.costBreakdown?.costPerToken?.toFixed(6) || '0.000000'}`
    )
  );

  // Retry/Caching History
  if (trace.retryHistory && trace.retryHistory.length > 0) {
    console.log(chalk.yellow.bold('\n🔄 Retry History'));
    console.log(chalk.gray('─'.repeat(50)));
    trace.retryHistory.forEach((retry: any, index: number) => {
      console.log(chalk.white(`${index + 1}. Attempt ${retry.attempt}:`));
      console.log(chalk.gray(`   Model: ${retry.model} (${retry.provider})`));
      console.log(chalk.gray(`   Status: ${retry.status}`));
      console.log(chalk.gray(`   Duration: ${retry.duration}ms`));
      if (retry.error) {
        console.log(chalk.red(`   Error: ${retry.error}`));
      }
    });
  }

  // Cache Information
  if (trace.cacheInfo) {
    console.log(chalk.yellow.bold('\n💾 Cache Information'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Cache Status:'),
      trace.cacheInfo.hit ? chalk.green('HIT') : chalk.red('MISS')
    );
    console.log(
      chalk.white('Cache Age:'),
      chalk.cyan(trace.cacheInfo.age || 'N/A')
    );
    console.log(
      chalk.white('Cache Size:'),
      chalk.cyan(trace.cacheInfo.size || 'N/A')
    );
  }

  // GALLM Decisions
  if (trace.gallmDecisions) {
    console.log(chalk.yellow.bold('\n🎯 GALLM Decisions'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Routing Decision:'),
      chalk.cyan(trace.gallmDecisions.routingDecision)
    );
    console.log(
      chalk.white('Fallback Used:'),
      trace.gallmDecisions.fallbackUsed
        ? chalk.yellow('Yes')
        : chalk.green('No')
    );
    console.log(
      chalk.white('Load Balancing:'),
      chalk.cyan(trace.gallmDecisions.loadBalancing || 'N/A')
    );
    console.log(
      chalk.white('Cost Optimization:'),
      chalk.cyan(trace.gallmDecisions.costOptimization || 'N/A')
    );
  }

  // Performance Metrics
  console.log(chalk.yellow.bold('\n📈 Performance Metrics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Response Time:'), chalk.cyan(`${trace.duration}ms`));
  console.log(
    chalk.white('Tokens per Second:'),
    chalk.cyan(trace.performance?.tokensPerSecond?.toFixed(2) || 'N/A')
  );
  console.log(
    chalk.white('Cost per Second:'),
    chalk.cyan(`$${trace.performance?.costPerSecond?.toFixed(6) || '0.000000'}`)
  );
  console.log(
    chalk.white('Throughput:'),
    chalk.cyan(
      `${trace.performance?.throughput?.toFixed(2) || 'N/A'} requests/min`
    )
  );

  // Error Information
  if (trace.error) {
    console.log(chalk.yellow.bold('\n❌ Error Information'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('Error Type:'), chalk.red(trace.error.type));
    console.log(chalk.white('Error Message:'), chalk.red(trace.error.message));
    console.log(
      chalk.white('Error Code:'),
      chalk.red(trace.error.code || 'N/A')
    );
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleTraceRecent(options: any) {
  logger.info('📋 Fetching recent request traces...');

  try {
    const count = parseInt(options.number) || 10;
    const traces = await getRecentTraces(count);
    displayRecentTraces(traces, options);
  } catch (error) {
    logger.error('Failed to fetch recent traces:', error);
    process.exit(1);
  }
}

async function getRecentTraces(count: number) {
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
    const response = await axios.get(
      `${baseUrl}/api/trace/recent?count=${count}`,
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

function displayRecentTraces(traces: any[], options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(traces, null, 2));
    return;
  } else if (format === 'csv') {
    console.log(
      'Request ID,Model,Provider,Cost,Status,Duration,Tokens,Timestamp'
    );
    traces.forEach((trace) => {
      console.log(
        `"${trace.requestId}","${trace.model}","${trace.provider}","${trace.cost}","${trace.status}","${trace.duration}","${trace.totalTokens}","${trace.timestamp}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold('\n📋 Recent Request Traces'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  if (traces.length === 0) {
    console.log(chalk.yellow('No recent traces found.'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    return;
  }

  traces.forEach((trace, index) => {
    const statusColor = trace.status === 'success' ? chalk.green : chalk.red;
    const statusIcon = trace.status === 'success' ? '✅' : '❌';

    console.log(
      chalk.white(`\n${index + 1}. ${statusIcon} ${trace.requestId}`)
    );
    console.log(chalk.gray('   ─'.repeat(40)));

    console.log(chalk.white('   🤖 Model:'), chalk.cyan(trace.model));
    console.log(chalk.white('   🏢 Provider:'), chalk.cyan(trace.provider));
    console.log(
      chalk.white('   💰 Cost:'),
      chalk.green(`$${trace.cost.toFixed(4)}`)
    );
    console.log(chalk.white('   📊 Status:'), statusColor(trace.status));
    console.log(
      chalk.white('   ⏱️  Duration:'),
      chalk.cyan(`${trace.duration}ms`)
    );
    console.log(chalk.white('   🔢 Tokens:'), chalk.cyan(trace.totalTokens));
    console.log(
      chalk.white('   📅 Time:'),
      chalk.cyan(new Date(trace.timestamp).toLocaleString())
    );

    if (trace.error) {
      console.log(chalk.white('   ❌ Error:'), chalk.red(trace.error.message));
    }
  });

  console.log(
    chalk.gray('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(chalk.yellow('💡 Commands:'));
  console.log(
    chalk.white('  • Trace specific request: costkatana trace id <requestId>')
  );
  console.log(
    chalk.white('  • Trace by project: costkatana trace project <name>')
  );
}

async function handleTraceByProject(projectName: string, options: any) {
  logger.info(`📁 Tracing requests for project: ${projectName}`);

  try {
    const days = parseInt(options.days) || 7;
    const traces = await getTracesByProject(projectName, days);
    displayProjectTraces(traces, projectName, options);
  } catch (error) {
    logger.error('Failed to trace project requests:', error);
    process.exit(1);
  }
}

async function getTracesByProject(projectName: string, days: number) {
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
    const response = await axios.get(
      `${baseUrl}/api/trace/project/${projectName}?days=${days}`,
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

function displayProjectTraces(
  traces: any[],
  projectName: string,
  options: any
) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(traces, null, 2));
    return;
  } else if (format === 'csv') {
    console.log(
      'Request ID,Model,Provider,Cost,Status,Duration,Tokens,Timestamp'
    );
    traces.forEach((trace) => {
      console.log(
        `"${trace.requestId}","${trace.model}","${trace.provider}","${trace.cost}","${trace.status}","${trace.duration}","${trace.totalTokens}","${trace.timestamp}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold(`\n📁 Project Traces: ${projectName}`));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  if (traces.length === 0) {
    console.log(
      chalk.yellow(
        `No traces found for project "${projectName}" in the last ${options.days} days.`
      )
    );
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    return;
  }

  // Summary statistics
  const totalCost = traces.reduce((sum, trace) => sum + trace.cost, 0);
  const totalTokens = traces.reduce((sum, trace) => sum + trace.totalTokens, 0);
  const successCount = traces.filter(
    (trace) => trace.status === 'success'
  ).length;
  const errorCount = traces.length - successCount;

  console.log(chalk.yellow.bold('\n📊 Summary Statistics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Total Requests:'), chalk.cyan(traces.length));
  console.log(chalk.white('Successful:'), chalk.green(successCount));
  console.log(chalk.white('Errors:'), chalk.red(errorCount));
  console.log(
    chalk.white('Total Cost:'),
    chalk.green(`$${totalCost.toFixed(4)}`)
  );
  console.log(
    chalk.white('Total Tokens:'),
    chalk.cyan(totalTokens.toLocaleString())
  );

  // Detailed traces
  console.log(chalk.yellow.bold('\n📋 Request Details'));
  console.log(chalk.gray('─'.repeat(50)));

  traces.forEach((trace, index) => {
    const statusColor = trace.status === 'success' ? chalk.green : chalk.red;
    const statusIcon = trace.status === 'success' ? '✅' : '❌';

    console.log(
      chalk.white(`\n${index + 1}. ${statusIcon} ${trace.requestId}`)
    );
    console.log(chalk.gray('   ─'.repeat(40)));

    console.log(chalk.white('   🤖 Model:'), chalk.cyan(trace.model));
    console.log(chalk.white('   🏢 Provider:'), chalk.cyan(trace.provider));
    console.log(
      chalk.white('   💰 Cost:'),
      chalk.green(`$${trace.cost.toFixed(4)}`)
    );
    console.log(chalk.white('   📊 Status:'), statusColor(trace.status));
    console.log(
      chalk.white('   ⏱️  Duration:'),
      chalk.cyan(`${trace.duration}ms`)
    );
    console.log(chalk.white('   🔢 Tokens:'), chalk.cyan(trace.totalTokens));
    console.log(
      chalk.white('   📅 Time:'),
      chalk.cyan(new Date(trace.timestamp).toLocaleString())
    );

    if (trace.error) {
      console.log(chalk.white('   ❌ Error:'), chalk.red(trace.error.message));
    }
  });

  console.log(
    chalk.gray('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(chalk.yellow('💡 Commands:'));
  console.log(
    chalk.white(`  • Trace specific request: costkatana trace id <requestId>`)
  );
  console.log(chalk.white(`  • View recent traces: costkatana trace recent`));
}
