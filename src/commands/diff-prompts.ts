import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function diffPromptsCommand(program: Command) {
  const diffGroup = program
    .command('diff-prompts')
    .description('🔍 Compare multiple prompts for behavioral drift and cost analysis');

  // Main diff-prompts command
  diffGroup
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export diff data to file')
    .option('-v, --verbose', 'Show detailed diff information')
    .action(async (options) => {
      try {
        await handleDiffPrompts(options);
      } catch (error) {
        logger.error('Diff prompts command failed:', error);
        process.exit(1);
      }
    });

  // Compare prompts by IDs
  diffGroup
    .command('ids')
    .description('🔍 Compare prompts by their IDs')
    .option('-i, --ids <ids>', 'Comma-separated list of prompt IDs')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export diff data to file')
    .option('-v, --verbose', 'Show detailed diff information')
    .option('--include-semantic', 'Include semantic similarity analysis')
    .option('--include-optimization', 'Include optimization suggestions')
    .option('--include-behavioral', 'Include behavioral drift analysis')
    .action(async (options) => {
      try {
        await handleDiffPromptsByIds(options);
      } catch (error) {
        logger.error('Diff prompts by IDs failed:', error);
        process.exit(1);
      }
    });

  // Compare prompts by content
  diffGroup
    .command('content')
    .description('🔍 Compare prompts by their content')
    .option('-p, --prompts <prompts>', 'Comma-separated list of prompts')
    .option('-f, --files <files>', 'Comma-separated list of prompt files')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export diff data to file')
    .option('-v, --verbose', 'Show detailed diff information')
    .option('--include-semantic', 'Include semantic similarity analysis')
    .option('--include-optimization', 'Include optimization suggestions')
    .option('--include-behavioral', 'Include behavioral drift analysis')
    .action(async (options) => {
      try {
        await handleDiffPromptsByContent(options);
      } catch (error) {
        logger.error('Diff prompts by content failed:', error);
        process.exit(1);
      }
    });

  // Compare prompts by model
  diffGroup
    .command('model <modelName>')
    .description('🤖 Compare prompts for a specific model')
    .option('-d, --days <days>', 'Number of days to look back', '7')
    .option('-n, --number <count>', 'Number of prompts to compare', '5')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export diff data to file')
    .option('-v, --verbose', 'Show detailed diff information')
    .option('--include-semantic', 'Include semantic similarity analysis')
    .option('--include-optimization', 'Include optimization suggestions')
    .option('--include-behavioral', 'Include behavioral drift analysis')
    .action(async (modelName, options) => {
      try {
        await handleDiffPromptsByModel(modelName, options);
      } catch (error) {
        logger.error('Diff prompts by model failed:', error);
        process.exit(1);
      }
    });

  // Compare prompts by project
  diffGroup
    .command('project <projectName>')
    .description('📁 Compare prompts for a specific project')
    .option('-d, --days <days>', 'Number of days to look back', '7')
    .option('-n, --number <count>', 'Number of prompts to compare', '5')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export diff data to file')
    .option('-v, --verbose', 'Show detailed diff information')
    .option('--include-semantic', 'Include semantic similarity analysis')
    .option('--include-optimization', 'Include optimization suggestions')
    .option('--include-behavioral', 'Include behavioral drift analysis')
    .action(async (projectName, options) => {
      try {
        await handleDiffPromptsByProject(projectName, options);
      } catch (error) {
        logger.error('Diff prompts by project failed:', error);
        process.exit(1);
      }
    });
}

async function handleDiffPrompts(_options: any) {
  console.log(chalk.cyan.bold('\n🔍 Prompt Comparison & Behavioral Analysis'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  
  console.log(chalk.yellow('Available commands:'));
  console.log(chalk.white('  costkatana diff-prompts ids                    Compare prompts by IDs'));
  console.log(chalk.white('  costkatana diff-prompts content                Compare prompts by content'));
  console.log(chalk.white('  costkatana diff-prompts model <name>           Compare prompts for a model'));
  console.log(chalk.white('  costkatana diff-prompts project <name>         Compare prompts for a project'));
  
  console.log(chalk.gray('\nExamples:'));
  console.log(chalk.white('  costkatana diff-prompts ids --ids prompt-38271,prompt-38272'));
  console.log(chalk.white('  costkatana diff-prompts content --prompts "Hello","Hi there"'));
  console.log(chalk.white('  costkatana diff-prompts model gpt-4 --number 10'));
  console.log(chalk.white('  costkatana diff-prompts project my-project --verbose'));
  
  console.log(chalk.gray('\nComparison Analysis:'));
  console.log(chalk.white('  • Side-by-side token & cost comparison'));
  console.log(chalk.white('  • Semantic similarity score'));
  console.log(chalk.white('  • Latency delta analysis'));
  console.log(chalk.white('  • Behavioral drift detection'));
  console.log(chalk.white('  • Optimization suggestions'));
  console.log(chalk.white('  • Performance trend analysis'));
  
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleDiffPromptsByIds(options: any) {
  logger.info('🔍 Comparing prompts by IDs...');

  try {
    if (!options.ids) {
      console.log(chalk.red.bold('\n❌ No prompt IDs provided'));
      console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.yellow('Please provide prompt IDs:'));
      console.log(chalk.white('  • --ids prompt-38271,prompt-38272'));
      console.log(chalk.white('  • --ids "prompt-38271, prompt-38272, prompt-38273"'));
      console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
      return;
    }

    const promptIds = options.ids.split(',').map((id: string) => id.trim());
    if (promptIds.length < 2) {
      console.log(chalk.red.bold('\n❌ At least 2 prompt IDs required for comparison'));
      console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
      return;
    }

    const diffData = await getPromptDiffByIds(promptIds, options);
    displayPromptDiffResult(diffData, options);
  } catch (error) {
    logger.error('Failed to compare prompts by IDs:', error);
    process.exit(1);
  }
}

async function getPromptDiffByIds(promptIds: string[], options: any) {
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
    params.append('ids', promptIds.join(','));
    if (options.includeSemantic) params.append('includeSemantic', 'true');
    if (options.includeOptimization) params.append('includeOptimization', 'true');
    if (options.includeBehavioral) params.append('includeBehavioral', 'true');

    const response = await axios.get(`${baseUrl}/api/diff/prompts/ids?${params}`, {
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

function displayPromptDiffResult(diff: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(diff, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Prompt ID,Model,Tokens,Cost,Latency,Similarity Score,Behavioral Drift');
    diff.prompts.forEach((prompt: any) => {
      console.log(`"${prompt.promptId}","${prompt.model}","${prompt.totalTokens}","${prompt.cost}","${prompt.latency}","${prompt.similarityScore || 'N/A'}","${prompt.behavioralDrift || 'N/A'}"`);
    });
    return;
  }

  console.log(chalk.cyan.bold('\n🔍 Prompt Comparison Analysis'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Summary Statistics
  console.log(chalk.yellow.bold('\n📊 Summary Statistics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Total Prompts:'), chalk.cyan(diff.prompts.length));
  console.log(chalk.white('Average Cost:'), chalk.green(`$${(diff.prompts.reduce((sum: number, p: any) => sum + p.cost, 0) / diff.prompts.length).toFixed(4)}`));
  console.log(chalk.white('Average Tokens:'), chalk.cyan(Math.round(diff.prompts.reduce((sum: number, p: any) => sum + p.totalTokens, 0) / diff.prompts.length)));
  console.log(chalk.white('Average Latency:'), chalk.cyan(`${Math.round(diff.prompts.reduce((sum: number, p: any) => sum + p.latency, 0) / diff.prompts.length)}ms`));

  // Side-by-side Comparison
  console.log(chalk.yellow.bold('\n📋 Side-by-side Comparison'));
  console.log(chalk.gray('─'.repeat(50)));
  
  diff.prompts.forEach((prompt: any, index: number) => {
    console.log(chalk.white(`\n${index + 1}. ${prompt.promptId}`));
    console.log(chalk.gray('   ─'.repeat(40)));
    
    console.log(chalk.white('   🧠 Model:'), chalk.cyan(prompt.model));
    console.log(chalk.white('   🔢 Tokens:'), chalk.cyan(prompt.totalTokens));
    console.log(chalk.white('   💰 Cost:'), chalk.green(`$${prompt.cost.toFixed(4)}`));
    console.log(chalk.white('   ⏱️  Latency:'), chalk.cyan(`${prompt.latency}ms`));
    
    if (prompt.similarityScore !== undefined) {
      const similarityColor = prompt.similarityScore > 0.8 ? chalk.green : prompt.similarityScore > 0.6 ? chalk.yellow : chalk.red;
      console.log(chalk.white('   🎯 Similarity:'), similarityColor(`${(prompt.similarityScore * 100).toFixed(1)}%`));
    }
    
    if (prompt.behavioralDrift !== undefined) {
      const driftColor = prompt.behavioralDrift < 0.1 ? chalk.green : prompt.behavioralDrift < 0.3 ? chalk.yellow : chalk.red;
      console.log(chalk.white('   📈 Behavioral Drift:'), driftColor(`${(prompt.behavioralDrift * 100).toFixed(1)}%`));
    }
    
    if (options.verbose && prompt.prompt) {
      console.log(chalk.white('   📝 Prompt:'));
      console.log(chalk.gray(`   ${prompt.prompt.substring(0, 150)}${prompt.prompt.length > 150 ? '...' : ''}`));
    }
  });

  // Cost Analysis
  if (diff.costAnalysis) {
    console.log(chalk.yellow.bold('\n💰 Cost Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('Cost Range:'), chalk.cyan(`$${diff.costAnalysis.min.toFixed(4)} - $${diff.costAnalysis.max.toFixed(4)}`));
    console.log(chalk.white('Cost Variance:'), chalk.cyan(`$${diff.costAnalysis.variance.toFixed(4)}`));
    console.log(chalk.white('Cost Trend:'), chalk.cyan(diff.costAnalysis.trend));
    if (diff.costAnalysis.optimizationPotential) {
      console.log(chalk.white('Optimization Potential:'), chalk.green(`${(diff.costAnalysis.optimizationPotential * 100).toFixed(1)}%`));
    }
  }

  // Latency Analysis
  if (diff.latencyAnalysis) {
    console.log(chalk.yellow.bold('\n⏱️  Latency Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('Latency Range:'), chalk.cyan(`${diff.latencyAnalysis.min}ms - ${diff.latencyAnalysis.max}ms`));
    console.log(chalk.white('Latency Variance:'), chalk.cyan(`${diff.latencyAnalysis.variance.toFixed(0)}ms`));
    console.log(chalk.white('Latency Trend:'), chalk.cyan(diff.latencyAnalysis.trend));
  }

  // Semantic Similarity Analysis
  if (options.includeSemantic && diff.semanticAnalysis) {
    console.log(chalk.yellow.bold('\n🧠 Semantic Similarity Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('Average Similarity:'), chalk.cyan(`${(diff.semanticAnalysis.averageSimilarity * 100).toFixed(1)}%`));
    console.log(chalk.white('Similarity Range:'), chalk.cyan(`${(diff.semanticAnalysis.minSimilarity * 100).toFixed(1)}% - ${(diff.semanticAnalysis.maxSimilarity * 100).toFixed(1)}%`));
    console.log(chalk.white('Clustering:'), chalk.cyan(diff.semanticAnalysis.clustering || 'N/A'));
  }

  // Behavioral Drift Analysis
  if (options.includeBehavioral && diff.behavioralAnalysis) {
    console.log(chalk.yellow.bold('\n📈 Behavioral Drift Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('Average Drift:'), chalk.cyan(`${(diff.behavioralAnalysis.averageDrift * 100).toFixed(1)}%`));
    console.log(chalk.white('Drift Trend:'), chalk.cyan(diff.behavioralAnalysis.trend));
    console.log(chalk.white('Anomaly Detection:'), chalk.cyan(diff.behavioralAnalysis.anomalies?.length || 0, 'anomalies detected'));
    
    if (diff.behavioralAnalysis.recommendations) {
      console.log(chalk.white('Recommendations:'));
      diff.behavioralAnalysis.recommendations.forEach((rec: any, index: number) => {
        console.log(chalk.gray(`   ${index + 1}. ${rec}`));
      });
    }
  }

  // Optimization Suggestions
  if (options.includeOptimization && diff.optimizationSuggestions) {
    console.log(chalk.yellow.bold('\n🔧 Optimization Suggestions'));
    console.log(chalk.gray('─'.repeat(50)));
    diff.optimizationSuggestions.forEach((suggestion: any, index: number) => {
      console.log(chalk.white(`${index + 1}. ${suggestion.type}:`));
      console.log(chalk.gray(`   ${suggestion.description}`));
      if (suggestion.estimatedSavings) {
        console.log(chalk.gray(`   Estimated Savings: ${suggestion.estimatedSavings}`));
      }
      if (suggestion.implementation) {
        console.log(chalk.gray(`   Implementation: ${suggestion.implementation}`));
      }
    });
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleDiffPromptsByContent(options: any) {
  logger.info('🔍 Comparing prompts by content...');

  try {
    let prompts: string[] = [];
    
    if (options.prompts) {
      prompts = options.prompts.split(',').map((p: string) => p.trim());
    } else if (options.files) {
      const fs = require('fs');
      const files = options.files.split(',').map((f: string) => f.trim());
      prompts = files.map((file: string) => fs.readFileSync(file, 'utf8'));
    } else {
      console.log(chalk.red.bold('\n❌ No prompt content provided'));
      console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.yellow('Please provide either:'));
      console.log(chalk.white('  • --prompts "prompt1,prompt2,prompt3"'));
      console.log(chalk.white('  • --files "file1.txt,file2.txt,file3.txt"'));
      console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
      return;
    }

    if (prompts.length < 2) {
      console.log(chalk.red.bold('\n❌ At least 2 prompts required for comparison'));
      console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
      return;
    }

    const diffData = await getPromptDiffByContent(prompts, options);
    displayPromptDiffResult(diffData, options);
  } catch (error) {
    logger.error('Failed to compare prompts by content:', error);
    process.exit(1);
  }
}

async function getPromptDiffByContent(prompts: string[], options: any) {
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
    if (options.includeSemantic) params.append('includeSemantic', 'true');
    if (options.includeOptimization) params.append('includeOptimization', 'true');
    if (options.includeBehavioral) params.append('includeBehavioral', 'true');

    const response = await axios.post(`${baseUrl}/api/diff/prompts/content?${params}`, {
      prompts: prompts
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

async function handleDiffPromptsByModel(modelName: string, options: any) {
  logger.info(`🤖 Comparing prompts for model: ${modelName}`);

  try {
    const days = parseInt(options.days) || 7;
    const count = parseInt(options.number) || 5;
    const diffData = await getPromptDiffByModel(modelName, days, count, options);
    displayPromptDiffResult(diffData, options);
  } catch (error) {
    logger.error('Failed to compare model prompts:', error);
    process.exit(1);
  }
}

async function getPromptDiffByModel(modelName: string, days: number, count: number, options: any) {
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
    params.append('model', modelName);
    params.append('days', days.toString());
    params.append('count', count.toString());
    if (options.includeSemantic) params.append('includeSemantic', 'true');
    if (options.includeOptimization) params.append('includeOptimization', 'true');
    if (options.includeBehavioral) params.append('includeBehavioral', 'true');

    const response = await axios.get(`${baseUrl}/api/diff/prompts/model?${params}`, {
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

async function handleDiffPromptsByProject(projectName: string, options: any) {
  logger.info(`📁 Comparing prompts for project: ${projectName}`);

  try {
    const days = parseInt(options.days) || 7;
    const count = parseInt(options.number) || 5;
    const diffData = await getPromptDiffByProject(projectName, days, count, options);
    displayPromptDiffResult(diffData, options);
  } catch (error) {
    logger.error('Failed to compare project prompts:', error);
    process.exit(1);
  }
}

async function getPromptDiffByProject(projectName: string, days: number, count: number, options: any) {
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
    params.append('project', projectName);
    params.append('days', days.toString());
    params.append('count', count.toString());
    if (options.includeSemantic) params.append('includeSemantic', 'true');
    if (options.includeOptimization) params.append('includeOptimization', 'true');
    if (options.includeBehavioral) params.append('includeBehavioral', 'true');

    const response = await axios.get(`${baseUrl}/api/diff/prompts/project?${params}`, {
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
