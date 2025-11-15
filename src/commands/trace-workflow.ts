import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function traceWorkflowCommand(program: Command) {
  const workflowGroup = program
    .command('trace-workflow')
    .description('🔁 Trace workflow lifecycles and multi-agent tasks');

  // Main trace-workflow command
  workflowGroup
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export workflow data to file')
    .option('-v, --verbose', 'Show detailed workflow information')
    .action(async (options) => {
      try {
        await handleTraceWorkflow(options);
      } catch (error) {
        logger.error('Trace workflow command failed:', error);
        process.exit(1);
      }
    });

  // Trace workflow by ID
  workflowGroup
    .command('id <workflowId>')
    .description('🔁 Trace a specific workflow by ID')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export workflow data to file')
    .option('-v, --verbose', 'Show detailed workflow information')
    .option('--include-session', 'Include session/conversation tree')
    .option('--include-cache', 'Include cache usage details')
    .option('--include-fallbacks', 'Include fallback usage details')
    .action(async (workflowId, options) => {
      try {
        await handleTraceWorkflowById(workflowId, options);
      } catch (error) {
        logger.error('Trace workflow by ID failed:', error);
        process.exit(1);
      }
    });

  // Trace recent workflows
  workflowGroup
    .command('recent')
    .description('📋 Show recent workflow traces')
    .option('-n, --number <count>', 'Number of recent workflows to show', '10')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export workflow data to file')
    .option('-v, --verbose', 'Show detailed workflow information')
    .action(async (options) => {
      try {
        await handleTraceWorkflowRecent(options);
      } catch (error) {
        logger.error('Trace workflow recent failed:', error);
        process.exit(1);
      }
    });

  // Trace workflows by project
  workflowGroup
    .command('project <projectName>')
    .description('📁 Trace workflows for a specific project')
    .option('-d, --days <days>', 'Number of days to look back', '7')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export workflow data to file')
    .option('-v, --verbose', 'Show detailed workflow information')
    .action(async (projectName, options) => {
      try {
        await handleTraceWorkflowByProject(projectName, options);
      } catch (error) {
        logger.error('Trace workflow by project failed:', error);
        process.exit(1);
      }
    });

  // Trace workflows by agent
  workflowGroup
    .command('agent <agentName>')
    .description('🤖 Trace workflows involving a specific agent')
    .option('-d, --days <days>', 'Number of days to look back', '7')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export workflow data to file')
    .option('-v, --verbose', 'Show detailed workflow information')
    .action(async (agentName, options) => {
      try {
        await handleTraceWorkflowByAgent(agentName, options);
      } catch (error) {
        logger.error('Trace workflow by agent failed:', error);
        process.exit(1);
      }
    });
}

async function handleTraceWorkflow(_options: any) {
  console.log(chalk.cyan.bold('\n🔁 Workflow Tracing & Lifecycle Analysis'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  console.log(chalk.yellow('Available commands:'));
  console.log(
    chalk.white(
      '  costkatana trace-workflow id <workflowId>     Trace a specific workflow'
    )
  );
  console.log(
    chalk.white(
      '  costkatana trace-workflow recent             Show recent workflow traces'
    )
  );
  console.log(
    chalk.white(
      '  costkatana trace-workflow project <name>     Trace workflows for a project'
    )
  );
  console.log(
    chalk.white(
      '  costkatana trace-workflow agent <name>       Trace workflows by agent'
    )
  );

  console.log(chalk.gray('\nExamples:'));
  console.log(chalk.white('  costkatana trace-workflow id workflow-98765'));
  console.log(chalk.white('  costkatana trace-workflow recent --number 5'));
  console.log(
    chalk.white('  costkatana trace-workflow project my-project --days 30')
  );
  console.log(
    chalk.white('  costkatana trace-workflow agent assistant --verbose')
  );

  console.log(chalk.gray('\nWorkflow Information:'));
  console.log(chalk.white('  • Sequential call log (step-by-step)'));
  console.log(chalk.white('  • Agents involved in the workflow'));
  console.log(chalk.white('  • Prompt and response per step'));
  console.log(chalk.white('  • Token and cost per step'));
  console.log(chalk.white('  • Retry/fallback/cache usage per step'));
  console.log(chalk.white('  • Session or conversation tree'));
  console.log(chalk.white('  • Workflow completion status'));

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleTraceWorkflowById(workflowId: string, options: any) {
  logger.info(`🔁 Tracing workflow: ${workflowId}`);

  try {
    const workflowData = await getWorkflowById(workflowId, options);
    displayWorkflowResult(workflowData, options);
  } catch (error) {
    logger.error('Failed to trace workflow:', error);
    process.exit(1);
  }
}

async function getWorkflowById(workflowId: string, options: any) {
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
    if (options.includeSession) params.append('includeSession', 'true');
    if (options.includeCache) params.append('includeCache', 'true');
    if (options.includeFallbacks) params.append('includeFallbacks', 'true');

    const response = await axios.get(
      `${baseUrl}/api/workflow/trace/${workflowId}?${params}`,
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

function displayWorkflowResult(workflow: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(workflow, null, 2));
    return;
  } else if (format === 'csv') {
    console.log(
      'Workflow ID,Status,Total Steps,Total Cost,Total Tokens,Duration,Agents'
    );
    console.log(
      `"${workflow.workflowId}","${workflow.status}","${workflow.steps?.length || 0}","${workflow.totalCost}","${workflow.totalTokens}","${workflow.duration}","${workflow.agents?.join(',')}"`
    );
    return;
  }

  console.log(chalk.cyan.bold('\n🔁 Workflow Trace'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Basic Workflow Information
  console.log(chalk.yellow.bold('\n📋 Workflow Information'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('🆔 Workflow ID:'), chalk.cyan(workflow.workflowId));
  console.log(
    chalk.white('📅 Started:'),
    chalk.cyan(new Date(workflow.startedAt).toLocaleString())
  );
  console.log(
    chalk.white('⏱️  Duration:'),
    chalk.cyan(`${workflow.duration}ms`)
  );
  console.log(
    chalk.white('📊 Status:'),
    workflow.status === 'completed'
      ? chalk.green(workflow.status)
      : chalk.red(workflow.status)
  );
  console.log(
    chalk.white('🎯 Type:'),
    chalk.cyan(workflow.workflowType || 'Multi-agent Task')
  );

  // Agents Involved
  if (workflow.agents && workflow.agents.length > 0) {
    console.log(chalk.yellow.bold('\n🤖 Agents Involved'));
    console.log(chalk.gray('─'.repeat(50)));
    workflow.agents.forEach((agent: any, index: number) => {
      console.log(chalk.white(`${index + 1}. ${agent.name}`));
      console.log(chalk.gray(`   Role: ${agent.role}`));
      console.log(chalk.gray(`   Model: ${agent.model}`));
      console.log(chalk.gray(`   Provider: ${agent.provider}`));
      if (agent.description) {
        console.log(chalk.gray(`   Description: ${agent.description}`));
      }
    });
  }

  // Sequential Call Log
  if (workflow.steps && workflow.steps.length > 0) {
    console.log(chalk.yellow.bold('\n📝 Sequential Call Log'));
    console.log(chalk.gray('─'.repeat(50)));

    workflow.steps.forEach((step: any, index: number) => {
      const stepNumber = index + 1;
      const statusColor = step.status === 'success' ? chalk.green : chalk.red;
      const statusIcon = step.status === 'success' ? '✅' : '❌';

      console.log(
        chalk.white(
          `\n${stepNumber}. ${statusIcon} Step ${stepNumber}: ${step.name}`
        )
      );
      console.log(chalk.gray('   ─'.repeat(40)));

      console.log(chalk.white('   🤖 Agent:'), chalk.cyan(step.agent));
      console.log(chalk.white('   📊 Status:'), statusColor(step.status));
      console.log(
        chalk.white('   ⏱️  Duration:'),
        chalk.cyan(`${step.duration}ms`)
      );
      console.log(
        chalk.white('   💰 Cost:'),
        chalk.green(`$${step.cost.toFixed(4)}`)
      );
      console.log(
        chalk.white('   🔢 Tokens:'),
        chalk.cyan(
          `${step.inputTokens} input + ${step.outputTokens} output = ${step.totalTokens} total`
        )
      );

      if (step.model) {
        console.log(chalk.white('   🧠 Model:'), chalk.cyan(step.model));
      }
      if (step.provider) {
        console.log(chalk.white('   🏢 Provider:'), chalk.cyan(step.provider));
      }

      // Prompt and Response (if verbose)
      if (options.verbose && step.prompt) {
        console.log(chalk.white('   📝 Prompt:'));
        console.log(
          chalk.gray(
            `   ${step.prompt.substring(0, 200)}${step.prompt.length > 200 ? '...' : ''}`
          )
        );
      }
      if (options.verbose && step.response) {
        console.log(chalk.white('   🤖 Response:'));
        console.log(
          chalk.gray(
            `   ${step.response.substring(0, 200)}${step.response.length > 200 ? '...' : ''}`
          )
        );
      }

      // Retry/Fallback/Cache Information
      if (step.retryCount > 0) {
        console.log(
          chalk.white('   🔄 Retries:'),
          chalk.yellow(step.retryCount)
        );
      }
      if (step.fallbackUsed) {
        console.log(chalk.white('   🔄 Fallback:'), chalk.yellow('Used'));
      }
      if (step.cacheHit) {
        console.log(chalk.white('   💾 Cache:'), chalk.green('HIT'));
      } else if (step.cacheMiss) {
        console.log(chalk.white('   💾 Cache:'), chalk.red('MISS'));
      }

      if (step.error) {
        console.log(chalk.white('   ❌ Error:'), chalk.red(step.error));
      }
    });
  }

  // Cost and Token Summary
  console.log(chalk.yellow.bold('\n💰 Cost & Token Summary'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('Total Cost:'),
    chalk.green(`$${workflow.totalCost.toFixed(4)}`)
  );
  console.log(
    chalk.white('Total Tokens:'),
    chalk.cyan(workflow.totalTokens.toLocaleString())
  );
  console.log(
    chalk.white('Average Cost per Step:'),
    chalk.cyan(
      `$${(workflow.totalCost / (workflow.steps?.length || 1)).toFixed(4)}`
    )
  );
  console.log(
    chalk.white('Average Tokens per Step:'),
    chalk.cyan(
      Math.round(
        workflow.totalTokens / (workflow.steps?.length || 1)
      ).toLocaleString()
    )
  );

  // Session/Conversation Tree
  if (options.includeSession && workflow.sessionTree) {
    console.log(chalk.yellow.bold('\n🌳 Session/Conversation Tree'));
    console.log(chalk.gray('─'.repeat(50)));
    displaySessionTree(workflow.sessionTree);
  }

  // Performance Metrics
  console.log(chalk.yellow.bold('\n📈 Performance Metrics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('Total Steps:'),
    chalk.cyan(workflow.steps?.length || 0)
  );
  console.log(
    chalk.white('Successful Steps:'),
    chalk.green(
      workflow.steps?.filter((s: any) => s.status === 'success').length || 0
    )
  );
  console.log(
    chalk.white('Failed Steps:'),
    chalk.red(
      workflow.steps?.filter((s: any) => s.status !== 'success').length || 0
    )
  );
  console.log(
    chalk.white('Average Step Duration:'),
    chalk.cyan(
      `${Math.round(workflow.duration / (workflow.steps?.length || 1))}ms`
    )
  );
  console.log(
    chalk.white('Throughput:'),
    chalk.cyan(
      `${((workflow.steps?.length || 0) / (workflow.duration / 1000)).toFixed(2)} steps/second`
    )
  );

  // Error Summary
  const failedSteps =
    workflow.steps?.filter((s: any) => s.status !== 'success') || [];
  if (failedSteps.length > 0) {
    console.log(chalk.yellow.bold('\n❌ Error Summary'));
    console.log(chalk.gray('─'.repeat(50)));
    failedSteps.forEach((step: any, index: number) => {
      console.log(
        chalk.white(`${index + 1}. Step ${step.stepNumber}: ${step.error}`)
      );
    });
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

function displaySessionTree(sessionTree: any, level: number = 0) {
  const indent = '  '.repeat(level);

  console.log(chalk.white(`${indent}• ${sessionTree.name}`));
  console.log(chalk.gray(`${indent}  Agent: ${sessionTree.agent}`));
  console.log(chalk.gray(`${indent}  Status: ${sessionTree.status}`));

  if (sessionTree.children && sessionTree.children.length > 0) {
    sessionTree.children.forEach((child: any) => {
      displaySessionTree(child, level + 1);
    });
  }
}

async function handleTraceWorkflowRecent(options: any) {
  logger.info('📋 Fetching recent workflow traces...');

  try {
    const count = parseInt(options.number) || 10;
    const workflows = await getRecentWorkflows(count);
    displayRecentWorkflows(workflows, options);
  } catch (error) {
    logger.error('Failed to fetch recent workflows:', error);
    process.exit(1);
  }
}

async function getRecentWorkflows(count: number) {
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
      `${baseUrl}/api/workflow/trace/recent?count=${count}`,
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

function displayRecentWorkflows(workflows: any[], options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(workflows, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Workflow ID,Status,Steps,Cost,Tokens,Duration,Agents,Started');
    workflows.forEach((workflow) => {
      console.log(
        `"${workflow.workflowId}","${workflow.status}","${workflow.steps?.length || 0}","${workflow.totalCost}","${workflow.totalTokens}","${workflow.duration}","${workflow.agents?.join(',')}","${workflow.startedAt}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold('\n📋 Recent Workflow Traces'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  if (workflows.length === 0) {
    console.log(chalk.yellow('No recent workflows found.'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    return;
  }

  workflows.forEach((workflow, index) => {
    const statusColor =
      workflow.status === 'completed' ? chalk.green : chalk.red;
    const statusIcon = workflow.status === 'completed' ? '✅' : '❌';

    console.log(
      chalk.white(`\n${index + 1}. ${statusIcon} ${workflow.workflowId}`)
    );
    console.log(chalk.gray('   ─'.repeat(40)));

    console.log(chalk.white('   📊 Status:'), statusColor(workflow.status));
    console.log(
      chalk.white('   📝 Steps:'),
      chalk.cyan(workflow.steps?.length || 0)
    );
    console.log(
      chalk.white('   💰 Cost:'),
      chalk.green(`$${workflow.totalCost.toFixed(4)}`)
    );
    console.log(
      chalk.white('   🔢 Tokens:'),
      chalk.cyan(workflow.totalTokens.toLocaleString())
    );
    console.log(
      chalk.white('   ⏱️  Duration:'),
      chalk.cyan(`${workflow.duration}ms`)
    );
    console.log(
      chalk.white('   🤖 Agents:'),
      chalk.cyan(workflow.agents?.join(', ') || 'N/A')
    );
    console.log(
      chalk.white('   📅 Started:'),
      chalk.cyan(new Date(workflow.startedAt).toLocaleString())
    );

    if (workflow.workflowType) {
      console.log(
        chalk.white('   🎯 Type:'),
        chalk.cyan(workflow.workflowType)
      );
    }
  });

  console.log(
    chalk.gray('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(chalk.yellow('💡 Commands:'));
  console.log(
    chalk.white(
      '  • Trace specific workflow: costkatana trace-workflow id <workflowId>'
    )
  );
  console.log(
    chalk.white(
      '  • Trace by project: costkatana trace-workflow project <name>'
    )
  );
  console.log(
    chalk.white('  • Trace by agent: costkatana trace-workflow agent <name>')
  );
}

async function handleTraceWorkflowByProject(projectName: string, options: any) {
  logger.info(`📁 Tracing workflows for project: ${projectName}`);

  try {
    const days = parseInt(options.days) || 7;
    const workflows = await getWorkflowsByProject(projectName, days);
    displayProjectWorkflows(workflows, projectName, options);
  } catch (error) {
    logger.error('Failed to trace project workflows:', error);
    process.exit(1);
  }
}

async function getWorkflowsByProject(projectName: string, days: number) {
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
      `${baseUrl}/api/workflow/trace/project/${projectName}?days=${days}`,
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

function displayProjectWorkflows(
  workflows: any[],
  projectName: string,
  options: any
) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(workflows, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Workflow ID,Status,Steps,Cost,Tokens,Duration,Agents,Started');
    workflows.forEach((workflow) => {
      console.log(
        `"${workflow.workflowId}","${workflow.status}","${workflow.steps?.length || 0}","${workflow.totalCost}","${workflow.totalTokens}","${workflow.duration}","${workflow.agents?.join(',')}","${workflow.startedAt}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold(`\n📁 Project Workflows: ${projectName}`));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  if (workflows.length === 0) {
    console.log(
      chalk.yellow(
        `No workflows found for project "${projectName}" in the last ${options.days} days.`
      )
    );
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    return;
  }

  // Summary statistics
  const totalCost = workflows.reduce(
    (sum, workflow) => sum + workflow.totalCost,
    0
  );
  const totalTokens = workflows.reduce(
    (sum, workflow) => sum + workflow.totalTokens,
    0
  );
  const completedCount = workflows.filter(
    (workflow) => workflow.status === 'completed'
  ).length;
  const failedCount = workflows.length - completedCount;

  console.log(chalk.yellow.bold('\n📊 Summary Statistics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Total Workflows:'), chalk.cyan(workflows.length));
  console.log(chalk.white('Completed:'), chalk.green(completedCount));
  console.log(chalk.white('Failed:'), chalk.red(failedCount));
  console.log(
    chalk.white('Total Cost:'),
    chalk.green(`$${totalCost.toFixed(4)}`)
  );
  console.log(
    chalk.white('Total Tokens:'),
    chalk.cyan(totalTokens.toLocaleString())
  );

  // Detailed workflows
  console.log(chalk.yellow.bold('\n📋 Workflow Details'));
  console.log(chalk.gray('─'.repeat(50)));

  workflows.forEach((workflow, index) => {
    const statusColor =
      workflow.status === 'completed' ? chalk.green : chalk.red;
    const statusIcon = workflow.status === 'completed' ? '✅' : '❌';

    console.log(
      chalk.white(`\n${index + 1}. ${statusIcon} ${workflow.workflowId}`)
    );
    console.log(chalk.gray('   ─'.repeat(40)));

    console.log(chalk.white('   📊 Status:'), statusColor(workflow.status));
    console.log(
      chalk.white('   📝 Steps:'),
      chalk.cyan(workflow.steps?.length || 0)
    );
    console.log(
      chalk.white('   💰 Cost:'),
      chalk.green(`$${workflow.totalCost.toFixed(4)}`)
    );
    console.log(
      chalk.white('   🔢 Tokens:'),
      chalk.cyan(workflow.totalTokens.toLocaleString())
    );
    console.log(
      chalk.white('   ⏱️  Duration:'),
      chalk.cyan(`${workflow.duration}ms`)
    );
    console.log(
      chalk.white('   🤖 Agents:'),
      chalk.cyan(workflow.agents?.join(', ') || 'N/A')
    );
    console.log(
      chalk.white('   📅 Started:'),
      chalk.cyan(new Date(workflow.startedAt).toLocaleString())
    );

    if (workflow.workflowType) {
      console.log(
        chalk.white('   🎯 Type:'),
        chalk.cyan(workflow.workflowType)
      );
    }
  });

  console.log(
    chalk.gray('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(chalk.yellow('💡 Commands:'));
  console.log(
    chalk.white(
      `  • Trace specific workflow: costkatana trace-workflow id <workflowId>`
    )
  );
  console.log(
    chalk.white(`  • View recent workflows: costkatana trace-workflow recent`)
  );
  console.log(
    chalk.white(`  • Trace by agent: costkatana trace-workflow agent <name>`)
  );
}

async function handleTraceWorkflowByAgent(agentName: string, options: any) {
  logger.info(`🤖 Tracing workflows for agent: ${agentName}`);

  try {
    const days = parseInt(options.days) || 7;
    const workflows = await getWorkflowsByAgent(agentName, days);
    displayAgentWorkflows(workflows, agentName, options);
  } catch (error) {
    logger.error('Failed to trace agent workflows:', error);
    process.exit(1);
  }
}

async function getWorkflowsByAgent(agentName: string, days: number) {
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
      `${baseUrl}/api/workflow/trace/agent/${agentName}?days=${days}`,
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

function displayAgentWorkflows(
  workflows: any[],
  agentName: string,
  options: any
) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(workflows, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Workflow ID,Status,Steps,Cost,Tokens,Duration,Agents,Started');
    workflows.forEach((workflow) => {
      console.log(
        `"${workflow.workflowId}","${workflow.status}","${workflow.steps?.length || 0}","${workflow.totalCost}","${workflow.totalTokens}","${workflow.duration}","${workflow.agents?.join(',')}","${workflow.startedAt}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold(`\n🤖 Agent Workflows: ${agentName}`));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  if (workflows.length === 0) {
    console.log(
      chalk.yellow(
        `No workflows found for agent "${agentName}" in the last ${options.days} days.`
      )
    );
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    return;
  }

  // Summary statistics
  const totalCost = workflows.reduce(
    (sum, workflow) => sum + workflow.totalCost,
    0
  );
  const totalTokens = workflows.reduce(
    (sum, workflow) => sum + workflow.totalTokens,
    0
  );
  const completedCount = workflows.filter(
    (workflow) => workflow.status === 'completed'
  ).length;
  const failedCount = workflows.length - completedCount;

  console.log(chalk.yellow.bold('\n📊 Summary Statistics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Total Workflows:'), chalk.cyan(workflows.length));
  console.log(chalk.white('Completed:'), chalk.green(completedCount));
  console.log(chalk.white('Failed:'), chalk.red(failedCount));
  console.log(
    chalk.white('Total Cost:'),
    chalk.green(`$${totalCost.toFixed(4)}`)
  );
  console.log(
    chalk.white('Total Tokens:'),
    chalk.cyan(totalTokens.toLocaleString())
  );

  // Detailed workflows
  console.log(chalk.yellow.bold('\n📋 Workflow Details'));
  console.log(chalk.gray('─'.repeat(50)));

  workflows.forEach((workflow, index) => {
    const statusColor =
      workflow.status === 'completed' ? chalk.green : chalk.red;
    const statusIcon = workflow.status === 'completed' ? '✅' : '❌';

    console.log(
      chalk.white(`\n${index + 1}. ${statusIcon} ${workflow.workflowId}`)
    );
    console.log(chalk.gray('   ─'.repeat(40)));

    console.log(chalk.white('   📊 Status:'), statusColor(workflow.status));
    console.log(
      chalk.white('   📝 Steps:'),
      chalk.cyan(workflow.steps?.length || 0)
    );
    console.log(
      chalk.white('   💰 Cost:'),
      chalk.green(`$${workflow.totalCost.toFixed(4)}`)
    );
    console.log(
      chalk.white('   🔢 Tokens:'),
      chalk.cyan(workflow.totalTokens.toLocaleString())
    );
    console.log(
      chalk.white('   ⏱️  Duration:'),
      chalk.cyan(`${workflow.duration}ms`)
    );
    console.log(
      chalk.white('   🤖 Agents:'),
      chalk.cyan(workflow.agents?.join(', ') || 'N/A')
    );
    console.log(
      chalk.white('   📅 Started:'),
      chalk.cyan(new Date(workflow.startedAt).toLocaleString())
    );

    if (workflow.workflowType) {
      console.log(
        chalk.white('   🎯 Type:'),
        chalk.cyan(workflow.workflowType)
      );
    }
  });

  console.log(
    chalk.gray('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(chalk.yellow('💡 Commands:'));
  console.log(
    chalk.white(
      `  • Trace specific workflow: costkatana trace-workflow id <workflowId>`
    )
  );
  console.log(
    chalk.white(`  • View recent workflows: costkatana trace-workflow recent`)
  );
  console.log(
    chalk.white(
      `  • Trace by project: costkatana trace-workflow project <name>`
    )
  );
}
