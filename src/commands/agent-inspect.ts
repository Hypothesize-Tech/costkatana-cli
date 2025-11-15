import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function agentInspectCommand(program: Command) {
  const inspectGroup = program
    .command('agent-inspect')
    .description('🔍 Audit specific agents in workflows');

  // Main agent-inspect command
  inspectGroup
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export inspection data to file')
    .option('-v, --verbose', 'Show detailed inspection information')
    .action(async (options) => {
      try {
        await handleAgentInspect(options);
      } catch (error) {
        logger.error('Agent inspect command failed:', error);
        process.exit(1);
      }
    });

  // Inspect agent by ID
  inspectGroup
    .command('id <agentId>')
    .description('🔍 Audit a specific agent by ID')
    .option('-d, --days <days>', 'Number of days to look back', '7')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export inspection data to file')
    .option('-v, --verbose', 'Show detailed inspection information')
    .option('--include-prompts', 'Include detailed prompt analysis')
    .option('--include-failures', 'Include detailed failure analysis')
    .option('--include-model-switching', 'Include model switching behavior')
    .action(async (agentId, options) => {
      try {
        await handleAgentInspectById(agentId, options);
      } catch (error) {
        logger.error('Agent inspect by ID failed:', error);
        process.exit(1);
      }
    });

  // Inspect agent by name
  inspectGroup
    .command('name <agentName>')
    .description('🔍 Audit agents by name')
    .option('-d, --days <days>', 'Number of days to look back', '7')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export inspection data to file')
    .option('-v, --verbose', 'Show detailed inspection information')
    .option('--include-prompts', 'Include detailed prompt analysis')
    .option('--include-failures', 'Include detailed failure analysis')
    .option('--include-model-switching', 'Include model switching behavior')
    .action(async (agentName, options) => {
      try {
        await handleAgentInspectByName(agentName, options);
      } catch (error) {
        logger.error('Agent inspect by name failed:', error);
        process.exit(1);
      }
    });

  // Inspect agent by workflow
  inspectGroup
    .command('workflow <workflowId>')
    .description('🔍 Audit all agents in a specific workflow')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export inspection data to file')
    .option('-v, --verbose', 'Show detailed inspection information')
    .option('--include-prompts', 'Include detailed prompt analysis')
    .option('--include-failures', 'Include detailed failure analysis')
    .option('--include-model-switching', 'Include model switching behavior')
    .action(async (workflowId, options) => {
      try {
        await handleAgentInspectByWorkflow(workflowId, options);
      } catch (error) {
        logger.error('Agent inspect by workflow failed:', error);
        process.exit(1);
      }
    });

  // Inspect recent agents
  inspectGroup
    .command('recent')
    .description('📋 Show recent agent inspections')
    .option('-n, --number <count>', 'Number of recent agents to show', '10')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export inspection data to file')
    .option('-v, --verbose', 'Show detailed inspection information')
    .action(async (options) => {
      try {
        await handleAgentInspectRecent(options);
      } catch (error) {
        logger.error('Agent inspect recent failed:', error);
        process.exit(1);
      }
    });
}

async function handleAgentInspect(_options: any) {
  console.log(chalk.cyan.bold('\n🔍 Agent Inspection & Audit Analysis'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  console.log(chalk.yellow('Available commands:'));
  console.log(
    chalk.white(
      '  costkatana agent-inspect id <agentId>           Audit specific agent by ID'
    )
  );
  console.log(
    chalk.white(
      '  costkatana agent-inspect name <agentName>       Audit agents by name'
    )
  );
  console.log(
    chalk.white(
      '  costkatana agent-inspect workflow <workflowId>  Audit all agents in workflow'
    )
  );
  console.log(
    chalk.white(
      '  costkatana agent-inspect recent                 Show recent agent inspections'
    )
  );

  console.log(chalk.gray('\nExamples:'));
  console.log(chalk.white('  costkatana agent-inspect id agent-buyer-ranker'));
  console.log(
    chalk.white('  costkatana agent-inspect name buyer-ranker --days 30')
  );
  console.log(
    chalk.white('  costkatana agent-inspect workflow workflow-98765')
  );
  console.log(chalk.white('  costkatana agent-inspect recent --number 5'));

  console.log(chalk.gray('\nInspection Information:'));
  console.log(chalk.white('  • Prompts issued by agent (with timestamps)'));
  console.log(chalk.white('  • Response patterns and behavior analysis'));
  console.log(chalk.white('  • Usage and cost footprint'));
  console.log(chalk.white('  • Failure cases and retry log'));
  console.log(chalk.white('  • Model switching behavior (if used)'));
  console.log(chalk.white('  • Performance metrics and trends'));

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleAgentInspectById(agentId: string, options: any) {
  logger.info(`🔍 Inspecting agent: ${agentId}`);

  try {
    const days = parseInt(options.days) || 7;
    const inspectData = await getAgentInspectById(agentId, days, options);
    displayAgentInspectResult(inspectData, options);
  } catch (error) {
    logger.error('Failed to inspect agent:', error);
    process.exit(1);
  }
}

async function getAgentInspectById(
  agentId: string,
  days: number,
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
    params.append('days', days.toString());
    if (options.includePrompts) params.append('includePrompts', 'true');
    if (options.includeFailures) params.append('includeFailures', 'true');
    if (options.includeModelSwitching)
      params.append('includeModelSwitching', 'true');

    const response = await axios.get(
      `${baseUrl}/api/agent/inspect/${agentId}?${params}`,
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

function displayAgentInspectResult(inspect: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(inspect, null, 2));
    return;
  } else if (format === 'csv') {
    console.log(
      'Agent ID,Name,Role,Total Requests,Success Rate,Total Cost,Total Tokens,Average Latency'
    );
    console.log(
      `"${inspect.agentId}","${inspect.name}","${inspect.role}","${inspect.totalRequests}","${inspect.successRate}","${inspect.totalCost}","${inspect.totalTokens}","${inspect.averageLatency}"`
    );
    return;
  }

  console.log(chalk.cyan.bold('\n🔍 Agent Inspection Report'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Basic Agent Information
  console.log(chalk.yellow.bold('\n📋 Agent Information'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('🆔 Agent ID:'), chalk.cyan(inspect.agentId));
  console.log(chalk.white('📝 Name:'), chalk.cyan(inspect.name));
  console.log(chalk.white('🎭 Role:'), chalk.cyan(inspect.role));
  console.log(
    chalk.white('📅 Created:'),
    chalk.cyan(new Date(inspect.createdAt).toLocaleString())
  );
  console.log(
    chalk.white('📊 Status:'),
    inspect.status === 'active'
      ? chalk.green(inspect.status)
      : chalk.red(inspect.status)
  );

  // Usage Statistics
  console.log(chalk.yellow.bold('\n📊 Usage Statistics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('📈 Total Requests:'),
    chalk.cyan(inspect.totalRequests.toLocaleString())
  );
  console.log(
    chalk.white('✅ Successful Requests:'),
    chalk.green(inspect.successfulRequests.toLocaleString())
  );
  console.log(
    chalk.white('❌ Failed Requests:'),
    chalk.red(inspect.failedRequests.toLocaleString())
  );
  console.log(
    chalk.white('📊 Success Rate:'),
    chalk.cyan(`${(inspect.successRate * 100).toFixed(1)}%`)
  );
  console.log(
    chalk.white('⏱️  Average Latency:'),
    chalk.cyan(`${inspect.averageLatency}ms`)
  );

  // Cost and Performance
  console.log(chalk.yellow.bold('\n💰 Cost & Performance'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('💵 Total Cost:'),
    chalk.green(`$${inspect.totalCost.toFixed(4)}`)
  );
  console.log(
    chalk.white('🔢 Total Tokens:'),
    chalk.cyan(inspect.totalTokens.toLocaleString())
  );
  console.log(
    chalk.white('📊 Average Cost per Request:'),
    chalk.cyan(`$${(inspect.totalCost / inspect.totalRequests).toFixed(4)}`)
  );
  console.log(
    chalk.white('📈 Average Tokens per Request:'),
    chalk.cyan(Math.round(inspect.totalTokens / inspect.totalRequests))
  );
  console.log(
    chalk.white('⚡ Throughput:'),
    chalk.cyan(`${inspect.throughput?.toFixed(2) || 'N/A'} requests/min`)
  );

  // Model Usage
  if (inspect.modelUsage && Object.keys(inspect.modelUsage).length > 0) {
    console.log(chalk.yellow.bold('\n🤖 Model Usage'));
    console.log(chalk.gray('─'.repeat(50)));
    Object.entries(inspect.modelUsage).forEach(
      ([model, usage]: [string, any]) => {
        console.log(chalk.white(`• ${model}:`));
        console.log(chalk.gray(`  Requests: ${usage.requests}`));
        console.log(chalk.gray(`  Cost: $${usage.cost.toFixed(4)}`));
        console.log(chalk.gray(`  Tokens: ${usage.tokens.toLocaleString()}`));
        console.log(
          chalk.gray(`  Success Rate: ${(usage.successRate * 100).toFixed(1)}%`)
        );
      }
    );
  }

  // Model Switching Behavior
  if (options.includeModelSwitching && inspect.modelSwitching) {
    console.log(chalk.yellow.bold('\n🔄 Model Switching Behavior'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Total Switches:'),
      chalk.cyan(inspect.modelSwitching.totalSwitches)
    );
    console.log(
      chalk.white('Switch Frequency:'),
      chalk.cyan(`${inspect.modelSwitching.switchFrequency} switches/day`)
    );
    console.log(
      chalk.white('Primary Model:'),
      chalk.cyan(inspect.modelSwitching.primaryModel)
    );
    console.log(
      chalk.white('Fallback Models:'),
      chalk.cyan(inspect.modelSwitching.fallbackModels?.join(', ') || 'None')
    );

    if (inspect.modelSwitching.switchReasons) {
      console.log(chalk.white('Switch Reasons:'));
      Object.entries(inspect.modelSwitching.switchReasons).forEach(
        ([reason, count]: [string, any]) => {
          console.log(chalk.gray(`  • ${reason}: ${count} times`));
        }
      );
    }
  }

  // Response Patterns
  if (inspect.responsePatterns) {
    console.log(chalk.yellow.bold('\n📝 Response Patterns'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Average Response Length:'),
      chalk.cyan(`${inspect.responsePatterns.averageLength} characters`)
    );
    console.log(
      chalk.white('Response Length Range:'),
      chalk.cyan(
        `${inspect.responsePatterns.minLength} - ${inspect.responsePatterns.maxLength} characters`
      )
    );
    console.log(
      chalk.white('Common Response Types:'),
      chalk.cyan(inspect.responsePatterns.commonTypes?.join(', ') || 'N/A')
    );
    console.log(
      chalk.white('Response Quality Score:'),
      chalk.cyan(inspect.responsePatterns.qualityScore?.toFixed(2) || 'N/A')
    );
  }

  // Failure Analysis
  if (
    options.includeFailures &&
    inspect.failures &&
    inspect.failures.length > 0
  ) {
    console.log(chalk.yellow.bold('\n❌ Failure Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Total Failures:'),
      chalk.red(inspect.failures.length)
    );
    console.log(
      chalk.white('Failure Rate:'),
      chalk.red(
        `${((inspect.failures.length / inspect.totalRequests) * 100).toFixed(1)}%`
      )
    );

    const failureTypes = inspect.failures.reduce((acc: any, failure: any) => {
      acc[failure.type] = (acc[failure.type] || 0) + 1;
      return acc;
    }, {});

    console.log(chalk.white('Failure Types:'));
    Object.entries(failureTypes).forEach(([type, count]: [string, any]) => {
      console.log(chalk.gray(`  • ${type}: ${count} occurrences`));
    });

    if (options.verbose) {
      console.log(chalk.white('\nRecent Failures:'));
      inspect.failures.slice(0, 5).forEach((failure: any, index: number) => {
        console.log(
          chalk.gray(`${index + 1}. ${failure.timestamp}: ${failure.error}`)
        );
      });
    }
  }

  // Prompt Analysis
  if (options.includePrompts && inspect.prompts && inspect.prompts.length > 0) {
    console.log(chalk.yellow.bold('\n💬 Prompt Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Total Prompts:'),
      chalk.cyan(inspect.prompts.length)
    );
    console.log(
      chalk.white('Average Prompt Length:'),
      chalk.cyan(`${inspect.prompts.averageLength} characters`)
    );
    console.log(
      chalk.white('Prompt Complexity:'),
      chalk.cyan(inspect.prompts.complexity || 'N/A')
    );

    if (inspect.prompts.commonPatterns) {
      console.log(chalk.white('Common Patterns:'));
      inspect.prompts.commonPatterns.forEach((pattern: any, index: number) => {
        console.log(
          chalk.gray(
            `  ${index + 1}. ${pattern.description} (${pattern.frequency} times)`
          )
        );
      });
    }

    if (options.verbose) {
      console.log(chalk.white('\nRecent Prompts:'));
      inspect.prompts.slice(0, 3).forEach((prompt: any, index: number) => {
        console.log(
          chalk.gray(
            `${index + 1}. ${new Date(prompt.timestamp).toLocaleString()}:`
          )
        );
        console.log(
          chalk.gray(
            `   ${prompt.content.substring(0, 100)}${prompt.content.length > 100 ? '...' : ''}`
          )
        );
      });
    }
  }

  // Performance Trends
  if (inspect.performanceTrends) {
    console.log(chalk.yellow.bold('\n📈 Performance Trends'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Cost Trend:'),
      chalk.cyan(inspect.performanceTrends.costTrend)
    );
    console.log(
      chalk.white('Latency Trend:'),
      chalk.cyan(inspect.performanceTrends.latencyTrend)
    );
    console.log(
      chalk.white('Success Rate Trend:'),
      chalk.cyan(inspect.performanceTrends.successRateTrend)
    );
    console.log(
      chalk.white('Usage Trend:'),
      chalk.cyan(inspect.performanceTrends.usageTrend)
    );
  }

  // Recommendations
  if (inspect.recommendations && inspect.recommendations.length > 0) {
    console.log(chalk.yellow.bold('\n💡 Recommendations'));
    console.log(chalk.gray('─'.repeat(50)));
    inspect.recommendations.forEach((rec: any, index: number) => {
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

async function handleAgentInspectByName(agentName: string, options: any) {
  logger.info(`🔍 Inspecting agents by name: ${agentName}`);

  try {
    const days = parseInt(options.days) || 7;
    const inspectData = await getAgentInspectByName(agentName, days, options);
    displayAgentInspectResult(inspectData, options);
  } catch (error) {
    logger.error('Failed to inspect agents by name:', error);
    process.exit(1);
  }
}

async function getAgentInspectByName(
  agentName: string,
  days: number,
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
    params.append('name', agentName);
    params.append('days', days.toString());
    if (options.includePrompts) params.append('includePrompts', 'true');
    if (options.includeFailures) params.append('includeFailures', 'true');
    if (options.includeModelSwitching)
      params.append('includeModelSwitching', 'true');

    const response = await axios.get(
      `${baseUrl}/api/agent/inspect/name?${params}`,
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

async function handleAgentInspectByWorkflow(workflowId: string, options: any) {
  logger.info(`🔍 Inspecting agents in workflow: ${workflowId}`);

  try {
    const inspectData = await getAgentInspectByWorkflow(workflowId, options);
    displayWorkflowAgentInspectResult(inspectData, workflowId, options);
  } catch (error) {
    logger.error('Failed to inspect workflow agents:', error);
    process.exit(1);
  }
}

async function getAgentInspectByWorkflow(workflowId: string, options: any) {
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
    if (options.includePrompts) params.append('includePrompts', 'true');
    if (options.includeFailures) params.append('includeFailures', 'true');
    if (options.includeModelSwitching)
      params.append('includeModelSwitching', 'true');

    const response = await axios.get(
      `${baseUrl}/api/agent/inspect/workflow/${workflowId}?${params}`,
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

function displayWorkflowAgentInspectResult(
  inspect: any,
  workflowId: string,
  options: any
) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(inspect, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Agent ID,Name,Role,Requests,Success Rate,Cost,Tokens,Latency');
    inspect.agents.forEach((agent: any) => {
      console.log(
        `"${agent.agentId}","${agent.name}","${agent.role}","${agent.totalRequests}","${agent.successRate}","${agent.totalCost}","${agent.totalTokens}","${agent.averageLatency}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold(`\n🔍 Workflow Agent Inspection: ${workflowId}`));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  if (!inspect.agents || inspect.agents.length === 0) {
    console.log(chalk.yellow('No agents found in this workflow.'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    return;
  }

  // Summary Statistics
  console.log(chalk.yellow.bold('\n📊 Summary Statistics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Total Agents:'), chalk.cyan(inspect.agents.length));
  console.log(
    chalk.white('Total Requests:'),
    chalk.cyan(inspect.totalRequests.toLocaleString())
  );
  console.log(
    chalk.white('Total Cost:'),
    chalk.green(`$${inspect.totalCost.toFixed(4)}`)
  );
  console.log(
    chalk.white('Average Success Rate:'),
    chalk.cyan(`${(inspect.averageSuccessRate * 100).toFixed(1)}%`)
  );

  // Agent Details
  console.log(chalk.yellow.bold('\n🤖 Agent Details'));
  console.log(chalk.gray('─'.repeat(50)));

  inspect.agents.forEach((agent: any, index: number) => {
    const successColor =
      agent.successRate > 0.8
        ? chalk.green
        : agent.successRate > 0.6
          ? chalk.yellow
          : chalk.red;

    console.log(
      chalk.white(`\n${index + 1}. ${agent.name} (${agent.agentId})`)
    );
    console.log(chalk.gray('   ─'.repeat(40)));

    console.log(chalk.white('   🎭 Role:'), chalk.cyan(agent.role));
    console.log(
      chalk.white('   📈 Requests:'),
      chalk.cyan(agent.totalRequests)
    );
    console.log(
      chalk.white('   📊 Success Rate:'),
      successColor(`${(agent.successRate * 100).toFixed(1)}%`)
    );
    console.log(
      chalk.white('   💰 Cost:'),
      chalk.green(`$${agent.totalCost.toFixed(4)}`)
    );
    console.log(
      chalk.white('   🔢 Tokens:'),
      chalk.cyan(agent.totalTokens.toLocaleString())
    );
    console.log(
      chalk.white('   ⏱️  Avg Latency:'),
      chalk.cyan(`${agent.averageLatency}ms`)
    );

    if (agent.primaryModel) {
      console.log(
        chalk.white('   🤖 Primary Model:'),
        chalk.cyan(agent.primaryModel)
      );
    }
  });

  // Agent Interaction Analysis
  if (inspect.interactions) {
    console.log(chalk.yellow.bold('\n🔄 Agent Interactions'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Sequential Calls:'),
      chalk.cyan(inspect.interactions.sequentialCalls)
    );
    console.log(
      chalk.white('Parallel Calls:'),
      chalk.cyan(inspect.interactions.parallelCalls)
    );
    console.log(
      chalk.white('Dependencies:'),
      chalk.cyan(inspect.interactions.dependencies?.length || 0)
    );

    if (inspect.interactions.bottlenecks) {
      console.log(chalk.white('Bottlenecks:'));
      inspect.interactions.bottlenecks.forEach(
        (bottleneck: any, index: number) => {
          console.log(
            chalk.gray(
              `  ${index + 1}. ${bottleneck.agent}: ${bottleneck.reason}`
            )
          );
        }
      );
    }
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleAgentInspectRecent(options: any) {
  logger.info('📋 Fetching recent agent inspections...');

  try {
    const count = parseInt(options.number) || 10;
    const agents = await getRecentAgentInspect(count);
    displayRecentAgentInspect(agents, options);
  } catch (error) {
    logger.error('Failed to fetch recent agent inspections:', error);
    process.exit(1);
  }
}

async function getRecentAgentInspect(count: number) {
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
      `${baseUrl}/api/agent/inspect/recent?count=${count}`,
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

function displayRecentAgentInspect(agents: any[], options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(agents, null, 2));
    return;
  } else if (format === 'csv') {
    console.log(
      'Agent ID,Name,Role,Requests,Success Rate,Cost,Tokens,Last Active'
    );
    agents.forEach((agent) => {
      console.log(
        `"${agent.agentId}","${agent.name}","${agent.role}","${agent.totalRequests}","${agent.successRate}","${agent.totalCost}","${agent.totalTokens}","${agent.lastActive}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold('\n📋 Recent Agent Inspections'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  if (agents.length === 0) {
    console.log(chalk.yellow('No recent agents found.'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    return;
  }

  agents.forEach((agent, index) => {
    const successColor =
      agent.successRate > 0.8
        ? chalk.green
        : agent.successRate > 0.6
          ? chalk.yellow
          : chalk.red;

    console.log(
      chalk.white(`\n${index + 1}. ${agent.name} (${agent.agentId})`)
    );
    console.log(chalk.gray('   ─'.repeat(40)));

    console.log(chalk.white('   🎭 Role:'), chalk.cyan(agent.role));
    console.log(
      chalk.white('   📈 Requests:'),
      chalk.cyan(agent.totalRequests)
    );
    console.log(
      chalk.white('   📊 Success Rate:'),
      successColor(`${(agent.successRate * 100).toFixed(1)}%`)
    );
    console.log(
      chalk.white('   💰 Cost:'),
      chalk.green(`$${agent.totalCost.toFixed(4)}`)
    );
    console.log(
      chalk.white('   🔢 Tokens:'),
      chalk.cyan(agent.totalTokens.toLocaleString())
    );
    console.log(
      chalk.white('   ⏱️  Avg Latency:'),
      chalk.cyan(`${agent.averageLatency}ms`)
    );
    console.log(
      chalk.white('   📅 Last Active:'),
      chalk.cyan(new Date(agent.lastActive).toLocaleString())
    );
  });

  console.log(
    chalk.gray('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(chalk.yellow('💡 Commands:'));
  console.log(
    chalk.white(
      '  • Inspect specific agent: costkatana agent-inspect id <agentId>'
    )
  );
  console.log(
    chalk.white(
      '  • Inspect by name: costkatana agent-inspect name <agentName>'
    )
  );
  console.log(
    chalk.white(
      '  • Inspect workflow agents: costkatana agent-inspect workflow <workflowId>'
    )
  );
}
