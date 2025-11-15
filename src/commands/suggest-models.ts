import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function suggestModelsCommand(program: Command) {
  const suggestGroup = program
    .command('suggest-models')
    .description('🧠 Suggest more cost-efficient models based on your prompt/task and usage patterns');

  // Main suggest-models command
  suggestGroup
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export suggestions data to file')
    .option('-v, --verbose', 'Show detailed model analysis')
    .action(async (options) => {
      try {
        await handleSuggestModels(options);
      } catch (error) {
        logger.error('Suggest models command failed:', error);
        process.exit(1);
      }
    });

  // Suggest by prompt
  suggestGroup
    .command('prompt <prompt>')
    .description('🧠 Suggest models based on a specific prompt')
    .option('--task <task>', 'Task type (summarization, qa, extraction, classification, generation, translation)', 'auto')
    .option('--priority <priority>', 'Priority (cost, quality, speed, carbon, balanced)', 'balanced')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export suggestions data to file')
    .option('-v, --verbose', 'Show detailed model analysis')
    .option('--include-current', 'Include current model in comparison')
    .option('--include-fallbacks', 'Include fallback model suggestions')
    .option('--include-carbon', 'Include carbon footprint analysis')
    .action(async (prompt, options) => {
      try {
        await handleSuggestModelsByPrompt(prompt, options);
      } catch (error) {
        logger.error('Suggest models by prompt failed:', error);
        process.exit(1);
      }
    });

  // Suggest by task type
  suggestGroup
    .command('task <taskType>')
    .description('🧠 Suggest models for a specific task type')
    .option('--priority <priority>', 'Priority (cost, quality, speed, carbon, balanced)', 'balanced')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export suggestions data to file')
    .option('-v, --verbose', 'Show detailed model analysis')
    .option('--include-usage', 'Include usage pattern analysis')
    .option('--include-benchmarks', 'Include performance benchmarks')
    .action(async (taskType, options) => {
      try {
        await handleSuggestModelsByTask(taskType, options);
      } catch (error) {
        logger.error('Suggest models by task failed:', error);
        process.exit(1);
      }
    });

  // Suggest by usage patterns
  suggestGroup
    .command('usage')
    .description('🧠 Suggest models based on your usage patterns')
    .option('-r, --range <range>', 'Time range (7d, 30d, 90d)', '30d')
    .option('--priority <priority>', 'Priority (cost, quality, speed, carbon, balanced)', 'balanced')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export suggestions data to file')
    .option('-v, --verbose', 'Show detailed model analysis')
    .option('--include-savings', 'Include potential cost savings')
    .option('--include-migration', 'Include migration recommendations')
    .action(async (options) => {
      try {
        await handleSuggestModelsByUsage(options);
      } catch (error) {
        logger.error('Suggest models by usage failed:', error);
        process.exit(1);
      }
    });

  // Suggest by cost optimization
  suggestGroup
    .command('cost')
    .description('🧠 Suggest models for maximum cost optimization')
    .option('--budget <budget>', 'Monthly budget constraint')
    .option('--quality-threshold <threshold>', 'Minimum quality threshold (0.0-1.0)', '0.7')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export suggestions data to file')
    .option('-v, --verbose', 'Show detailed cost analysis')
    .option('--include-roi', 'Include ROI analysis')
    .option('--include-breakdown', 'Include detailed cost breakdown')
    .action(async (options) => {
      try {
        await handleSuggestModelsByCost(options);
      } catch (error) {
        logger.error('Suggest models by cost failed:', error);
        process.exit(1);
      }
    });

  // Model comparison
  suggestGroup
    .command('compare <model1> <model2>')
    .description('🧠 Compare two specific models')
    .option('--prompt <prompt>', 'Test prompt for comparison')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export comparison data to file')
    .option('-v, --verbose', 'Show detailed comparison')
    .option('--include-benchmarks', 'Include performance benchmarks')
    .option('--include-real-world', 'Include real-world usage data')
    .action(async (model1, model2, options) => {
      try {
        await handleCompareModels(model1, model2, options);
      } catch (error) {
        logger.error('Compare models failed:', error);
        process.exit(1);
      }
    });
}

async function handleSuggestModels(_options: any) {
  console.log(chalk.cyan.bold('\n🧠 Model Suggestion & Cost Optimization'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  
  console.log(chalk.yellow('Available commands:'));
  console.log(chalk.white('  costkatana suggest-models prompt <prompt>     Suggest based on specific prompt'));
  console.log(chalk.white('  costkatana suggest-models task <taskType>     Suggest for specific task type'));
  console.log(chalk.white('  costkatana suggest-models usage               Suggest based on usage patterns'));
  console.log(chalk.white('  costkatana suggest-models cost                Suggest for cost optimization'));
  console.log(chalk.white('  costkatana suggest-models compare <m1> <m2>  Compare two specific models'));
  
  console.log(chalk.gray('\nExamples:'));
  console.log(chalk.white('  costkatana suggest-models prompt "Summarize a 5-page contract"'));
  console.log(chalk.white('  costkatana suggest-models task summarization --priority cost'));
  console.log(chalk.white('  costkatana suggest-models usage --range 30d'));
  console.log(chalk.white('  costkatana suggest-models cost --budget 1000'));
  console.log(chalk.white('  costkatana suggest-models compare gpt-4 claude-3-sonnet'));
  
  console.log(chalk.gray('\nTask Types:'));
  console.log(chalk.white('  • summarization - Text summarization tasks'));
  console.log(chalk.white('  • qa - Question answering and chat'));
  console.log(chalk.white('  • extraction - Information extraction'));
  console.log(chalk.white('  • classification - Text classification'));
  console.log(chalk.white('  • generation - Content generation'));
  console.log(chalk.white('  • translation - Language translation'));
  console.log(chalk.white('  • auto - Automatic task detection'));
  
  console.log(chalk.gray('\nPriorities:'));
  console.log(chalk.white('  • cost - Maximum cost savings'));
  console.log(chalk.white('  • quality - Best output quality'));
  console.log(chalk.white('  • speed - Fastest response time'));
  console.log(chalk.white('  • carbon - Lowest environmental impact'));
  console.log(chalk.white('  • balanced - Balanced optimization'));
  
  console.log(chalk.gray('\nSuggestion Features:'));
  console.log(chalk.white('  • Top 3 equivalent models by cost/token'));
  console.log(chalk.white('  • Output quality estimates'));
  console.log(chalk.white('  • Latency & carbon trade-offs'));
  console.log(chalk.white('  • Smart fallback suggestions'));
  console.log(chalk.white('  • Migration recommendations'));
  console.log(chalk.white('  • ROI analysis'));
  
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleSuggestModelsByPrompt(prompt: string, options: any) {
  logger.info(`🧠 Suggesting models for prompt: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`);

  try {
    const suggestions = await getSuggestionsByPrompt(prompt, options);
    displayModelSuggestions(suggestions, options);
  } catch (error) {
    logger.error('Failed to get model suggestions by prompt:', error);
    process.exit(1);
  }
}

async function getSuggestionsByPrompt(prompt: string, options: any) {
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
    params.append('prompt', prompt);
    params.append('task', options.task || 'auto');
    params.append('priority', options.priority || 'balanced');
    if (options.includeCurrent) params.append('includeCurrent', 'true');
    if (options.includeFallbacks) params.append('includeFallbacks', 'true');
    if (options.includeCarbon) params.append('includeCarbon', 'true');

    const response = await axios.post(`${baseUrl}/api/suggest-models/prompt?${params}`, {
      prompt: prompt,
      task: options.task || 'auto',
      priority: options.priority || 'balanced'
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

function displayModelSuggestions(suggestions: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(suggestions, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Rank,Model,Provider,Cost/Token,Quality Score,Speed Score,Carbon Score,Recommendation');
    suggestions.recommendations.forEach((rec: any, index: number) => {
      console.log(`"${index + 1}","${rec.model}","${rec.provider}","${rec.costPerToken}","${rec.qualityScore}","${rec.speedScore}","${rec.carbonScore}","${rec.recommendation}"`);
    });
    return;
  }

  console.log(chalk.cyan.bold('\n🧠 Model Suggestions'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Task Analysis
  if (suggestions.taskAnalysis) {
    console.log(chalk.yellow.bold('\n📋 Task Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('Detected Task:'), chalk.cyan(suggestions.taskAnalysis.detectedTask));
    console.log(chalk.white('Confidence:'), chalk.cyan(`${(suggestions.taskAnalysis.confidence * 100).toFixed(1)}%`));
    console.log(chalk.white('Complexity:'), chalk.cyan(suggestions.taskAnalysis.complexity));
    console.log(chalk.white('Estimated Tokens:'), chalk.cyan(suggestions.taskAnalysis.estimatedTokens.toLocaleString()));
  }

  // Top Recommendations
  console.log(chalk.yellow.bold('\n🏆 Top Recommendations'));
  console.log(chalk.gray('─'.repeat(50)));

  suggestions.recommendations.forEach((rec: any, index: number) => {
    const rankColor = index === 0 ? chalk.green : index === 1 ? chalk.yellow : chalk.blue;
    console.log(chalk.white(`\n${index + 1}. ${rec.model}`));
    console.log(chalk.gray('   ─'.repeat(40)));
    
    // Basic Info
    console.log(chalk.white('   Provider:'), chalk.cyan(rec.provider));
    console.log(chalk.white('   Cost/Token:'), chalk.cyan(`$${rec.costPerToken.toFixed(6)}`));
    
    // Scores
    const qualityColor = rec.qualityScore >= 0.8 ? chalk.green : 
                        rec.qualityScore >= 0.6 ? chalk.yellow : chalk.red;
    console.log(chalk.white('   Quality Score:'), qualityColor(rec.qualityScore.toFixed(3)));
    
    const speedColor = rec.speedScore >= 0.8 ? chalk.green : 
                      rec.speedScore >= 0.6 ? chalk.yellow : chalk.red;
    console.log(chalk.white('   Speed Score:'), speedColor(rec.speedScore.toFixed(3)));
    
    const carbonColor = rec.carbonScore <= 0.3 ? chalk.green : 
                       rec.carbonScore <= 0.6 ? chalk.yellow : chalk.red;
    console.log(chalk.white('   Carbon Score:'), carbonColor(rec.carbonScore.toFixed(3)));
    
    // Cost Analysis
    if (rec.costAnalysis) {
      console.log(chalk.white('   Estimated Cost:'), chalk.cyan(`$${rec.costAnalysis.estimatedCost.toFixed(4)}`));
      console.log(chalk.white('   Cost Savings:'), chalk.green(`${rec.costAnalysis.costSavings}%`));
    }
    
    // Recommendation
    console.log(chalk.white('   Recommendation:'), chalk.cyan(rec.recommendation));
    
    // Rank indicator
    console.log(rankColor(`   ${index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} ${index === 0 ? 'Best Choice' : index === 1 ? 'Good Alternative' : 'Consider'}`));
  });

  // Fallback Suggestions
  if (suggestions.fallbacks && suggestions.fallbacks.length > 0) {
    console.log(chalk.yellow.bold('\n🔄 Fallback Suggestions'));
    console.log(chalk.gray('─'.repeat(50)));
    suggestions.fallbacks.forEach((fallback: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${fallback.model}`));
      console.log(chalk.gray(`   Use case: ${fallback.useCase}`));
      console.log(chalk.gray(`   Trigger: ${fallback.trigger}`));
      console.log(chalk.gray(`   Reliability: ${fallback.reliability}`));
    });
  }

  // Cost Comparison
  if (suggestions.costComparison) {
    console.log(chalk.yellow.bold('\n💰 Cost Comparison'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('Current Model:'), chalk.cyan(suggestions.costComparison.currentModel));
    console.log(chalk.white('Current Cost:'), chalk.cyan(`$${suggestions.costComparison.currentCost.toFixed(4)}`));
    console.log(chalk.white('Recommended Cost:'), chalk.green(`$${suggestions.costComparison.recommendedCost.toFixed(4)}`));
    console.log(chalk.white('Potential Savings:'), chalk.green(`$${suggestions.costComparison.potentialSavings.toFixed(4)}`));
    console.log(chalk.white('Savings Percentage:'), chalk.green(`${suggestions.costComparison.savingsPercentage}%`));
  }

  // Quality vs Cost Trade-offs
  if (suggestions.tradeoffs) {
    console.log(chalk.yellow.bold('\n⚖️  Quality vs Cost Trade-offs'));
    console.log(chalk.gray('─'.repeat(50)));
    suggestions.tradeoffs.forEach((tradeoff: any) => {
      console.log(chalk.white(`\n${tradeoff.model}:`));
      console.log(chalk.gray(`  Quality Impact: ${tradeoff.qualityImpact}`));
      console.log(chalk.gray(`  Cost Savings: ${tradeoff.costSavings}%`));
      console.log(chalk.gray(`  Recommendation: ${tradeoff.recommendation}`));
    });
  }

  // Carbon Analysis
  if (suggestions.carbonAnalysis) {
    console.log(chalk.yellow.bold('\n🌱 Carbon Footprint Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('Current Carbon Impact:'), chalk.cyan(`${suggestions.carbonAnalysis.currentCarbon}g CO2`));
    console.log(chalk.white('Recommended Carbon Impact:'), chalk.green(`${suggestions.carbonAnalysis.recommendedCarbon}g CO2`));
    console.log(chalk.white('Carbon Reduction:'), chalk.green(`${suggestions.carbonAnalysis.carbonReduction}%`));
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleSuggestModelsByTask(taskType: string, options: any) {
  logger.info(`🧠 Suggesting models for task type: ${taskType}`);

  try {
    const suggestions = await getSuggestionsByTask(taskType, options);
    displayModelSuggestions(suggestions, options);
  } catch (error) {
    logger.error('Failed to get model suggestions by task:', error);
    process.exit(1);
  }
}

async function getSuggestionsByTask(taskType: string, options: any) {
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
    params.append('taskType', taskType);
    params.append('priority', options.priority || 'balanced');
    if (options.includeUsage) params.append('includeUsage', 'true');
    if (options.includeBenchmarks) params.append('includeBenchmarks', 'true');

    const response = await axios.get(`${baseUrl}/api/suggest-models/task?${params}`, {
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

async function handleSuggestModelsByUsage(options: any) {
  logger.info(`🧠 Suggesting models based on usage patterns for range: ${options.range || '30d'}`);

  try {
    const range = options.range || '30d';
    const suggestions = await getSuggestionsByUsage(range, options);
    displayModelSuggestions(suggestions, options);
  } catch (error) {
    logger.error('Failed to get model suggestions by usage:', error);
    process.exit(1);
  }
}

async function getSuggestionsByUsage(range: string, options: any) {
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
    params.append('range', range);
    params.append('priority', options.priority || 'balanced');
    if (options.includeSavings) params.append('includeSavings', 'true');
    if (options.includeMigration) params.append('includeMigration', 'true');

    const response = await axios.get(`${baseUrl}/api/suggest-models/usage?${params}`, {
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

async function handleSuggestModelsByCost(options: any) {
  logger.info('🧠 Suggesting models for maximum cost optimization...');

  try {
    const suggestions = await getSuggestionsByCost(options);
    displayModelSuggestions(suggestions, options);
  } catch (error) {
    logger.error('Failed to get model suggestions by cost:', error);
    process.exit(1);
  }
}

async function getSuggestionsByCost(options: any) {
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
    if (options.budget) params.append('budget', options.budget);
    if (options.qualityThreshold) params.append('qualityThreshold', options.qualityThreshold);
    if (options.includeRoi) params.append('includeRoi', 'true');
    if (options.includeBreakdown) params.append('includeBreakdown', 'true');

    const response = await axios.get(`${baseUrl}/api/suggest-models/cost?${params}`, {
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

async function handleCompareModels(model1: string, model2: string, options: any) {
  logger.info(`🧠 Comparing models: ${model1} vs ${model2}`);

  try {
    const comparison = await getModelComparison(model1, model2, options);
    displayModelComparison(comparison, options);
  } catch (error) {
    logger.error('Failed to compare models:', error);
    process.exit(1);
  }
}

async function getModelComparison(model1: string, model2: string, options: any) {
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
    params.append('model1', model1);
    params.append('model2', model2);
    if (options.prompt) params.append('prompt', options.prompt);
    if (options.includeBenchmarks) params.append('includeBenchmarks', 'true');
    if (options.includeRealWorld) params.append('includeRealWorld', 'true');

    const response = await axios.get(`${baseUrl}/api/suggest-models/compare?${params}`, {
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
  } else if (format === 'csv') {
    console.log('Metric,Model1,Model2,Difference,Recommendation');
    Object.entries(comparison.metrics).forEach(([metric, data]: [string, any]) => {
      console.log(`"${metric}","${data.model1}","${data.model2}","${data.difference}","${data.recommendation}"`);
    });
    return;
  }

  console.log(chalk.cyan.bold(`\n🧠 Model Comparison: ${comparison.model1} vs ${comparison.model2}`));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Head-to-head comparison
  console.log(chalk.yellow.bold('\n📊 Head-to-Head Comparison'));
  console.log(chalk.gray('─'.repeat(50)));

  Object.entries(comparison.metrics).forEach(([metric, data]: [string, any]) => {
    console.log(chalk.white(`\n${metric}:`));
    
    const model1Color = data.model1 > data.model2 ? chalk.green : data.model1 < data.model2 ? chalk.red : chalk.yellow;
    const model2Color = data.model2 > data.model1 ? chalk.green : data.model2 < data.model1 ? chalk.red : chalk.yellow;
    
    console.log(chalk.gray(`  ${comparison.model1}:`), model1Color(data.model1));
    console.log(chalk.gray(`  ${comparison.model2}:`), model2Color(data.model2));
    
    if (data.difference) {
      const diffColor = data.difference > 0 ? chalk.green : chalk.red;
      console.log(chalk.gray(`  Difference:`), diffColor(data.difference));
    }
    
    if (data.recommendation) {
      console.log(chalk.gray(`  Recommendation:`), chalk.cyan(data.recommendation));
    }
  });

  // Cost Analysis
  if (comparison.costAnalysis) {
    console.log(chalk.yellow.bold('\n💰 Cost Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white(`${comparison.model1} Cost:`), chalk.cyan(`$${comparison.costAnalysis.model1Cost.toFixed(6)}/token`));
    console.log(chalk.white(`${comparison.model2} Cost:`), chalk.cyan(`$${comparison.costAnalysis.model2Cost.toFixed(6)}/token`));
    console.log(chalk.white('Cost Difference:'), chalk.green(`${comparison.costAnalysis.costDifference}%`));
    console.log(chalk.white('Savings:'), chalk.green(`$${comparison.costAnalysis.savings.toFixed(4)}/1K tokens`));
  }

  // Performance Analysis
  if (comparison.performanceAnalysis) {
    console.log(chalk.yellow.bold('\n⚡ Performance Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white(`${comparison.model1} Speed:`), chalk.cyan(`${comparison.performanceAnalysis.model1Speed}ms`));
    console.log(chalk.white(`${comparison.model2} Speed:`), chalk.cyan(`${comparison.performanceAnalysis.model2Speed}ms`));
    console.log(chalk.white('Speed Difference:'), chalk.green(`${comparison.performanceAnalysis.speedDifference}%`));
  }

  // Quality Analysis
  if (comparison.qualityAnalysis) {
    console.log(chalk.yellow.bold('\n🎯 Quality Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white(`${comparison.model1} Quality:`), chalk.cyan(comparison.qualityAnalysis.model1Quality));
    console.log(chalk.white(`${comparison.model2} Quality:`), chalk.cyan(comparison.qualityAnalysis.model2Quality));
    console.log(chalk.white('Quality Difference:'), chalk.green(`${comparison.qualityAnalysis.qualityDifference}%`));
  }

  // Recommendation
  if (comparison.recommendation) {
    console.log(chalk.yellow.bold('\n💡 Recommendation'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.cyan(comparison.recommendation.summary));
    console.log(chalk.gray(`Reasoning: ${comparison.recommendation.reasoning}`));
    if (comparison.recommendation.useCase) {
      console.log(chalk.gray(`Best for: ${comparison.recommendation.useCase}`));
    }
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}
