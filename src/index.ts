#!/usr/bin/env node

import { Command } from 'commander';
import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';
import { version } from '../package.json';
// Essential commands
import { initCommand } from './commands/init';
import { chatCommand } from './commands/chat';
import { analyzeCommand } from './commands/analyze';
import { configCommand } from './commands/config';
import { testCommand } from './commands/test';

// New simple commands
import { askCommand } from './commands/ask';
import { compareCommand } from './commands/compare';
import { modelsCommand } from './commands/models';

// Advanced commands (kept for power users)
import { analyticsCommand } from './commands/analytics';
import { optimizeCommand } from './commands/optimize';
import { budgetCommand } from './commands/budget';
import { trackCommand } from './commands/track';
import { projectCommand } from './commands/project';
import { keyCommand } from './commands/key';
import { craftWorkflowCommand } from './commands/craft-workflow';
import { simulateCostCommand } from './commands/simulate-cost';
import { bulkOptimizeCommand } from './commands/bulk-optimize';
import { rewritePromptCommand } from './commands/rewrite-prompt';
import { setBudgetCommand } from './commands/set-budget';

// Legacy commands (deprecated but kept for compatibility)
import { checkCacheCommand } from './commands/check-cache';
import { traceCommand } from './commands/trace';
import { traceWorkflowCommand } from './commands/trace-workflow';
import { debugPromptCommand } from './commands/debug-prompt';
import { diffPromptsCommand } from './commands/diff-prompts';
import { agentInspectCommand } from './commands/agent-inspect';
import { replaySessionCommand } from './commands/replay-session';
import { promptMetricsCommand } from './commands/prompt-metrics';
import { retryLogCommand } from './commands/retry-log';
import { auditFirewallCommand } from './commands/audit-firewall';
import { suggestModelsCommand } from './commands/suggest-models';
import { highCostPromptsCommand } from './commands/high-cost-prompts';
import { listModelsCommand } from './commands/list-models';

import { logger } from './utils/logger';

// Display banner
function displayBanner() {
  const banner = figlet.textSync('Cost Katana', {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  });

  const subtitle = gradient.pastel.multiline([
    'Cost Katana CLI',
    `Version ${version}`,
  ]);

  const box = boxen(banner + '\n\n' + subtitle, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan',
  });

  console.log(box);
}

// Main CLI setup
async function main() {
  const program = new Command();

  // Set up program metadata
  program
    .name('cost-katana')
    .description('CostKatana CLI - Track, analyze, and optimize AI API costs')
    .version(version, '-v, --version')
    .option('-d, --debug', 'Enable debug mode')
    .option('-c, --config <path>', 'Path to configuration file')
    .configureOutput({
      writeOut: (str) => process.stdout.write(str),
      writeErr: (str) => process.stderr.write(str),
    })
    .hook('preAction', (thisCommand) => {
      const options = thisCommand.opts();
      if (options.debug) {
        logger.setLevel('debug');
      }
    });

  // Register essential commands (shown in help by default)
  initCommand(program);
  chatCommand(program);
  askCommand(program);
  modelsCommand(program);
  compareCommand(program);
  analyzeCommand(program);
  configCommand(program);
  testCommand(program);
  
  // Register advanced commands (for power users)
  budgetCommand(program);
  analyticsCommand(program);
  optimizeCommand(program);
  trackCommand(program);
  projectCommand(program);
  keyCommand(program);
  craftWorkflowCommand(program);
  simulateCostCommand(program);
  bulkOptimizeCommand(program);
  rewritePromptCommand(program);
  setBudgetCommand(program);
  listModelsCommand(program);
  
  // Register legacy commands (kept for compatibility)
  checkCacheCommand(program);
  traceCommand(program);
  traceWorkflowCommand(program);
  debugPromptCommand(program);
  diffPromptsCommand(program);
  agentInspectCommand(program);
  replaySessionCommand(program);
  promptMetricsCommand(program);
  retryLogCommand(program);
  auditFirewallCommand(program);
  suggestModelsCommand(program);
  highCostPromptsCommand(program);

  // Global error handler
  program.exitOverride();

  try {
    // Display banner for main commands
    const args = process.argv.slice(2);
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
      displayBanner();
    }

    await program.parseAsync();
  } catch (error) {
    if (error instanceof Error) {
      // Don't log errors for help and version commands
      if (!process.argv.includes('--help') && !process.argv.includes('-h') && !process.argv.includes('--version') && !process.argv.includes('-v')) {
        logger.error('Command failed:', error.message);
        if (process.argv.includes('--debug')) {
          console.error(error.stack);
        }
      }
    } else {
      logger.error('An unexpected error occurred:', error);
    }
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error.message);
  if (process.argv.includes('--debug')) {
    console.error(error.stack);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the CLI
if (require.main === module) {
  main().catch((error) => {
    logger.error('Failed to start CLI:', error);
    process.exit(1);
  });
}

export { main }; 