import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { table } from 'table';
import { logger } from '../utils/logger';
import { ai } from 'cost-katana';

export function compareCommand(program: Command) {
  program
    .command('compare <question>')
    .description('Compare costs and responses across different AI models')
    .option('-m, --models <models>', 'Comma-separated list of models', 'gpt-4,gpt-3.5-turbo,claude-3-sonnet')
    .option('--max-tokens <tokens>', 'Maximum tokens per response', '200')
    .option('--show-responses', 'Show full responses (not just summaries)')
    .action(async (question, options) => {
      try {
        await handleCompare(question, options);
      } catch (error) {
        logger.error('Compare command failed:', error);
        process.exit(1);
      }
    });
}

async function handleCompare(question: string, options: any) {
  const models = options.models.split(',').map((m: string) => m.trim());
  const maxTokens = parseInt(options.maxTokens);

  console.log(chalk.cyan.bold('\n🔍 Comparing AI Models'));
  console.log(chalk.gray('━'.repeat(60)));
  console.log(chalk.white(`Question: "${question}"`));
  console.log(chalk.gray(`Testing: ${models.join(', ')}`));
  console.log(chalk.gray('━'.repeat(60) + '\n'));

  const results: any[] = [];
  
  for (const model of models) {
    const spinner = ora({
      text: chalk.cyan(`Testing ${model}...`),
      color: 'cyan'
    }).start();

    try {
      const startTime = Date.now();
      
      const response = await ai(model, question, {
        maxTokens,
        temperature: 0.7
      });
      
      const responseTime = Date.now() - startTime;

      spinner.succeed(chalk.green(`${model} completed`));

      results.push({
        model,
        cost: response.cost,
        tokens: response.tokens,
        responseTime,
        response: response.text,
        provider: response.provider
      });

      // Show response if requested
      if (options.showResponses) {
        console.log(chalk.gray('\nResponse:'));
        console.log(chalk.white(response.text.substring(0, 200) + '...'));
        console.log();
      }

    } catch (error) {
      spinner.fail(chalk.red(`${model} failed`));
      console.log(chalk.gray(`  Error: ${(error as Error).message}\n`));
    }
  }

  if (results.length === 0) {
    console.log(chalk.red('❌ No models succeeded'));
    return;
  }

  // Display comparison table
  console.log(chalk.cyan.bold('\n📊 Comparison Results'));
  console.log(chalk.gray('━'.repeat(60)));

  const tableData = [
    [
      chalk.bold('Model'),
      chalk.bold('Cost'),
      chalk.bold('Tokens'),
      chalk.bold('Time (ms)'),
      chalk.bold('Provider')
    ]
  ];

  // Sort by cost
  results.sort((a, b) => a.cost - b.cost);

  for (const result of results) {
    const costColor = result === results[0] ? chalk.green : chalk.white;
    
    tableData.push([
      result.model,
      costColor(`$${result.cost.toFixed(6)}`),
      result.tokens.toString(),
      result.responseTime.toString(),
      result.provider
    ]);
  }

  console.log(table(tableData, {
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
      joinJoin: chalk.gray('┼')
    }
  }));

  // Show recommendations
  const cheapest = results[0];
  const fastest = results.reduce((min, r) => r.responseTime < min.responseTime ? r : min);
  
  console.log(chalk.cyan.bold('💡 Recommendations:'));
  console.log(chalk.green(`   Cheapest: ${cheapest.model} ($${cheapest.cost.toFixed(6)})`));
  console.log(chalk.blue(`   Fastest: ${fastest.model} (${fastest.responseTime}ms)`));
  
  if (results.length > 1) {
    const mostExpensive = results[results.length - 1];
    const savings = ((mostExpensive.cost - cheapest.cost) / mostExpensive.cost * 100);
    console.log(chalk.yellow(`   Savings: ${savings.toFixed(1)}% by choosing ${cheapest.model}`));
  }

  console.log();
}
