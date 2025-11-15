import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function testCommand(program: Command) {
  program
    .command('test')
    .description('Test configuration and API connectivity')
    .option('-c, --config <path>', 'Path to configuration file')
    .option('-v, --verbose', 'Show detailed test results')
    .action(async (options) => {
      try {
        await handleTest(options);
      } catch (error) {
        logger.error('Test failed:', error);
        process.exit(1);
      }
    });
}

async function handleTest(options: any) {
  logger.info('🧪 Testing Cost Katana CLI configuration...');

  // Load configuration if specified
  if (options.config) {
    if (!configManager.loadFromFile(options.config)) {
      logger.error('Failed to load configuration file');
      process.exit(1);
    }
  }

  const results = await runTests(options.verbose);
  displayTestResults(results);
}

async function runTests(verbose: boolean) {
  const results = {
    config: false,
    apiKey: false,
    connectivity: false,
    models: false,
    total: 0,
    passed: 0,
  };

  // Test 1: Configuration
  logger.info('Testing configuration...');
  const configValidation = configManager.validate();
  results.config = configValidation.isValid;
  results.total++;
  if (results.config) results.passed++;

  if (verbose && !configValidation.isValid) {
    logger.error('Configuration errors:');
    configValidation.errors.forEach((error) => {
      logger.error(`  - ${error}`);
    });
  }

  // Test 2: API Key
  logger.info('Testing API key...');
  const apiKey = configManager.get('apiKey');
  results.apiKey = !!apiKey && apiKey !== 'your_api_key_here';
  results.total++;
  if (results.apiKey) results.passed++;

  if (verbose && !results.apiKey) {
    logger.error('API key is missing or invalid');
  }

  // Test 3: Connectivity
  logger.info('Testing API connectivity...');
  results.connectivity = await testConnectivity();
  results.total++;
  if (results.connectivity) results.passed++;

  // Test 4: Models
  logger.info('Testing model availability...');
  results.models = await testModels();
  results.total++;
  if (results.models) results.passed++;

  return results;
}

async function testConnectivity(): Promise<boolean> {
  const spinner = ora('Testing API connectivity...').start();

  try {
    const baseUrl = configManager.get('baseUrl');
    const apiKey = configManager.get('apiKey');

    if (!baseUrl || !apiKey) {
      spinner.fail('Missing base URL or API key');
      return false;
    }

    const response = await axios.get(`${baseUrl}/health`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    if (response.status === 200) {
      spinner.succeed('API connectivity test passed');
      return true;
    } else {
      spinner.fail(`API returned status ${response.status}`);
      return false;
    }
  } catch (error: any) {
    spinner.fail('API connectivity test failed');
    if (error.response) {
      logger.debug(`Response status: ${error.response.status}`);
      logger.debug(`Response data: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      logger.debug('No response received');
    } else {
      logger.debug(`Error: ${error.message}`);
    }
    return false;
  }
}

async function testModels(): Promise<boolean> {
  const spinner = ora('Testing model availability...').start();

  try {
    const baseUrl = configManager.get('baseUrl');
    const apiKey = configManager.get('apiKey');

    if (!baseUrl || !apiKey) {
      spinner.fail('Missing base URL or API key');
      return false;
    }

    const response = await axios.get(`${baseUrl}/models`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    if (response.status === 200 && response.data?.models) {
      const modelCount = response.data.models.length;
      spinner.succeed(`Found ${modelCount} available models`);
      return true;
    } else {
      spinner.fail('No models available');
      return false;
    }
  } catch (error: any) {
    spinner.fail('Model availability test failed');
    if (error.response) {
      logger.debug(`Response status: ${error.response.status}`);
    }
    return false;
  }
}

function displayTestResults(results: any) {
  console.log('\n' + chalk.cyan.bold('📊 Test Results'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  const tests = [
    { name: 'Configuration', result: results.config },
    { name: 'API Key', result: results.apiKey },
    { name: 'Connectivity', result: results.connectivity },
    { name: 'Models', result: results.models },
  ];

  tests.forEach((test) => {
    const status = test.result ? chalk.green('✓') : chalk.red('✗');
    const statusText = test.result ? chalk.green('PASS') : chalk.red('FAIL');
    console.log(`${status} ${test.name}: ${statusText}`);
  });

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  const percentage = Math.round((results.passed / results.total) * 100);
  const overallStatus =
    results.passed === results.total
      ? chalk.green('PASSED')
      : chalk.red('FAILED');

  console.log(
    `Overall: ${overallStatus} (${results.passed}/${results.total} tests passed - ${percentage}%)`
  );

  if (results.passed === results.total) {
    console.log(
      chalk.green('\n🎉 All tests passed! Your CLI is ready to use.')
    );
    console.log(chalk.blue('💡 Try running: cost-katana chat'));
  } else {
    console.log(
      chalk.yellow('\n⚠️  Some tests failed. Please check your configuration.')
    );
    console.log(chalk.blue('💡 Run: cost-katana init --force to reconfigure'));
  }
}
