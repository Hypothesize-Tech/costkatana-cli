import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';
import * as readline from 'readline';

export function replaySessionCommand(program: Command) {
  const replayGroup = program
    .command('replay-session')
    .description('🔄 Replay full conversations and step through agent logic');

  // Main replay-session command
  replayGroup
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export replay data to file')
    .option('-v, --verbose', 'Show detailed replay information')
    .action(async (options) => {
      try {
        await handleReplaySession(options);
      } catch (error) {
        logger.error('Replay session command failed:', error);
        process.exit(1);
      }
    });

  // Replay session by ID
  replayGroup
    .command('id <sessionId>')
    .description('🔄 Replay a specific session by ID')
    .option('--mode <mode>', 'Playback mode (cli, webview, step)', 'cli')
    .option('--speed <speed>', 'Playback speed (slow, normal, fast)', 'normal')
    .option('--include-cache', 'Show cache usage vs live calls')
    .option('--include-feedback', 'Show feedback tags per message')
    .option('--include-gallm', 'Show GALLM intervention points')
    .option('--auto-play', 'Auto-play without user interaction')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export replay data to file')
    .option('-v, --verbose', 'Show detailed replay information')
    .action(async (sessionId, options) => {
      try {
        await handleReplaySessionById(sessionId, options);
      } catch (error) {
        logger.error('Replay session by ID failed:', error);
        process.exit(1);
      }
    });

  // Replay session by workflow
  replayGroup
    .command('workflow <workflowId>')
    .description('🔄 Replay sessions for a specific workflow')
    .option('--mode <mode>', 'Playback mode (cli, webview, step)', 'cli')
    .option('--speed <speed>', 'Playback speed (slow, normal, fast)', 'normal')
    .option('--include-cache', 'Show cache usage vs live calls')
    .option('--include-feedback', 'Show feedback tags per message')
    .option('--include-gallm', 'Show GALLM intervention points')
    .option('--auto-play', 'Auto-play without user interaction')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export replay data to file')
    .option('-v, --verbose', 'Show detailed replay information')
    .action(async (workflowId, options) => {
      try {
        await handleReplaySessionByWorkflow(workflowId, options);
      } catch (error) {
        logger.error('Replay session by workflow failed:', error);
        process.exit(1);
      }
    });

  // Replay recent sessions
  replayGroup
    .command('recent')
    .description('📋 Show recent sessions for replay')
    .option('-n, --number <count>', 'Number of recent sessions to show', '10')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export session list to file')
    .option('-v, --verbose', 'Show detailed session information')
    .action(async (options) => {
      try {
        await handleReplaySessionRecent(options);
      } catch (error) {
        logger.error('Replay session recent failed:', error);
        process.exit(1);
      }
    });
}

async function handleReplaySession(_options: any) {
  console.log(chalk.cyan.bold('\n🔄 Session Replay & Conversation Analysis'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  console.log(chalk.yellow('Available commands:'));
  console.log(
    chalk.white(
      '  costkatana replay-session id <sessionId>         Replay specific session'
    )
  );
  console.log(
    chalk.white(
      '  costkatana replay-session workflow <workflowId>  Replay workflow sessions'
    )
  );
  console.log(
    chalk.white(
      '  costkatana replay-session recent                 Show recent sessions'
    )
  );

  console.log(chalk.gray('\nExamples:'));
  console.log(chalk.white('  costkatana replay-session id session-1234'));
  console.log(
    chalk.white('  costkatana replay-session id session-1234 --mode step')
  );
  console.log(
    chalk.white('  costkatana replay-session workflow workflow-98765')
  );
  console.log(chalk.white('  costkatana replay-session recent --number 5'));

  console.log(chalk.gray('\nReplay Features:'));
  console.log(chalk.white('  • CLI or webview playback modes'));
  console.log(chalk.white('  • Cache usage vs live call analysis'));
  console.log(chalk.white('  • Feedback tags per message'));
  console.log(chalk.white('  • GALLM intervention points'));
  console.log(chalk.white('  • Step-through agent logic'));
  console.log(chalk.white('  • Conversation flow visualization'));

  console.log(chalk.gray('\nPlayback Modes:'));
  console.log(chalk.white('  • cli - Command line interface playback'));
  console.log(chalk.white('  • webview - Web-based visual playback'));
  console.log(chalk.white('  • step - Interactive step-through mode'));

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleReplaySessionById(sessionId: string, options: any) {
  logger.info(`🔄 Replaying session: ${sessionId}`);

  try {
    const sessionData = await getSessionById(sessionId, options);

    if (options.mode === 'webview') {
      await replaySessionWebview(sessionData, options);
    } else if (options.mode === 'step') {
      await replaySessionStep(sessionData, options);
    } else {
      await replaySessionCLI(sessionData, options);
    }
  } catch (error) {
    logger.error('Failed to replay session:', error);
    process.exit(1);
  }
}

async function getSessionById(sessionId: string, options: any) {
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
    if (options.includeCache) params.append('includeCache', 'true');
    if (options.includeFeedback) params.append('includeFeedback', 'true');
    if (options.includeGallm) params.append('includeGallm', 'true');

    const response = await axios.get(
      `${baseUrl}/api/session/replay/${sessionId}?${params}`,
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

async function replaySessionCLI(session: any, options: any) {
  console.log(chalk.cyan.bold(`\n🔄 Session Replay: ${session.sessionId}`));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Session Information
  console.log(chalk.yellow.bold('\n📋 Session Information'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('🆔 Session ID:'), chalk.cyan(session.sessionId));
  console.log(
    chalk.white('📅 Created:'),
    chalk.cyan(new Date(session.createdAt).toLocaleString())
  );
  console.log(
    chalk.white('⏱️  Duration:'),
    chalk.cyan(`${session.duration}ms`)
  );
  console.log(
    chalk.white('🤖 Agents:'),
    chalk.cyan(session.agents?.join(', ') || 'N/A')
  );
  console.log(
    chalk.white('📊 Status:'),
    session.status === 'completed'
      ? chalk.green(session.status)
      : chalk.yellow(session.status)
  );

  // Conversation Flow
  console.log(chalk.yellow.bold('\n💬 Conversation Flow'));
  console.log(chalk.gray('─'.repeat(50)));

  if (!session.messages || session.messages.length === 0) {
    console.log(chalk.yellow('No messages found in this session.'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    return;
  }

  const speed = options.speed || 'normal';
  const delay = speed === 'fast' ? 500 : speed === 'slow' ? 2000 : 1000;

  for (let i = 0; i < session.messages.length; i++) {
    const message = session.messages[i];

    console.log(
      chalk.white(`\n${i + 1}. ${message.role} (${message.timestamp})`)
    );
    console.log(chalk.gray('   ─'.repeat(40)));

    // Agent information
    if (message.agent) {
      console.log(chalk.white('   🤖 Agent:'), chalk.cyan(message.agent));
    }

    // Model information
    if (message.model) {
      console.log(chalk.white('   🧠 Model:'), chalk.cyan(message.model));
    }

    // Cache information
    if (options.includeCache && message.cacheInfo) {
      const cacheStatus = message.cacheInfo.hit
        ? chalk.green('HIT')
        : chalk.red('MISS');
      console.log(chalk.white('   💾 Cache:'), cacheStatus);
      if (message.cacheInfo.hit) {
        console.log(chalk.gray(`   Cache Key: ${message.cacheInfo.key}`));
      }
    }

    // GALLM intervention
    if (options.includeGallm && message.gallmIntervention) {
      console.log(
        chalk.white('   🎯 GALLM:'),
        chalk.yellow(message.gallmIntervention.type)
      );
      console.log(chalk.gray(`   Reason: ${message.gallmIntervention.reason}`));
    }

    // Message content
    console.log(chalk.white('   📝 Content:'));
    const content =
      message.content.length > 200
        ? message.content.substring(0, 200) + '...'
        : message.content;
    console.log(chalk.gray(`   ${content}`));

    // Feedback
    if (options.includeFeedback && message.feedback) {
      const feedbackColor =
        message.feedback === 'positive'
          ? chalk.green
          : message.feedback === 'negative'
            ? chalk.red
            : chalk.yellow;
      console.log(
        chalk.white('   🏷️  Feedback:'),
        feedbackColor(message.feedback)
      );
    }

    // Performance metrics
    if (message.metrics) {
      console.log(
        chalk.white('   ⏱️  Latency:'),
        chalk.cyan(`${message.metrics.latency}ms`)
      );
      console.log(
        chalk.white('   🔢 Tokens:'),
        chalk.cyan(message.metrics.tokens)
      );
      console.log(
        chalk.white('   💰 Cost:'),
        chalk.green(`$${message.metrics.cost.toFixed(4)}`)
      );
    }

    // Auto-play delay
    if (!options.autoPlay && i < session.messages.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Session Summary
  console.log(chalk.yellow.bold('\n📊 Session Summary'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('Total Messages:'),
    chalk.cyan(session.messages.length)
  );
  console.log(
    chalk.white('Total Cost:'),
    chalk.green(`$${session.totalCost.toFixed(4)}`)
  );
  console.log(
    chalk.white('Total Tokens:'),
    chalk.cyan(session.totalTokens.toLocaleString())
  );
  console.log(
    chalk.white('Average Latency:'),
    chalk.cyan(`${session.averageLatency}ms`)
  );

  if (options.includeCache && session.cacheStats) {
    console.log(
      chalk.white('Cache Hit Rate:'),
      chalk.cyan(`${(session.cacheStats.hitRate * 100).toFixed(1)}%`)
    );
    console.log(
      chalk.white('Cache Savings:'),
      chalk.green(`$${session.cacheStats.savings.toFixed(4)}`)
    );
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function replaySessionStep(session: any, options: any) {
  console.log(
    chalk.cyan.bold(`\n🔄 Interactive Session Replay: ${session.sessionId}`)
  );
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  if (!session.messages || session.messages.length === 0) {
    console.log(chalk.yellow('No messages found in this session.'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let currentStep = 0;
  const totalSteps = session.messages.length;

  console.log(
    chalk.yellow(
      `\n📋 Session has ${totalSteps} messages. Use the following commands:`
    )
  );
  console.log(chalk.white('  n/next - Next message'));
  console.log(chalk.white('  p/prev - Previous message'));
  console.log(chalk.white('  j/jump <number> - Jump to specific message'));
  console.log(chalk.white('  s/summary - Show session summary'));
  console.log(chalk.white('  q/quit - Exit replay'));
  console.log(chalk.white('  h/help - Show this help'));

  while (currentStep < totalSteps) {
    const message = session.messages[currentStep];

    console.log(
      chalk.cyan.bold(
        `\n[${currentStep + 1}/${totalSteps}] ${message.role} (${message.timestamp})`
      )
    );
    console.log(chalk.gray('─'.repeat(50)));

    // Agent information
    if (message.agent) {
      console.log(chalk.white('🤖 Agent:'), chalk.cyan(message.agent));
    }

    // Model information
    if (message.model) {
      console.log(chalk.white('🧠 Model:'), chalk.cyan(message.model));
    }

    // Cache information
    if (options.includeCache && message.cacheInfo) {
      const cacheStatus = message.cacheInfo.hit
        ? chalk.green('HIT')
        : chalk.red('MISS');
      console.log(chalk.white('💾 Cache:'), cacheStatus);
      if (message.cacheInfo.hit) {
        console.log(chalk.gray(`Cache Key: ${message.cacheInfo.key}`));
      }
    }

    // GALLM intervention
    if (options.includeGallm && message.gallmIntervention) {
      console.log(
        chalk.white('🎯 GALLM:'),
        chalk.yellow(message.gallmIntervention.type)
      );
      console.log(chalk.gray(`Reason: ${message.gallmIntervention.reason}`));
    }

    // Message content
    console.log(chalk.white('📝 Content:'));
    console.log(chalk.gray(message.content));

    // Feedback
    if (options.includeFeedback && message.feedback) {
      const feedbackColor =
        message.feedback === 'positive'
          ? chalk.green
          : message.feedback === 'negative'
            ? chalk.red
            : chalk.yellow;
      console.log(
        chalk.white('🏷️  Feedback:'),
        feedbackColor(message.feedback)
      );
    }

    // Performance metrics
    if (message.metrics) {
      console.log(
        chalk.white('⏱️  Latency:'),
        chalk.cyan(`${message.metrics.latency}ms`)
      );
      console.log(
        chalk.white('🔢 Tokens:'),
        chalk.cyan(message.metrics.tokens)
      );
      console.log(
        chalk.white('💰 Cost:'),
        chalk.green(`$${message.metrics.cost.toFixed(4)}`)
      );
    }

    // User input
    const answer = await new Promise<string>((resolve) => {
      rl.question(chalk.yellow('\nCommand (n/p/j/s/q/h): '), resolve);
    });

    const command = answer.toLowerCase().trim();

    if (command === 'n' || command === 'next') {
      currentStep++;
    } else if (command === 'p' || command === 'prev') {
      currentStep = Math.max(0, currentStep - 1);
    } else if (command.startsWith('j') || command.startsWith('jump')) {
      const parts = command.split(' ');
      const jumpTo = parseInt(parts[1]) - 1;
      if (jumpTo >= 0 && jumpTo < totalSteps) {
        currentStep = jumpTo;
      } else {
        console.log(chalk.red('Invalid message number.'));
      }
    } else if (command === 's' || command === 'summary') {
      displaySessionSummary(session, options);
    } else if (command === 'q' || command === 'quit') {
      break;
    } else if (command === 'h' || command === 'help') {
      console.log(chalk.yellow('\nCommands:'));
      console.log(chalk.white('  n/next - Next message'));
      console.log(chalk.white('  p/prev - Previous message'));
      console.log(chalk.white('  j/jump <number> - Jump to specific message'));
      console.log(chalk.white('  s/summary - Show session summary'));
      console.log(chalk.white('  q/quit - Exit replay'));
      console.log(chalk.white('  h/help - Show this help'));
    } else {
      console.log(chalk.red('Invalid command. Type "h" for help.'));
    }
  }

  rl.close();
  console.log(
    chalk.gray('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function replaySessionWebview(session: any, options: any) {
  console.log(
    chalk.cyan.bold(`\n🔄 Webview Session Replay: ${session.sessionId}`)
  );
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // For webview mode, we would typically open a browser window
  // For now, we'll display a message and fall back to CLI mode
  console.log(chalk.yellow('🌐 Webview mode is not yet implemented.'));
  console.log(chalk.white('Falling back to CLI mode...'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  await replaySessionCLI(session, options);
}

function displaySessionSummary(session: any, options: any) {
  console.log(chalk.yellow.bold('\n📊 Session Summary'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Session ID:'), chalk.cyan(session.sessionId));
  console.log(
    chalk.white('Created:'),
    chalk.cyan(new Date(session.createdAt).toLocaleString())
  );
  console.log(chalk.white('Duration:'), chalk.cyan(`${session.duration}ms`));
  console.log(
    chalk.white('Total Messages:'),
    chalk.cyan(session.messages.length)
  );
  console.log(
    chalk.white('Total Cost:'),
    chalk.green(`$${session.totalCost.toFixed(4)}`)
  );
  console.log(
    chalk.white('Total Tokens:'),
    chalk.cyan(session.totalTokens.toLocaleString())
  );
  console.log(
    chalk.white('Average Latency:'),
    chalk.cyan(`${session.averageLatency}ms`)
  );

  if (options.includeCache && session.cacheStats) {
    console.log(
      chalk.white('Cache Hit Rate:'),
      chalk.cyan(`${(session.cacheStats.hitRate * 100).toFixed(1)}%`)
    );
    console.log(
      chalk.white('Cache Savings:'),
      chalk.green(`$${session.cacheStats.savings.toFixed(4)}`)
    );
  }

  if (options.includeGallm && session.gallmInterventions) {
    console.log(
      chalk.white('GALLM Interventions:'),
      chalk.cyan(session.gallmInterventions.length)
    );
  }

  console.log(chalk.gray('─'.repeat(50)));
}

async function handleReplaySessionByWorkflow(workflowId: string, options: any) {
  logger.info(`🔄 Replaying sessions for workflow: ${workflowId}`);

  try {
    const sessions = await getSessionsByWorkflow(workflowId, options);

    if (sessions.length === 0) {
      console.log(chalk.yellow('No sessions found for this workflow.'));
      return;
    }

    console.log(chalk.cyan.bold(`\n🔄 Workflow Sessions: ${workflowId}`));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );

    sessions.forEach((session: any, index: number) => {
      console.log(chalk.white(`${index + 1}. ${session.sessionId}`));
      console.log(chalk.gray('   ─'.repeat(40)));
      console.log(
        chalk.white('   📅 Created:'),
        chalk.cyan(new Date(session.createdAt).toLocaleString())
      );
      console.log(
        chalk.white('   ⏱️  Duration:'),
        chalk.cyan(`${session.duration}ms`)
      );
      console.log(
        chalk.white('   💰 Cost:'),
        chalk.green(`$${session.totalCost.toFixed(4)}`)
      );
      console.log(
        chalk.white('   📊 Status:'),
        session.status === 'completed'
          ? chalk.green(session.status)
          : chalk.yellow(session.status)
      );
    });

    console.log(chalk.gray('\nTo replay a specific session:'));
    console.log(chalk.white('  costkatana replay-session id <sessionId>'));
  } catch (error) {
    logger.error('Failed to replay workflow sessions:', error);
    process.exit(1);
  }
}

async function getSessionsByWorkflow(workflowId: string, _options: any) {
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
    params.append('workflowId', workflowId);

    const response = await axios.get(
      `${baseUrl}/api/session/replay/workflow?${params}`,
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

async function handleReplaySessionRecent(options: any) {
  logger.info('📋 Fetching recent sessions...');

  try {
    const count = parseInt(options.number) || 10;
    const sessions = await getRecentSessions(count);
    displayRecentSessions(sessions, options);
  } catch (error) {
    logger.error('Failed to fetch recent sessions:', error);
    process.exit(1);
  }
}

async function getRecentSessions(count: number) {
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
      `${baseUrl}/api/session/replay/recent?count=${count}`,
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

function displayRecentSessions(sessions: any[], options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(sessions, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Session ID,Workflow ID,Created,Duration,Cost,Status,Messages');
    sessions.forEach((session) => {
      console.log(
        `"${session.sessionId}","${session.workflowId || 'N/A'}","${session.createdAt}","${session.duration}","${session.totalCost}","${session.status}","${session.messageCount}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold('\n📋 Recent Sessions'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  if (sessions.length === 0) {
    console.log(chalk.yellow('No recent sessions found.'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    return;
  }

  sessions.forEach((session, index) => {
    console.log(chalk.white(`\n${index + 1}. ${session.sessionId}`));
    console.log(chalk.gray('   ─'.repeat(40)));

    console.log(
      chalk.white('   📅 Created:'),
      chalk.cyan(new Date(session.createdAt).toLocaleString())
    );
    console.log(
      chalk.white('   ⏱️  Duration:'),
      chalk.cyan(`${session.duration}ms`)
    );
    console.log(
      chalk.white('   💰 Cost:'),
      chalk.green(`$${session.totalCost.toFixed(4)}`)
    );
    console.log(
      chalk.white('   📊 Status:'),
      session.status === 'completed'
        ? chalk.green(session.status)
        : chalk.yellow(session.status)
    );
    console.log(
      chalk.white('   💬 Messages:'),
      chalk.cyan(session.messageCount)
    );

    if (session.workflowId) {
      console.log(
        chalk.white('   🔄 Workflow:'),
        chalk.cyan(session.workflowId)
      );
    }
  });

  console.log(
    chalk.gray('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(chalk.yellow('💡 Commands:'));
  console.log(
    chalk.white('  • Replay session: costkatana replay-session id <sessionId>')
  );
  console.log(
    chalk.white(
      '  • Step mode: costkatana replay-session id <sessionId> --mode step'
    )
  );
  console.log(
    chalk.white(
      '  • With cache info: costkatana replay-session id <sessionId> --include-cache'
    )
  );
  console.log(
    chalk.white(
      '  • With feedback: costkatana replay-session id <sessionId> --include-feedback'
    )
  );
  console.log(
    chalk.white(
      '  • With GALLM: costkatana replay-session id <sessionId> --include-gallm'
    )
  );
}
