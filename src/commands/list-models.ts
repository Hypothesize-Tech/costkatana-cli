import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { AVAILABLE_MODELS, getModelsByProvider, ModelInfo } from '../utils/models';

export function listModelsCommand(program: Command) {
  program
    .command('list-models')
    .description('List available AI models')
    .option('-p, --provider <provider>', 'Filter by provider')
    .option('-f, --format <format>', 'Output format (table, json, csv)', 'table')
    .option('-v, --verbose', 'Show detailed model information')
    .action(async (options) => {
      try {
        await handleListModels(options);
      } catch (error) {
        logger.error('Failed to list models:', error);
        process.exit(1);
      }
    });
}

async function handleListModels(options: any) {
  logger.info('📋 Loading available models...');

  try {
    const models = await fetchModels(options.provider);
    
    if (models.length === 0) {
      logger.warn('No models found for the specified criteria');
      return;
    }

    displayModels(models, options);
  } catch (error) {
    logger.error('Failed to load models:', error);
    process.exit(1);
  }
}

async function fetchModels(providerFilter?: string): Promise<ModelInfo[]> {
  // Use local models data from the core package pricing configuration
  let models = AVAILABLE_MODELS;

  // Filter by provider if specified
  if (providerFilter) {
    models = getModelsByProvider(providerFilter);
  }

  return models;
}

function displayModels(models: ModelInfo[], options: any) {
  const format = options.format || 'table';
  const verbose = options.verbose;

  switch (format) {
    case 'json':
      displayModelsJson(models, verbose);
      break;
    case 'csv':
      displayModelsCsv(models, verbose);
      break;
    case 'table':
    default:
      displayModelsTable(models, verbose);
      break;
  }
}

function displayModelsTable(models: ModelInfo[], verbose: boolean) {
  console.log(chalk.cyan.bold('\n🤖 Available Models'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Group models by provider
  const groupedModels: Record<string, ModelInfo[]> = models.reduce((acc: Record<string, ModelInfo[]>, model: ModelInfo) => {
    const provider = model.provider || 'Unknown';
    if (!acc[provider]) {
      acc[provider] = [];
    }
    acc[provider].push(model);
    return acc;
  }, {});

  Object.entries(groupedModels).forEach(([provider, providerModels]) => {
    console.log(chalk.yellow.bold(`\n${provider.toUpperCase()}`));
    console.log(chalk.gray('─'.repeat(provider.length + 2)));

    providerModels.forEach((model: ModelInfo) => {
      const name = chalk.white(model.name);
      const id = chalk.gray(model.id);
      const status = model.available ? chalk.green('✓ Available') : chalk.red('✗ Unavailable');
      const latest = model.isLatest ? chalk.blue('★ Latest') : '';
      
      console.log(`  ${name} (${id}) - ${status} ${latest}`);

      if (verbose) {
        if (model.notes) {
          console.log(chalk.gray(`    Notes: ${model.notes}`));
        }
        if (model.maxTokens) {
          console.log(chalk.gray(`    Max Tokens: ${model.maxTokens.toLocaleString()}`));
        }
        if (model.pricing) {
          console.log(chalk.gray(`    Pricing: $${model.pricing.input}/1K input, $${model.pricing.output}/1K output`));
        }
        if (model.contextLength) {
          console.log(chalk.gray(`    Context Length: ${model.contextLength.toLocaleString()}`));
        }
        if (model.capabilities && model.capabilities.length > 0) {
          console.log(chalk.gray(`    Capabilities: ${model.capabilities.join(', ')}`));
        }
        console.log('');
      }
    });
  });

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.blue(`Total models: ${models.length}`));
}

function displayModelsJson(models: ModelInfo[], verbose: boolean) {
  const output = verbose ? models : models.map(model => ({
    name: model.name,
    id: model.id,
    provider: model.provider,
    available: model.available,
    category: model.category,
    isLatest: model.isLatest,
  }));

  console.log(JSON.stringify(output, null, 2));
}

function displayModelsCsv(models: ModelInfo[], verbose: boolean) {
  const headers = verbose 
    ? ['Name', 'ID', 'Provider', 'Available', 'Category', 'Latest', 'Max Tokens', 'Context Length', 'Input Price', 'Output Price', 'Capabilities', 'Notes']
    : ['Name', 'ID', 'Provider', 'Available', 'Category', 'Latest'];

  console.log(headers.join(','));

  models.forEach(model => {
    const row = verbose 
      ? [
          `"${model.name}"`,
          `"${model.id}"`,
          `"${model.provider}"`,
          model.available ? 'true' : 'false',
          `"${model.category}"`,
          model.isLatest ? 'true' : 'false',
          model.maxTokens || '',
          model.contextLength || '',
          model.pricing?.input || '',
          model.pricing?.output || '',
          `"${model.capabilities?.join(', ') || ''}"`,
          `"${model.notes || ''}"`,
        ]
      : [
          `"${model.name}"`,
          `"${model.id}"`,
          `"${model.provider}"`,
          model.available ? 'true' : 'false',
          `"${model.category}"`,
          model.isLatest ? 'true' : 'false',
        ];

    console.log(row.join(','));
  });
} 