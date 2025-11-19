import { Command } from 'commander';
import chalk from 'chalk';
import { table } from 'table';
import { logger } from '../utils/logger';
import { OPENAI, ANTHROPIC } from '../constants/models';

export function modelsCommand(program: Command) {
  program
    .command('models')
    .description('List available AI models')
    .option(
      '-p, --provider <provider>',
      'Filter by provider (openai, anthropic, google, aws)'
    )
    .option('--prices', 'Show pricing information')
    .action(async (options) => {
      try {
        await handleModels(options);
      } catch (error) {
        logger.error('Models command failed:', error);
        process.exit(1);
      }
    });
}

async function handleModels(options: any) {
  console.log(chalk.cyan.bold('\n🤖 Available AI Models'));
  console.log(chalk.gray('━'.repeat(70) + '\n'));

  const models = [
    // OpenAI
    {
      provider: 'OpenAI',
      name: OPENAI.GPT_4,
      description: 'Most capable, best for complex tasks',
      price: '$0.03/1K',
    },
    {
      provider: 'OpenAI',
      name: OPENAI.GPT_4_TURBO,
      description: 'Fast and capable',
      price: '$0.01/1K',
    },
    {
      provider: 'OpenAI',
      name: OPENAI.GPT_4O,
      description: 'Optimized GPT-4',
      price: '$0.005/1K',
    },
    {
      provider: 'OpenAI',
      name: OPENAI.GPT_4O_MINI,
      description: 'Small and affordable',
      price: '$0.0015/1K',
    },
    {
      provider: 'OpenAI',
      name: OPENAI.GPT_3_5_TURBO,
      description: 'Fast and cheap, good for simple tasks',
      price: '$0.0005/1K',
    },

    // Anthropic
    {
      provider: 'Anthropic',
      name: ANTHROPIC.CLAUDE_3_OPUS_20240229,
      description: 'Most intelligent Claude model',
      price: '$0.015/1K',
    },
    {
      provider: 'Anthropic',
      name: ANTHROPIC.CLAUDE_3_SONNET_20240229,
      description: 'Balanced intelligence and speed',
      price: '$0.003/1K',
    },
    {
      provider: 'Anthropic',
      name: ANTHROPIC.CLAUDE_3_HAIKU_20240307,
      description: 'Fast and affordable',
      price: '$0.00025/1K',
    },
    {
      provider: 'Anthropic',
      name: ANTHROPIC.CLAUDE_3_5_SONNET_20241022,
      description: 'Latest and most capable',
      price: '$0.003/1K',
    },

    // Google
    {
      provider: 'Google',
      name: 'gemini-pro',
      description: 'Versatile multimodal model',
      price: '$0.00035/1K',
    },
    {
      provider: 'Google',
      name: 'gemini-flash',
      description: 'Fast responses',
      price: '$0.000075/1K',
    },
    {
      provider: 'Google',
      name: 'gemini-2.0-flash',
      description: 'Latest fast model',
      price: '$0.0001/1K',
    },

    // AWS
    {
      provider: 'AWS',
      name: 'nova-pro',
      description: 'Powerful AWS model',
      price: '$0.008/1K',
    },
    {
      provider: 'AWS',
      name: 'nova-lite',
      description: 'Affordable AWS model',
      price: '$0.0006/1K',
    },
    {
      provider: 'AWS',
      name: 'nova-micro',
      description: 'Ultra-affordable',
      price: '$0.000035/1K',
    },
  ];

  // Filter by provider if specified
  let filteredModels = models;
  if (options.provider) {
    const providerFilter = options.provider.toLowerCase();
    filteredModels = models.filter((m) =>
      m.provider.toLowerCase().includes(providerFilter)
    );
  }

  if (filteredModels.length === 0) {
    console.log(chalk.yellow('No models found for that provider'));
    return;
  }

  // Create table
  const tableData = [
    [
      chalk.bold('Provider'),
      chalk.bold('Model'),
      chalk.bold('Description'),
      ...(options.prices ? [chalk.bold('Price')] : []),
    ],
  ];

  for (const model of filteredModels) {
    tableData.push([
      model.provider,
      chalk.cyan(model.name),
      model.description,
      ...(options.prices ? [chalk.yellow(model.price)] : []),
    ]);
  }

  console.log(
    table(tableData, {
      border: {
        topBody: chalk.gray('─'),
        topJoin: chalk.gray('┬'),
        topLeft: chalk.gray('┌'),
        topRight: chalk.gray('┐'),
        bottomBody: chalk.gray('─'),
        bottomJoin: chalk.gray('┴'),
        bottomLeft: chalk.gray('└'),
        bottomRight: chalk.gray('┘'),
        bodyLeft: chalk.gray('│'),
        bodyRight: chalk.gray('│'),
        bodyJoin: chalk.gray('│'),
        joinBody: chalk.gray('─'),
        joinLeft: chalk.gray('├'),
        joinRight: chalk.gray('┤'),
        joinJoin: chalk.gray('┼'),
      },
    })
  );

  // Show tips
  console.log(chalk.cyan('💡 Tips:'));
  console.log(
    chalk.white(
      '   • Use GPT-3.5-Turbo for simple tasks (10x cheaper than GPT-4)'
    )
  );
  console.log(
    chalk.white('   • Use Claude-3-Haiku for fast, affordable responses')
  );
  console.log(chalk.white('   • Use Gemini-Flash for ultra-low cost'));
  console.log(
    chalk.white(
      '   • Enable --cortex for 70-95% additional savings on any model'
    )
  );

  console.log(chalk.gray('\nTo use a model:'));
  console.log(chalk.white('   cost-katana chat --model <model-name>'));
  console.log(
    chalk.white('   cost-katana ask "question" --model <model-name>')
  );

  console.log();
}
