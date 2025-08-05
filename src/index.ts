#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';
import { version } from '../package.json';
import { initCommand } from './commands/init';
import { chatCommand } from './commands/chat';
import { analyzeCommand } from './commands/analyze';
import { optimizeCommand } from './commands/optimize';
import { configCommand } from './commands/config';
import { testCommand } from './commands/test';
import { listModelsCommand } from './commands/list-models';
import { logger } from './utils/logger';
import { ConfigManager } from './utils/config';

// Display banner
function displayBanner() {
  const banner = figlet.textSync('Cost Katana', {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  });

  const subtitle = gradient.pastel.multiline([
    'AI Cost Optimization CLI',
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
    .description('AI Cost Optimizer CLI - Track, analyze, and optimize AI API costs')
    .version(version, '-v, --version')
    .option('-d, --debug', 'Enable debug mode')
    .option('-c, --config <path>', 'Path to configuration file')
    .hook('preAction', (thisCommand) => {
      const options = thisCommand.opts();
      if (options.debug) {
        logger.setLevel('debug');
      }
    });

  // Register commands
  initCommand(program);
  testCommand(program);
  configCommand(program);
  listModelsCommand(program);
  chatCommand(program);
  analyzeCommand(program);
  optimizeCommand(program);

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
      logger.error('Command failed:', error.message);
      if (process.argv.includes('--debug')) {
        console.error(error.stack);
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