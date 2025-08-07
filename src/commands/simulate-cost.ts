import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';
import * as fs from 'fs';

export function simulateCostCommand(program: Command) {
  const simulateGroup = program
    .command('simulate-cost')
    .description('🔮 Run "what-if" scenarios by tweaking models, prompt structure, or retries');

  // Main simulate-cost command
  simulateGroup
    .option('--prompt-id <id>', 'Prompt ID to simulate')
    .option('--what-if <scenario>', 'JSON scenario configuration')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export simulation data to file')
    .option('-v, --verbose', 'Show detailed simulation analysis')
    .option('--include-carbon', 'Include carbon footprint analysis')
    .option('--include-efficiency', 'Include efficiency metrics')
    .option('--include-alternatives', 'Include alternative scenarios')
    .action(async (options) => {
      try {
        await handleSimulateCost(options);
      } catch (error) {
        logger.error('Simulate cost command failed:', error);
        process.exit(1);
      }
    });

  // Batch simulation
  simulateGroup
    .command('batch')
    .description('🔮 Run multiple scenarios in batch')
    .option('--scenarios <file>', 'JSON file with multiple scenarios')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export batch results to file')
    .option('-v, --verbose', 'Show detailed batch analysis')
    .option('--include-carbon', 'Include carbon footprint analysis')
    .option('--include-efficiency', 'Include efficiency metrics')
    .option('--include-comparison', 'Include scenario comparison')
    .action(async (options) => {
      try {
        await handleBatchSimulation(options);
      } catch (error) {
        logger.error('Batch simulation failed:', error);
        process.exit(1);
      }
    });

  // Model comparison simulation
  simulateGroup
    .command('compare-models')
    .description('🔮 Compare costs across different models')
    .option('--prompt-id <id>', 'Prompt ID to compare')
    .option('--models <models>', 'Comma-separated list of models to compare')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export comparison data to file')
    .option('-v, --verbose', 'Show detailed model comparison')
    .option('--include-carbon', 'Include carbon footprint analysis')
    .option('--include-efficiency', 'Include efficiency metrics')
    .option('--include-recommendations', 'Include model recommendations')
    .action(async (options) => {
      try {
        await handleModelComparison(options);
      } catch (error) {
        logger.error('Model comparison failed:', error);
        process.exit(1);
      }
    });

  // Retry optimization simulation
  simulateGroup
    .command('optimize-retries')
    .description('🔮 Optimize retry strategies for cost efficiency')
    .option('--prompt-id <id>', 'Prompt ID to optimize')
    .option('--max-retries <number>', 'Maximum retries to test', '5')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export optimization data to file')
    .option('-v, --verbose', 'Show detailed optimization analysis')
    .option('--include-carbon', 'Include carbon footprint analysis')
    .option('--include-efficiency', 'Include efficiency metrics')
    .option('--include-strategies', 'Include retry strategies')
    .action(async (options) => {
      try {
        await handleRetryOptimization(options);
      } catch (error) {
        logger.error('Retry optimization failed:', error);
        process.exit(1);
      }
    });

  // Prompt optimization simulation
  simulateGroup
    .command('optimize-prompt')
    .description('🔮 Optimize prompt structure for cost efficiency')
    .option('--prompt-id <id>', 'Prompt ID to optimize')
    .option('--strategies <strategies>', 'Comma-separated optimization strategies')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export optimization data to file')
    .option('-v, --verbose', 'Show detailed optimization analysis')
    .option('--include-carbon', 'Include carbon footprint analysis')
    .option('--include-efficiency', 'Include efficiency metrics')
    .option('--include-suggestions', 'Include prompt suggestions')
    .action(async (options) => {
      try {
        await handlePromptOptimization(options);
      } catch (error) {
        logger.error('Prompt optimization failed:', error);
        process.exit(1);
      }
    });

  // Historical simulation
  simulateGroup
    .command('historical')
    .description('🔮 Simulate historical data with different parameters')
    .option('--timeframe <timeframe>', 'Timeframe for historical data (7d, 30d, 90d)', '30d')
    .option('--what-if <scenario>', 'JSON scenario configuration')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export historical simulation data to file')
    .option('-v, --verbose', 'Show detailed historical analysis')
    .option('--include-carbon', 'Include carbon footprint analysis')
    .option('--include-efficiency', 'Include efficiency metrics')
    .option('--include-trends', 'Include trend analysis')
    .action(async (options) => {
      try {
        await handleHistoricalSimulation(options);
      } catch (error) {
        logger.error('Historical simulation failed:', error);
        process.exit(1);
      }
    });
}

async function handleSimulateCost(options: any) {
  logger.info('🔮 Running cost simulation...');

  try {
    const simulation = await runCostSimulation(options);
    displaySimulationResults(simulation, options);
  } catch (error) {
    logger.error('Failed to run cost simulation:', error);
    process.exit(1);
  }
}

async function runCostSimulation(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    console.log(chalk.red.bold('\n❌ Configuration Missing'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    
    if (!apiKey) {
      console.log(chalk.yellow('• API Key is not set'));
    }
    if (!baseUrl) {
      console.log(chalk.yellow('• Base URL is not set'));
    }
    
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.cyan('To set up your configuration, run:'));
    console.log(chalk.white('  cost-katana init'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
    
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const params = new URLSearchParams();
    if (options.promptId) params.append('promptId', options.promptId);
    if (options.whatIf) params.append('whatIf', options.whatIf);
    if (options.includeCarbon) params.append('includeCarbon', 'true');
    if (options.includeEfficiency) params.append('includeEfficiency', 'true');
    if (options.includeAlternatives) params.append('includeAlternatives', 'true');

    const response = await axios.post(`${baseUrl}/api/simulate-cost?${params}`, {
      promptId: options.promptId,
      whatIf: options.whatIf ? JSON.parse(options.whatIf) : {},
      options: {
        includeCarbon: options.includeCarbon,
        includeEfficiency: options.includeEfficiency,
        includeAlternatives: options.includeAlternatives
      }
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

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
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displaySimulationResults(simulation: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(simulation, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Metric,Current,Simulated,Difference,Percentage');
    Object.entries(simulation.metrics).forEach(([metric, data]: [string, any]) => {
      console.log(`"${metric}","${data.current}","${data.simulated}","${data.difference}","${data.percentage}%"`);
    });
    return;
  }

  console.log(chalk.cyan.bold('\n🔮 Cost Simulation Results'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Scenario Overview
  console.log(chalk.yellow.bold('\n📋 Scenario Overview'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Prompt ID:'), chalk.cyan(simulation.promptId));
  console.log(chalk.white('Scenario:'), chalk.gray(simulation.scenario));
  console.log(chalk.white('Simulation Date:'), chalk.cyan(simulation.simulationDate));

  // Cost Analysis
  console.log(chalk.yellow.bold('\n💰 Cost Analysis'));
  console.log(chalk.gray('─'.repeat(50)));
  
  const costColor = simulation.metrics.cost.difference > 0 ? chalk.red : chalk.green;
  console.log(chalk.white('Current Cost:'), chalk.cyan(`$${simulation.metrics.cost.current.toFixed(4)}`));
  console.log(chalk.white('Simulated Cost:'), chalk.cyan(`$${simulation.metrics.cost.simulated.toFixed(4)}`));
  console.log(chalk.white('Cost Difference:'), costColor(`$${simulation.metrics.cost.difference.toFixed(4)}`));
  console.log(chalk.white('Cost Change:'), costColor(`${simulation.metrics.cost.percentage}%`));

  // Token Analysis
  console.log(chalk.yellow.bold('\n🔢 Token Analysis'));
  console.log(chalk.gray('─'.repeat(50)));
  
  const tokenColor = simulation.metrics.tokens.difference > 0 ? chalk.red : chalk.green;
  console.log(chalk.white('Current Tokens:'), chalk.cyan(simulation.metrics.tokens.current.toLocaleString()));
  console.log(chalk.white('Simulated Tokens:'), chalk.cyan(simulation.metrics.tokens.simulated.toLocaleString()));
  console.log(chalk.white('Token Difference:'), tokenColor(simulation.metrics.tokens.difference.toLocaleString()));
  console.log(chalk.white('Token Change:'), tokenColor(`${simulation.metrics.tokens.percentage}%`));

  // Latency Analysis
  console.log(chalk.yellow.bold('\n⚡ Latency Analysis'));
  console.log(chalk.gray('─'.repeat(50)));
  
  const latencyColor = simulation.metrics.latency.difference > 0 ? chalk.red : chalk.green;
  console.log(chalk.white('Current Latency:'), chalk.cyan(`${simulation.metrics.latency.current}ms`));
  console.log(chalk.white('Simulated Latency:'), chalk.cyan(`${simulation.metrics.latency.simulated}ms`));
  console.log(chalk.white('Latency Difference:'), latencyColor(`${simulation.metrics.latency.difference}ms`));
  console.log(chalk.white('Latency Change:'), latencyColor(`${simulation.metrics.latency.percentage}%`));

  // Carbon Analysis
  if (simulation.carbonAnalysis) {
    console.log(chalk.yellow.bold('\n🌱 Carbon Footprint Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    
    const carbonColor = simulation.carbonAnalysis.difference > 0 ? chalk.red : chalk.green;
    console.log(chalk.white('Current CO2:'), chalk.cyan(`${simulation.carbonAnalysis.current}g CO2`));
    console.log(chalk.white('Simulated CO2:'), chalk.cyan(`${simulation.carbonAnalysis.simulated}g CO2`));
    console.log(chalk.white('CO2 Difference:'), carbonColor(`${simulation.carbonAnalysis.difference}g CO2`));
    console.log(chalk.white('CO2 Change:'), carbonColor(`${simulation.carbonAnalysis.percentage}%`));
  }

  // Efficiency Analysis
  if (simulation.efficiencyAnalysis) {
    console.log(chalk.yellow.bold('\n📈 Efficiency Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('Cost Efficiency:'), chalk.cyan(`${simulation.efficiencyAnalysis.costEfficiency}%`));
    console.log(chalk.white('Token Efficiency:'), chalk.cyan(`${simulation.efficiencyAnalysis.tokenEfficiency}%`));
    console.log(chalk.white('Performance Efficiency:'), chalk.cyan(`${simulation.efficiencyAnalysis.performanceEfficiency}%`));
    console.log(chalk.white('Overall Efficiency:'), chalk.cyan(`${simulation.efficiencyAnalysis.overallEfficiency}%`));
  }

  // Net Impact
  console.log(chalk.yellow.bold('\n🎯 Net Impact Analysis'));
  console.log(chalk.gray('─'.repeat(50)));
  
  const impactColor = simulation.netImpact.efficiencyGain > 0 ? chalk.green : chalk.red;
  console.log(chalk.white('Efficiency Gain/Loss:'), impactColor(`${simulation.netImpact.efficiencyGain}%`));
  console.log(chalk.white('Cost Savings:'), impactColor(`$${simulation.netImpact.costSavings.toFixed(4)}`));
  console.log(chalk.white('Performance Impact:'), impactColor(`${simulation.netImpact.performanceImpact}%`));
  console.log(chalk.white('Quality Impact:'), impactColor(`${simulation.netImpact.qualityImpact}%`));

  // Recommendations
  if (simulation.recommendations && simulation.recommendations.length > 0) {
    console.log(chalk.yellow.bold('\n💡 Recommendations'));
    console.log(chalk.gray('─'.repeat(50)));
    simulation.recommendations.forEach((rec: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${rec.type}:`));
      console.log(chalk.gray(`   ${rec.description}`));
      console.log(chalk.gray(`   Potential Savings: $${rec.potentialSavings.toFixed(4)}`));
      console.log(chalk.gray(`   Implementation: ${rec.implementation}`));
    });
  }

  // Alternative Scenarios
  if (simulation.alternatives && simulation.alternatives.length > 0) {
    console.log(chalk.yellow.bold('\n🔄 Alternative Scenarios'));
    console.log(chalk.gray('─'.repeat(50)));
    simulation.alternatives.forEach((alt: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${alt.name}:`));
      console.log(chalk.gray(`   ${alt.description}`));
      console.log(chalk.gray(`   Cost: $${alt.cost.toFixed(4)} (${alt.costDifference}%)`));
      console.log(chalk.gray(`   Latency: ${alt.latency}ms (${alt.latencyDifference}%)`));
      console.log(chalk.gray(`   Quality: ${alt.quality}`));
    });
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleBatchSimulation(options: any) {
  logger.info('🔮 Running batch simulation...');

  try {
    const batchResults = await runBatchSimulation(options);
    displayBatchResults(batchResults, options);
  } catch (error) {
    logger.error('Failed to run batch simulation:', error);
    process.exit(1);
  }
}

async function runBatchSimulation(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    let scenarios = [];
    if (options.scenarios) {
      const scenariosContent = fs.readFileSync(options.scenarios, 'utf8');
      scenarios = JSON.parse(scenariosContent);
    }

    const params = new URLSearchParams();
    if (options.includeCarbon) params.append('includeCarbon', 'true');
    if (options.includeEfficiency) params.append('includeEfficiency', 'true');
    if (options.includeComparison) params.append('includeComparison', 'true');

    const response = await axios.post(`${baseUrl}/api/simulate-cost/batch?${params}`, {
      scenarios: scenarios,
      options: {
        includeCarbon: options.includeCarbon,
        includeEfficiency: options.includeEfficiency,
        includeComparison: options.includeComparison
      }
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    });

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
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayBatchResults(batchResults: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(batchResults, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n🔮 Batch Simulation Results'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Summary
  console.log(chalk.yellow.bold('\n📊 Summary'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Total Scenarios:'), chalk.cyan(batchResults.totalScenarios));
  console.log(chalk.white('Best Cost Savings:'), chalk.green(`$${batchResults.bestCostSavings.toFixed(4)}`));
  console.log(chalk.white('Worst Cost Increase:'), chalk.red(`$${batchResults.worstCostIncrease.toFixed(4)}`));
  console.log(chalk.white('Average Efficiency Gain:'), chalk.cyan(`${batchResults.averageEfficiencyGain}%`));

  // Individual Results
  console.log(chalk.yellow.bold('\n🔍 Individual Results'));
  console.log(chalk.gray('─'.repeat(50)));
  
  batchResults.results.forEach((result: any, index: number) => {
    const costColor = result.costDifference > 0 ? chalk.red : chalk.green;
    console.log(chalk.white(`\n${index + 1}. ${result.name}:`));
    console.log(chalk.gray(`   Cost: $${result.cost.toFixed(4)} (${costColor(result.costDifference)}%)`));
    console.log(chalk.gray(`   Tokens: ${result.tokens.toLocaleString()} (${result.tokenDifference}%)`));
    console.log(chalk.gray(`   Latency: ${result.latency}ms (${result.latencyDifference}%)`));
    console.log(chalk.gray(`   Efficiency: ${result.efficiencyGain}%`));
  });

  // Comparison Matrix
  if (batchResults.comparisonMatrix) {
    console.log(chalk.yellow.bold('\n📈 Comparison Matrix'));
    console.log(chalk.gray('─'.repeat(50)));
    // Display comparison matrix
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleModelComparison(options: any) {
  logger.info('🔮 Running model comparison...');

  try {
    const comparison = await runModelComparison(options);
    displayModelComparison(comparison, options);
  } catch (error) {
    logger.error('Failed to run model comparison:', error);
    process.exit(1);
  }
}

async function runModelComparison(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const models = options.models ? options.models.split(',') : ['gpt-4', 'gpt-3.5-turbo', 'claude-3-sonnet', 'claude-3-haiku'];

    const params = new URLSearchParams();
    if (options.promptId) params.append('promptId', options.promptId);
    params.append('models', models.join(','));
    if (options.includeCarbon) params.append('includeCarbon', 'true');
    if (options.includeEfficiency) params.append('includeEfficiency', 'true');
    if (options.includeRecommendations) params.append('includeRecommendations', 'true');

    const response = await axios.post(`${baseUrl}/api/simulate-cost/compare-models?${params}`, {
      promptId: options.promptId,
      models: models,
      options: {
        includeCarbon: options.includeCarbon,
        includeEfficiency: options.includeEfficiency,
        includeRecommendations: options.includeRecommendations
      }
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

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
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayModelComparison(comparison: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(comparison, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n🔮 Model Comparison Results'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Model Rankings
  console.log(chalk.yellow.bold('\n🏆 Model Rankings'));
  console.log(chalk.gray('─'.repeat(50)));
  
  comparison.rankings.forEach((model: any, index: number) => {
    const rankColor = index === 0 ? chalk.green : index === 1 ? chalk.yellow : chalk.gray;
    console.log(chalk.white(`${index + 1}. ${model.name}:`));
    console.log(chalk.gray(`   Cost: $${model.cost.toFixed(4)}`));
    console.log(chalk.gray(`   Tokens: ${model.tokens.toLocaleString()}`));
    console.log(chalk.gray(`   Latency: ${model.latency}ms`));
    console.log(chalk.gray(`   Quality: ${model.quality}`));
    console.log(chalk.gray(`   Efficiency: ${model.efficiency}%`));
  });

  // Detailed Comparison
  console.log(chalk.yellow.bold('\n📊 Detailed Comparison'));
  console.log(chalk.gray('─'.repeat(50)));
  
  comparison.models.forEach((model: any) => {
    console.log(chalk.white(`\n${model.name}:`));
    console.log(chalk.gray('   ─'.repeat(40)));
    console.log(chalk.white('   Cost:'), chalk.cyan(`$${model.cost.toFixed(4)}`));
    console.log(chalk.white('   Tokens:'), chalk.cyan(model.tokens.toLocaleString()));
    console.log(chalk.white('   Latency:'), chalk.cyan(`${model.latency}ms`));
    console.log(chalk.white('   Quality:'), chalk.cyan(model.quality));
    console.log(chalk.white('   Efficiency:'), chalk.cyan(`${model.efficiency}%`));
    
    if (model.carbonFootprint) {
      console.log(chalk.white('   Carbon:'), chalk.cyan(`${model.carbonFootprint}g CO2`));
    }
  });

  // Recommendations
  if (comparison.recommendations) {
    console.log(chalk.yellow.bold('\n💡 Recommendations'));
    console.log(chalk.gray('─'.repeat(50)));
    comparison.recommendations.forEach((rec: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${rec.type}:`));
      console.log(chalk.gray(`   ${rec.description}`));
      console.log(chalk.gray(`   Model: ${rec.model}`));
      console.log(chalk.gray(`   Savings: $${rec.savings.toFixed(4)}`));
    });
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleRetryOptimization(options: any) {
  logger.info('🔮 Running retry optimization...');

  try {
    const optimization = await runRetryOptimization(options);
    displayRetryOptimization(optimization, options);
  } catch (error) {
    logger.error('Failed to run retry optimization:', error);
    process.exit(1);
  }
}

async function runRetryOptimization(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const maxRetries = parseInt(options.maxRetries) || 5;

    const params = new URLSearchParams();
    if (options.promptId) params.append('promptId', options.promptId);
    params.append('maxRetries', maxRetries.toString());
    if (options.includeCarbon) params.append('includeCarbon', 'true');
    if (options.includeEfficiency) params.append('includeEfficiency', 'true');
    if (options.includeStrategies) params.append('includeStrategies', 'true');

    const response = await axios.post(`${baseUrl}/api/simulate-cost/optimize-retries?${params}`, {
      promptId: options.promptId,
      maxRetries: maxRetries,
      options: {
        includeCarbon: options.includeCarbon,
        includeEfficiency: options.includeEfficiency,
        includeStrategies: options.includeStrategies
      }
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

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
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayRetryOptimization(optimization: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(optimization, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n🔮 Retry Optimization Results'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Optimal Strategy
  console.log(chalk.yellow.bold('\n🎯 Optimal Retry Strategy'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Optimal Retries:'), chalk.cyan(optimization.optimalRetries));
  console.log(chalk.white('Cost Savings:'), chalk.green(`$${optimization.costSavings.toFixed(4)}`));
  console.log(chalk.white('Success Rate:'), chalk.cyan(`${optimization.successRate}%`));
  console.log(chalk.white('Efficiency Gain:'), chalk.green(`${optimization.efficiencyGain}%`));

  // Retry Analysis
  console.log(chalk.yellow.bold('\n📊 Retry Analysis'));
  console.log(chalk.gray('─'.repeat(50)));
  
  optimization.retryAnalysis.forEach((retry: any) => {
    const costColor = retry.costSavings > 0 ? chalk.green : chalk.red;
    console.log(chalk.white(`\n${retry.retries} Retries:`));
    console.log(chalk.gray(`   Cost: $${retry.cost.toFixed(4)}`));
    console.log(chalk.gray(`   Savings: ${costColor(`$${retry.costSavings.toFixed(4)}`)}`));
    console.log(chalk.gray(`   Success Rate: ${retry.successRate}%`));
    console.log(chalk.gray(`   Latency: ${retry.latency}ms`));
  });

  // Strategies
  if (optimization.strategies) {
    console.log(chalk.yellow.bold('\n💡 Retry Strategies'));
    console.log(chalk.gray('─'.repeat(50)));
    optimization.strategies.forEach((strategy: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${strategy.name}:`));
      console.log(chalk.gray(`   ${strategy.description}`));
      console.log(chalk.gray(`   Cost Impact: $${strategy.costImpact.toFixed(4)}`));
      console.log(chalk.gray(`   Success Impact: ${strategy.successImpact}%`));
    });
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handlePromptOptimization(options: any) {
  logger.info('🔮 Running prompt optimization...');

  try {
    const optimization = await runPromptOptimization(options);
    displayPromptOptimization(optimization, options);
  } catch (error) {
    logger.error('Failed to run prompt optimization:', error);
    process.exit(1);
  }
}

async function runPromptOptimization(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const strategies = options.strategies ? options.strategies.split(',') : ['token-reduction', 'clarity-improvement', 'context-optimization'];

    const params = new URLSearchParams();
    if (options.promptId) params.append('promptId', options.promptId);
    params.append('strategies', strategies.join(','));
    if (options.includeCarbon) params.append('includeCarbon', 'true');
    if (options.includeEfficiency) params.append('includeEfficiency', 'true');
    if (options.includeSuggestions) params.append('includeSuggestions', 'true');

    const response = await axios.post(`${baseUrl}/api/simulate-cost/optimize-prompt?${params}`, {
      promptId: options.promptId,
      strategies: strategies,
      options: {
        includeCarbon: options.includeCarbon,
        includeEfficiency: options.includeEfficiency,
        includeSuggestions: options.includeSuggestions
      }
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

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
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayPromptOptimization(optimization: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(optimization, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n🔮 Prompt Optimization Results'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Optimization Summary
  console.log(chalk.yellow.bold('\n📋 Optimization Summary'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Token Reduction:'), chalk.green(`${optimization.tokenReduction}%`));
  console.log(chalk.white('Cost Savings:'), chalk.green(`$${optimization.costSavings.toFixed(4)}`));
  console.log(chalk.white('Quality Impact:'), chalk.cyan(`${optimization.qualityImpact}%`));
  console.log(chalk.white('Efficiency Gain:'), chalk.green(`${optimization.efficiencyGain}%`));

  // Strategy Results
  console.log(chalk.yellow.bold('\n🔧 Strategy Results'));
  console.log(chalk.gray('─'.repeat(50)));
  
  optimization.strategyResults.forEach((strategy: any) => {
    console.log(chalk.white(`\n${strategy.name}:`));
    console.log(chalk.gray('   ─'.repeat(40)));
    console.log(chalk.white('   Token Reduction:'), chalk.green(`${strategy.tokenReduction}%`));
    console.log(chalk.white('   Cost Savings:'), chalk.green(`$${strategy.costSavings.toFixed(4)}`));
    console.log(chalk.white('   Quality Impact:'), chalk.cyan(`${strategy.qualityImpact}%`));
    console.log(chalk.white('   Implementation:'), chalk.gray(strategy.implementation));
  });

  // Suggestions
  if (optimization.suggestions) {
    console.log(chalk.yellow.bold('\n💡 Prompt Suggestions'));
    console.log(chalk.gray('─'.repeat(50)));
    optimization.suggestions.forEach((suggestion: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${suggestion.type}:`));
      console.log(chalk.gray(`   ${suggestion.description}`));
      console.log(chalk.gray(`   Potential Savings: $${suggestion.potentialSavings.toFixed(4)}`));
      console.log(chalk.gray(`   Implementation: ${suggestion.implementation}`));
    });
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleHistoricalSimulation(options: any) {
  logger.info('🔮 Running historical simulation...');

  try {
    const simulation = await runHistoricalSimulation(options);
    displayHistoricalSimulation(simulation, options);
  } catch (error) {
    logger.error('Failed to run historical simulation:', error);
    process.exit(1);
  }
}

async function runHistoricalSimulation(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const params = new URLSearchParams();
    params.append('timeframe', options.timeframe || '30d');
    if (options.whatIf) params.append('whatIf', options.whatIf);
    if (options.includeCarbon) params.append('includeCarbon', 'true');
    if (options.includeEfficiency) params.append('includeEfficiency', 'true');
    if (options.includeTrends) params.append('includeTrends', 'true');

    const response = await axios.post(`${baseUrl}/api/simulate-cost/historical?${params}`, {
      timeframe: options.timeframe || '30d',
      whatIf: options.whatIf ? JSON.parse(options.whatIf) : {},
      options: {
        includeCarbon: options.includeCarbon,
        includeEfficiency: options.includeEfficiency,
        includeTrends: options.includeTrends
      }
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

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
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayHistoricalSimulation(simulation: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(simulation, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n🔮 Historical Simulation Results'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Historical Summary
  console.log(chalk.yellow.bold('\n📊 Historical Summary'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Timeframe:'), chalk.cyan(simulation.timeframe));
  console.log(chalk.white('Total Requests:'), chalk.cyan(simulation.totalRequests.toLocaleString()));
  console.log(chalk.white('Historical Cost:'), chalk.red(`$${simulation.historicalCost.toFixed(4)}`));
  console.log(chalk.white('Simulated Cost:'), chalk.cyan(`$${simulation.simulatedCost.toFixed(4)}`));
  console.log(chalk.white('Cost Savings:'), chalk.green(`$${simulation.costSavings.toFixed(4)}`));

  // Trend Analysis
  if (simulation.trends) {
    console.log(chalk.yellow.bold('\n📈 Trend Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('Cost Trend:'), chalk.cyan(simulation.trends.costTrend));
    console.log(chalk.white('Usage Trend:'), chalk.cyan(simulation.trends.usageTrend));
    console.log(chalk.white('Efficiency Trend:'), chalk.cyan(simulation.trends.efficiencyTrend));
  }

  // Monthly Breakdown
  console.log(chalk.yellow.bold('\n📅 Monthly Breakdown'));
  console.log(chalk.gray('─'.repeat(50)));
  
  simulation.monthlyBreakdown.forEach((month: any) => {
    const costColor = month.costDifference > 0 ? chalk.red : chalk.green;
    console.log(chalk.white(`\n${month.month}:`));
    console.log(chalk.gray(`   Historical: $${month.historical.toFixed(4)}`));
    console.log(chalk.gray(`   Simulated: $${month.simulated.toFixed(4)}`));
    console.log(chalk.gray(`   Difference: ${costColor(`$${month.costDifference.toFixed(4)}`)}`));
  });

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}
