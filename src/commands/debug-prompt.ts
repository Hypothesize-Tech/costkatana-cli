import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function debugPromptCommand(program: Command) {
  const debugGroup = program
    .command('debug-prompt')
    .description('🧩 Deep inspect specific prompts and their processing');

  // Main debug-prompt command
  debugGroup
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export debug data to file')
    .option('-v, --verbose', 'Show detailed debug information')
    .action(async (options) => {
      try {
        await handleDebugPrompt(options);
      } catch (error) {
        logger.error('Debug prompt command failed:', error);
        process.exit(1);
      }
    });

  // Debug prompt by ID
  debugGroup
    .command('id <promptId>')
    .description('🧩 Debug a specific prompt by ID')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export debug data to file')
    .option('-v, --verbose', 'Show detailed debug information')
    .option('--include-variants', 'Include past variants of this prompt')
    .option('--include-optimizations', 'Include optimization suggestions')
    .option('--include-gallm', 'Include GALLM routing decisions')
    .action(async (promptId, options) => {
      try {
        await handleDebugPromptById(promptId, options);
      } catch (error) {
        logger.error('Debug prompt by ID failed:', error);
        process.exit(1);
      }
    });

  // Debug prompt by content
  debugGroup
    .command('content')
    .description('🧩 Debug a prompt by its content')
    .option('-p, --prompt <prompt>', 'The prompt content to debug')
    .option('-f, --file <path>', 'File containing the prompt to debug')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export debug data to file')
    .option('-v, --verbose', 'Show detailed debug information')
    .option('--include-variants', 'Include past variants of this prompt')
    .option('--include-optimizations', 'Include optimization suggestions')
    .option('--include-gallm', 'Include GALLM routing decisions')
    .action(async (options) => {
      try {
        await handleDebugPromptByContent(options);
      } catch (error) {
        logger.error('Debug prompt by content failed:', error);
        process.exit(1);
      }
    });

  // Debug recent prompts
  debugGroup
    .command('recent')
    .description('📋 Show recent prompt debug information')
    .option('-n, --number <count>', 'Number of recent prompts to show', '10')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export debug data to file')
    .option('-v, --verbose', 'Show detailed debug information')
    .action(async (options) => {
      try {
        await handleDebugPromptRecent(options);
      } catch (error) {
        logger.error('Debug prompt recent failed:', error);
        process.exit(1);
      }
    });

  // Debug prompts by model
  debugGroup
    .command('model <modelName>')
    .description('🤖 Debug prompts for a specific model')
    .option('-d, --days <days>', 'Number of days to look back', '7')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export debug data to file')
    .option('-v, --verbose', 'Show detailed debug information')
    .action(async (modelName, options) => {
      try {
        await handleDebugPromptByModel(modelName, options);
      } catch (error) {
        logger.error('Debug prompt by model failed:', error);
        process.exit(1);
      }
    });
}

async function handleDebugPrompt(_options: any) {
  console.log(chalk.cyan.bold('\n🧩 Prompt Debugging & Deep Inspection'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  console.log(chalk.yellow('Available commands:'));
  console.log(
    chalk.white(
      '  costkatana debug-prompt id <promptId>        Debug a specific prompt by ID'
    )
  );
  console.log(
    chalk.white(
      '  costkatana debug-prompt content              Debug a prompt by content'
    )
  );
  console.log(
    chalk.white(
      '  costkatana debug-prompt recent               Show recent prompt debug info'
    )
  );
  console.log(
    chalk.white(
      '  costkatana debug-prompt model <name>         Debug prompts for a specific model'
    )
  );

  console.log(chalk.gray('\nExamples:'));
  console.log(chalk.white('  costkatana debug-prompt id prompt-38271'));
  console.log(
    chalk.white(
      '  costkatana debug-prompt content --prompt "Explain quantum computing"'
    )
  );
  console.log(chalk.white('  costkatana debug-prompt recent --number 5'));
  console.log(chalk.white('  costkatana debug-prompt model gpt-4 --verbose'));

  console.log(chalk.gray('\nDebug Information:'));
  console.log(chalk.white('  • Model used, token count, latency, cost'));
  console.log(chalk.white('  • Prompt + response analysis'));
  console.log(chalk.white('  • Caching status (HIT/MISS)'));
  console.log(
    chalk.white('  • GALLM verdict (routing, blocking, caching decisions)')
  );
  console.log(chalk.white('  • Optimization suggestions'));
  console.log(chalk.white('  • Past variants of this prompt'));
  console.log(chalk.white('  • Performance metrics and trends'));

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleDebugPromptById(promptId: string, options: any) {
  logger.info(`🧩 Debugging prompt: ${promptId}`);

  try {
    const debugData = await getPromptDebugById(promptId, options);
    displayPromptDebugResult(debugData, options);
  } catch (error) {
    logger.error('Failed to debug prompt:', error);
    process.exit(1);
  }
}

async function getPromptDebugById(promptId: string, options: any) {
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
    if (options.includeVariants) params.append('includeVariants', 'true');
    if (options.includeOptimizations)
      params.append('includeOptimizations', 'true');
    if (options.includeGallm) params.append('includeGallm', 'true');

    const response = await axios.get(
      `${baseUrl}/api/debug/prompt/${promptId}?${params}`,
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

function displayPromptDebugResult(debug: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(debug, null, 2));
    return;
  } else if (format === 'csv') {
    console.log(
      'Prompt ID,Model,Tokens,Cost,Latency,Cache Status,GALLM Verdict'
    );
    console.log(
      `"${debug.promptId}","${debug.model}","${debug.totalTokens}","${debug.cost}","${debug.latency}","${debug.cacheStatus}","${debug.gallmVerdict}"`
    );
    return;
  }

  console.log(chalk.cyan.bold('\n🧩 Prompt Debug Analysis'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Basic Information
  console.log(chalk.yellow.bold('\n📋 Basic Information'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('🆔 Prompt ID:'), chalk.cyan(debug.promptId));
  console.log(
    chalk.white('📅 Timestamp:'),
    chalk.cyan(new Date(debug.timestamp).toLocaleString())
  );
  console.log(
    chalk.white('📊 Status:'),
    debug.status === 'success'
      ? chalk.green(debug.status)
      : chalk.red(debug.status)
  );

  // Model and Performance
  console.log(chalk.yellow.bold('\n🤖 Model & Performance'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('🧠 Model:'), chalk.cyan(debug.model));
  console.log(chalk.white('🏢 Provider:'), chalk.cyan(debug.provider));
  console.log(
    chalk.white('🔢 Tokens:'),
    chalk.cyan(
      `${debug.inputTokens} input + ${debug.outputTokens} output = ${debug.totalTokens} total`
    )
  );
  console.log(
    chalk.white('💰 Cost:'),
    chalk.green(`$${debug.cost.toFixed(4)}`)
  );
  console.log(chalk.white('⏱️  Latency:'), chalk.cyan(`${debug.latency}ms`));
  console.log(
    chalk.white('📈 Tokens per Second:'),
    chalk.cyan(debug.tokensPerSecond?.toFixed(2) || 'N/A')
  );

  // Prompt and Response
  console.log(chalk.yellow.bold('\n💬 Prompt & Response'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('📝 Prompt:'));
  console.log(chalk.gray(debug.prompt));
  console.log(chalk.white('\n🤖 Response:'));
  console.log(chalk.gray(debug.response));

  // Caching Status
  console.log(chalk.yellow.bold('\n💾 Caching Analysis'));
  console.log(chalk.gray('─'.repeat(50)));
  const cacheStatus =
    debug.cacheStatus === 'HIT' ? chalk.green('HIT') : chalk.red('MISS');
  console.log(chalk.white('Cache Status:'), cacheStatus);
  if (debug.cacheAge) {
    console.log(chalk.white('Cache Age:'), chalk.cyan(debug.cacheAge));
  }
  if (debug.cacheKey) {
    console.log(chalk.white('Cache Key:'), chalk.cyan(debug.cacheKey));
  }
  if (debug.cacheReason) {
    console.log(chalk.white('Cache Reason:'), chalk.cyan(debug.cacheReason));
  }

  // GALLM Verdict
  if (debug.gallmVerdict) {
    console.log(chalk.yellow.bold('\n🎯 GALLM Verdict'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Routing Decision:'),
      chalk.cyan(debug.gallmVerdict.routingDecision)
    );
    console.log(
      chalk.white('Blocking Status:'),
      debug.gallmVerdict.blocked ? chalk.red('BLOCKED') : chalk.green('ALLOWED')
    );
    if (debug.gallmVerdict.blockReason) {
      console.log(
        chalk.white('Block Reason:'),
        chalk.red(debug.gallmVerdict.blockReason)
      );
    }
    console.log(
      chalk.white('Caching Decision:'),
      chalk.cyan(debug.gallmVerdict.cachingDecision)
    );
    console.log(
      chalk.white('Load Balancing:'),
      chalk.cyan(debug.gallmVerdict.loadBalancing || 'N/A')
    );
    console.log(
      chalk.white('Cost Optimization:'),
      chalk.cyan(debug.gallmVerdict.costOptimization || 'N/A')
    );
    if (debug.gallmVerdict.fallbackUsed) {
      console.log(chalk.white('Fallback Used:'), chalk.yellow('Yes'));
    }
  }

  // Optimization Suggestions
  if (
    debug.optimizationSuggestions &&
    debug.optimizationSuggestions.length > 0
  ) {
    console.log(chalk.yellow.bold('\n🔧 Optimization Suggestions'));
    console.log(chalk.gray('─'.repeat(50)));
    debug.optimizationSuggestions.forEach((suggestion: any, index: number) => {
      console.log(chalk.white(`${index + 1}. ${suggestion.type}:`));
      console.log(chalk.gray(`   ${suggestion.description}`));
      if (suggestion.estimatedSavings) {
        console.log(
          chalk.gray(`   Estimated Savings: ${suggestion.estimatedSavings}`)
        );
      }
      if (suggestion.implementation) {
        console.log(
          chalk.gray(`   Implementation: ${suggestion.implementation}`)
        );
      }
    });
  }

  // Past Variants
  if (
    options.includeVariants &&
    debug.pastVariants &&
    debug.pastVariants.length > 0
  ) {
    console.log(chalk.yellow.bold('\n📚 Past Variants'));
    console.log(chalk.gray('─'.repeat(50)));
    debug.pastVariants.forEach((variant: any, index: number) => {
      console.log(chalk.white(`${index + 1}. Variant ${index + 1}:`));
      console.log(
        chalk.gray(
          `   Timestamp: ${new Date(variant.timestamp).toLocaleString()}`
        )
      );
      console.log(chalk.gray(`   Tokens: ${variant.totalTokens}`));
      console.log(chalk.gray(`   Cost: $${variant.cost.toFixed(4)}`));
      console.log(
        chalk.gray(`   Performance: ${variant.performance || 'N/A'}`)
      );
      console.log(
        chalk.gray(
          `   Prompt: ${variant.prompt.substring(0, 100)}${variant.prompt.length > 100 ? '...' : ''}`
        )
      );
    });
  }

  // Performance Metrics
  console.log(chalk.yellow.bold('\n📈 Performance Metrics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Response Time:'), chalk.cyan(`${debug.latency}ms`));
  console.log(
    chalk.white('Cost per Token:'),
    chalk.cyan(`$${debug.costPerToken?.toFixed(6) || '0.000000'}`)
  );
  console.log(
    chalk.white('Cost per Second:'),
    chalk.cyan(`$${debug.costPerSecond?.toFixed(6) || '0.000000'}`)
  );
  console.log(
    chalk.white('Throughput:'),
    chalk.cyan(`${debug.throughput?.toFixed(2) || 'N/A'} tokens/second`)
  );
  if (debug.qualityScore) {
    console.log(chalk.white('Quality Score:'), chalk.cyan(debug.qualityScore));
  }

  // Error Information
  if (debug.error) {
    console.log(chalk.yellow.bold('\n❌ Error Information'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('Error Type:'), chalk.red(debug.error.type));
    console.log(chalk.white('Error Message:'), chalk.red(debug.error.message));
    console.log(
      chalk.white('Error Code:'),
      chalk.red(debug.error.code || 'N/A')
    );
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleDebugPromptByContent(options: any) {
  logger.info('🧩 Debugging prompt by content...');

  try {
    let promptContent = '';

    if (options.prompt) {
      promptContent = options.prompt;
    } else if (options.file) {
      // Read from file
      const fs = require('fs');
      promptContent = fs.readFileSync(options.file, 'utf8');
    } else {
      console.log(chalk.red.bold('\n❌ No prompt content provided'));
      console.log(
        chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      );
      console.log(chalk.yellow('Please provide either:'));
      console.log(chalk.white('  • --prompt "your prompt content"'));
      console.log(chalk.white('  • --file path/to/prompt.txt'));
      console.log(
        chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      );
      return;
    }

    const debugData = await getPromptDebugByContent(promptContent, options);
    displayPromptDebugResult(debugData, options);
  } catch (error) {
    logger.error('Failed to debug prompt by content:', error);
    process.exit(1);
  }
}

async function getPromptDebugByContent(promptContent: string, options: any) {
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
    if (options.includeVariants) params.append('includeVariants', 'true');
    if (options.includeOptimizations)
      params.append('includeOptimizations', 'true');
    if (options.includeGallm) params.append('includeGallm', 'true');

    const response = await axios.post(
      `${baseUrl}/api/debug/prompt/content?${params}`,
      {
        prompt: promptContent,
      },
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

async function handleDebugPromptRecent(options: any) {
  logger.info('📋 Fetching recent prompt debug information...');

  try {
    const count = parseInt(options.number) || 10;
    const prompts = await getRecentPromptDebug(count);
    displayRecentPromptDebug(prompts, options);
  } catch (error) {
    logger.error('Failed to fetch recent prompt debug:', error);
    process.exit(1);
  }
}

async function getRecentPromptDebug(count: number) {
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
      `${baseUrl}/api/debug/prompt/recent?count=${count}`,
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

function displayRecentPromptDebug(prompts: any[], options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(prompts, null, 2));
    return;
  } else if (format === 'csv') {
    console.log(
      'Prompt ID,Model,Tokens,Cost,Latency,Cache Status,GALLM Verdict,Timestamp'
    );
    prompts.forEach((prompt) => {
      console.log(
        `"${prompt.promptId}","${prompt.model}","${prompt.totalTokens}","${prompt.cost}","${prompt.latency}","${prompt.cacheStatus}","${prompt.gallmVerdict}","${prompt.timestamp}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold('\n📋 Recent Prompt Debug Information'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  if (prompts.length === 0) {
    console.log(chalk.yellow('No recent prompts found.'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    return;
  }

  prompts.forEach((prompt, index) => {
    const _statusColor = prompt.status === 'success' ? chalk.green : chalk.red;
    const statusIcon = prompt.status === 'success' ? '✅' : '❌';
    const cacheIcon = prompt.cacheStatus === 'HIT' ? '💾' : '❌';

    console.log(
      chalk.white(`\n${index + 1}. ${statusIcon} ${prompt.promptId}`)
    );
    console.log(chalk.gray('   ─'.repeat(40)));

    console.log(chalk.white('   🧠 Model:'), chalk.cyan(prompt.model));
    console.log(chalk.white('   🔢 Tokens:'), chalk.cyan(prompt.totalTokens));
    console.log(
      chalk.white('   💰 Cost:'),
      chalk.green(`$${prompt.cost.toFixed(4)}`)
    );
    console.log(
      chalk.white('   ⏱️  Latency:'),
      chalk.cyan(`${prompt.latency}ms`)
    );
    console.log(
      chalk.white('   💾 Cache:'),
      cacheIcon,
      chalk.cyan(prompt.cacheStatus)
    );
    console.log(
      chalk.white('   🎯 GALLM:'),
      chalk.cyan(prompt.gallmVerdict || 'N/A')
    );
    console.log(
      chalk.white('   📅 Time:'),
      chalk.cyan(new Date(prompt.timestamp).toLocaleString())
    );

    if (options.verbose && prompt.prompt) {
      console.log(chalk.white('   📝 Prompt:'));
      console.log(
        chalk.gray(
          `   ${prompt.prompt.substring(0, 150)}${prompt.prompt.length > 150 ? '...' : ''}`
        )
      );
    }
  });

  console.log(
    chalk.gray('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(chalk.yellow('💡 Commands:'));
  console.log(
    chalk.white(
      '  • Debug specific prompt: costkatana debug-prompt id <promptId>'
    )
  );
  console.log(
    chalk.white(
      '  • Debug by content: costkatana debug-prompt content --prompt "..."'
    )
  );
  console.log(
    chalk.white('  • Debug by model: costkatana debug-prompt model <name>')
  );
}

async function handleDebugPromptByModel(modelName: string, options: any) {
  logger.info(`🤖 Debugging prompts for model: ${modelName}`);

  try {
    const days = parseInt(options.days) || 7;
    const prompts = await getPromptDebugByModel(modelName, days);
    displayModelPromptDebug(prompts, modelName, options);
  } catch (error) {
    logger.error('Failed to debug model prompts:', error);
    process.exit(1);
  }
}

async function getPromptDebugByModel(modelName: string, days: number) {
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
      `${baseUrl}/api/debug/prompt/model/${modelName}?days=${days}`,
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

function displayModelPromptDebug(
  prompts: any[],
  modelName: string,
  options: any
) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(prompts, null, 2));
    return;
  } else if (format === 'csv') {
    console.log(
      'Prompt ID,Model,Tokens,Cost,Latency,Cache Status,GALLM Verdict,Timestamp'
    );
    prompts.forEach((prompt) => {
      console.log(
        `"${prompt.promptId}","${prompt.model}","${prompt.totalTokens}","${prompt.cost}","${prompt.latency}","${prompt.cacheStatus}","${prompt.gallmVerdict}","${prompt.timestamp}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold(`\n🤖 Model Prompt Debug: ${modelName}`));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  if (prompts.length === 0) {
    console.log(
      chalk.yellow(
        `No prompts found for model "${modelName}" in the last ${options.days} days.`
      )
    );
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    return;
  }

  // Summary statistics
  const totalCost = prompts.reduce((sum, prompt) => sum + prompt.cost, 0);
  const totalTokens = prompts.reduce(
    (sum, prompt) => sum + prompt.totalTokens,
    0
  );
  const avgLatency =
    prompts.reduce((sum, prompt) => sum + prompt.latency, 0) / prompts.length;
  const cacheHitRate =
    (prompts.filter((prompt) => prompt.cacheStatus === 'HIT').length /
      prompts.length) *
    100;

  console.log(chalk.yellow.bold('\n📊 Summary Statistics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Total Prompts:'), chalk.cyan(prompts.length));
  console.log(
    chalk.white('Total Cost:'),
    chalk.green(`$${totalCost.toFixed(4)}`)
  );
  console.log(
    chalk.white('Total Tokens:'),
    chalk.cyan(totalTokens.toLocaleString())
  );
  console.log(
    chalk.white('Average Latency:'),
    chalk.cyan(`${avgLatency.toFixed(0)}ms`)
  );
  console.log(
    chalk.white('Cache Hit Rate:'),
    chalk.cyan(`${cacheHitRate.toFixed(1)}%`)
  );

  // Detailed prompts
  console.log(chalk.yellow.bold('\n📋 Prompt Details'));
  console.log(chalk.gray('─'.repeat(50)));

  prompts.forEach((prompt, index) => {
    const _statusColor = prompt.status === 'success' ? chalk.green : chalk.red;
    const statusIcon = prompt.status === 'success' ? '✅' : '❌';
    const cacheIcon = prompt.cacheStatus === 'HIT' ? '💾' : '❌';

    console.log(
      chalk.white(`\n${index + 1}. ${statusIcon} ${prompt.promptId}`)
    );
    console.log(chalk.gray('   ─'.repeat(40)));

    console.log(chalk.white('   🔢 Tokens:'), chalk.cyan(prompt.totalTokens));
    console.log(
      chalk.white('   💰 Cost:'),
      chalk.green(`$${prompt.cost.toFixed(4)}`)
    );
    console.log(
      chalk.white('   ⏱️  Latency:'),
      chalk.cyan(`${prompt.latency}ms`)
    );
    console.log(
      chalk.white('   💾 Cache:'),
      cacheIcon,
      chalk.cyan(prompt.cacheStatus)
    );
    console.log(
      chalk.white('   🎯 GALLM:'),
      chalk.cyan(prompt.gallmVerdict || 'N/A')
    );
    console.log(
      chalk.white('   📅 Time:'),
      chalk.cyan(new Date(prompt.timestamp).toLocaleString())
    );

    if (options.verbose && prompt.prompt) {
      console.log(chalk.white('   📝 Prompt:'));
      console.log(
        chalk.gray(
          `   ${prompt.prompt.substring(0, 150)}${prompt.prompt.length > 150 ? '...' : ''}`
        )
      );
    }
  });

  console.log(
    chalk.gray('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(chalk.yellow('💡 Commands:'));
  console.log(
    chalk.white(
      `  • Debug specific prompt: costkatana debug-prompt id <promptId>`
    )
  );
  console.log(
    chalk.white(
      `  • Debug by content: costkatana debug-prompt content --prompt "..."`
    )
  );
  console.log(
    chalk.white(`  • View recent prompts: costkatana debug-prompt recent`)
  );
}
