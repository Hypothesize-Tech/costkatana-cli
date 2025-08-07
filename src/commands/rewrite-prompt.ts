import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function rewritePromptCommand(program: Command) {
  const rewriteGroup = program
    .command('rewrite-prompt')
    .description('✏️ Intelligently rewrite a prompt to be shorter or use fewer tokens');

  // Main rewrite-prompt command
  rewriteGroup
    .option('--prompt <text>', 'Original prompt to rewrite')
    .option('--style <style>', 'Rewrite style (short, concise, extractive)', 'concise')
    .option('--audience <audience>', 'Target audience (technical, business, general)', 'general')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export rewrite results to file')
    .option('-v, --verbose', 'Show detailed rewrite analysis')
    .option('--include-token-analysis', 'Include detailed token analysis')
    .option('--include-cost-analysis', 'Include detailed cost analysis')
    .option('--include-quality-assessment', 'Include quality assessment')
    .option('--include-alternatives', 'Include alternative rewrites')
    .action(async (options) => {
      try {
        await handleRewritePrompt(options);
      } catch (error) {
        logger.error('Rewrite prompt command failed:', error);
        process.exit(1);
      }
    });

  // Batch rewrite
  rewriteGroup
    .command('batch')
    .description('✏️ Rewrite multiple prompts in batch')
    .option('--file <path>', 'Text file with prompts to rewrite')
    .option('--style <style>', 'Rewrite style (short, concise, extractive)', 'concise')
    .option('--audience <audience>', 'Target audience (technical, business, general)', 'general')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export batch results to file')
    .option('-v, --verbose', 'Show detailed batch analysis')
    .option('--include-token-analysis', 'Include detailed token analysis')
    .option('--include-cost-analysis', 'Include detailed cost analysis')
    .option('--include-quality-assessment', 'Include quality assessment')
    .action(async (options) => {
      try {
        await handleBatchRewrite(options);
      } catch (error) {
        logger.error('Batch rewrite failed:', error);
        process.exit(1);
      }
    });

  // Style-specific rewrite
  rewriteGroup
    .command('style <style>')
    .description('✏️ Rewrite prompt with specific style')
    .option('--prompt <text>', 'Original prompt to rewrite')
    .option('--audience <audience>', 'Target audience (technical, business, general)', 'general')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export style results to file')
    .option('-v, --verbose', 'Show detailed style analysis')
    .option('--include-token-analysis', 'Include detailed token analysis')
    .option('--include-cost-analysis', 'Include detailed cost analysis')
    .option('--include-quality-assessment', 'Include quality assessment')
    .action(async (style, options) => {
      try {
        await handleStyleRewrite(style, options);
      } catch (error) {
        logger.error('Style rewrite failed:', error);
        process.exit(1);
      }
    });

  // Audience-specific rewrite
  rewriteGroup
    .command('audience <audience>')
    .description('✏️ Rewrite prompt for specific audience')
    .option('--prompt <text>', 'Original prompt to rewrite')
    .option('--style <style>', 'Rewrite style (short, concise, extractive)', 'concise')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export audience results to file')
    .option('-v, --verbose', 'Show detailed audience analysis')
    .option('--include-token-analysis', 'Include detailed token analysis')
    .option('--include-cost-analysis', 'Include detailed cost analysis')
    .option('--include-quality-assessment', 'Include quality assessment')
    .action(async (audience, options) => {
      try {
        await handleAudienceRewrite(audience, options);
      } catch (error) {
        logger.error('Audience rewrite failed:', error);
        process.exit(1);
      }
    });

  // Compare different styles
  rewriteGroup
    .command('compare')
    .description('✏️ Compare different rewrite styles')
    .option('--prompt <text>', 'Original prompt to rewrite')
    .option('--styles <styles>', 'Comma-separated styles to compare')
    .option('--audience <audience>', 'Target audience (technical, business, general)', 'general')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export comparison results to file')
    .option('-v, --verbose', 'Show detailed comparison analysis')
    .option('--include-token-analysis', 'Include detailed token analysis')
    .option('--include-cost-analysis', 'Include detailed cost analysis')
    .option('--include-quality-assessment', 'Include quality assessment')
    .action(async (options) => {
      try {
        await handleStyleComparison(options);
      } catch (error) {
        logger.error('Style comparison failed:', error);
        process.exit(1);
      }
    });

  // Optimize for specific model
  rewriteGroup
    .command('optimize')
    .description('✏️ Optimize prompt for specific model')
    .option('--prompt <text>', 'Original prompt to rewrite')
    .option('--model <model>', 'Target model for optimization')
    .option('--style <style>', 'Rewrite style (short, concise, extractive)', 'concise')
    .option('--audience <audience>', 'Target audience (technical, business, general)', 'general')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export optimization results to file')
    .option('-v, --verbose', 'Show detailed optimization analysis')
    .option('--include-token-analysis', 'Include detailed token analysis')
    .option('--include-cost-analysis', 'Include detailed cost analysis')
    .option('--include-quality-assessment', 'Include quality assessment')
    .action(async (options) => {
      try {
        await handleModelOptimization(options);
      } catch (error) {
        logger.error('Model optimization failed:', error);
        process.exit(1);
      }
    });
}

async function handleRewritePrompt(options: any) {
  logger.info('✏️ Rewriting prompt...');

  try {
    const rewrite = await rewritePrompt(options);
    displayRewriteResults(rewrite, options);
  } catch (error) {
    logger.error('Failed to rewrite prompt:', error);
    process.exit(1);
  }
}

async function rewritePrompt(options: any) {
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
    if (options.prompt) params.append('prompt', options.prompt);
    params.append('style', options.style || 'concise');
    params.append('audience', options.audience || 'general');
    if (options.includeTokenAnalysis) params.append('includeTokenAnalysis', 'true');
    if (options.includeCostAnalysis) params.append('includeCostAnalysis', 'true');
    if (options.includeQualityAssessment) params.append('includeQualityAssessment', 'true');
    if (options.includeAlternatives) params.append('includeAlternatives', 'true');

    const response = await axios.post(`${baseUrl}/api/rewrite-prompt?${params}`, {
      prompt: options.prompt,
      style: options.style || 'concise',
      audience: options.audience || 'general',
      options: {
        includeTokenAnalysis: options.includeTokenAnalysis,
        includeCostAnalysis: options.includeCostAnalysis,
        includeQualityAssessment: options.includeQualityAssessment,
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

function displayRewriteResults(rewrite: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(rewrite, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Original,Rewritten,Token Delta,Cost Savings,Quality Score');
    console.log(`"${rewrite.original}","${rewrite.rewritten}","${rewrite.tokenDelta}","${rewrite.costSavings}","${rewrite.qualityScore}"`);
    return;
  }

  console.log(chalk.cyan.bold('\n✏️ Prompt Rewrite Results'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Original vs Rewritten
  console.log(chalk.yellow.bold('\n📝 Original vs Rewritten'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Original:'), chalk.gray(rewrite.original));
  console.log(chalk.white('Rewritten:'), chalk.cyan(rewrite.rewritten));
  console.log(chalk.white('Style:'), chalk.cyan(rewrite.style));
  console.log(chalk.white('Audience:'), chalk.cyan(rewrite.audience));

  // Token Analysis
  console.log(chalk.yellow.bold('\n🔢 Token Analysis'));
  console.log(chalk.gray('─'.repeat(50)));
  
  const tokenColor = rewrite.tokenDelta < 0 ? chalk.green : chalk.red;
  console.log(chalk.white('Original Tokens:'), chalk.cyan(rewrite.originalTokens.toLocaleString()));
  console.log(chalk.white('Rewritten Tokens:'), chalk.cyan(rewrite.rewrittenTokens.toLocaleString()));
  console.log(chalk.white('Token Delta:'), tokenColor(`${rewrite.tokenDelta} tokens`));
  console.log(chalk.white('Token Reduction:'), chalk.green(`${rewrite.tokenReduction}%`));

  // Cost Analysis
  console.log(chalk.yellow.bold('\n💰 Cost Analysis'));
  console.log(chalk.gray('─'.repeat(50)));
  
  const costColor = rewrite.costSavings > 0 ? chalk.green : chalk.red;
  console.log(chalk.white('Original Cost:'), chalk.cyan(`$${rewrite.originalCost.toFixed(4)}`));
  console.log(chalk.white('Rewritten Cost:'), chalk.cyan(`$${rewrite.rewrittenCost.toFixed(4)}`));
  console.log(chalk.white('Cost Savings:'), costColor(`$${rewrite.costSavings.toFixed(4)}`));
  console.log(chalk.white('Cost Reduction:'), chalk.green(`${rewrite.costReduction}%`));

  // Quality Assessment
  if (rewrite.qualityAssessment) {
    console.log(chalk.yellow.bold('\n📊 Quality Assessment'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('Clarity Score:'), chalk.cyan(`${rewrite.qualityAssessment.clarity}%`));
    console.log(chalk.white('Precision Score:'), chalk.cyan(`${rewrite.qualityAssessment.precision}%`));
    console.log(chalk.white('Completeness Score:'), chalk.cyan(`${rewrite.qualityAssessment.completeness}%`));
    console.log(chalk.white('Overall Quality:'), chalk.cyan(`${rewrite.qualityAssessment.overall}%`));
    
    if (rewrite.qualityAssessment.notes) {
      console.log(chalk.white('Quality Notes:'), chalk.gray(rewrite.qualityAssessment.notes));
    }
  }

  // Style Analysis
  console.log(chalk.yellow.bold('\n🎨 Style Analysis'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Style Applied:'), chalk.cyan(rewrite.style));
  console.log(chalk.white('Audience Target:'), chalk.cyan(rewrite.audience));
  console.log(chalk.white('Readability Score:'), chalk.cyan(`${rewrite.readabilityScore}%`));
  console.log(chalk.white('Conciseness Score:'), chalk.cyan(`${rewrite.concisenessScore}%`));

  // Alternative Rewrites
  if (rewrite.alternatives && rewrite.alternatives.length > 0) {
    console.log(chalk.yellow.bold('\n🔄 Alternative Rewrites'));
    console.log(chalk.gray('─'.repeat(50)));
    rewrite.alternatives.forEach((alt: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${alt.style} (${alt.audience}):`));
      console.log(chalk.gray(`   ${alt.rewritten}`));
      console.log(chalk.gray(`   Tokens: ${alt.tokens} (${alt.tokenDelta})`));
      console.log(chalk.gray(`   Cost: $${alt.cost.toFixed(4)} (${alt.costSavings})`));
      console.log(chalk.gray(`   Quality: ${alt.qualityScore}%`));
    });
  }

  // Recommendations
  if (rewrite.recommendations && rewrite.recommendations.length > 0) {
    console.log(chalk.yellow.bold('\n💡 Recommendations'));
    console.log(chalk.gray('─'.repeat(50)));
    rewrite.recommendations.forEach((rec: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${rec.type}:`));
      console.log(chalk.gray(`   ${rec.description}`));
      console.log(chalk.gray(`   Potential Savings: $${rec.potentialSavings.toFixed(4)}`));
      console.log(chalk.gray(`   Implementation: ${rec.implementation}`));
    });
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleBatchRewrite(options: any) {
  logger.info('✏️ Running batch rewrite...');

  try {
    const prompts = await loadPromptsFromFile(options.file);
    const rewrite = await runBatchRewrite(prompts, options);
    displayBatchRewriteResults(rewrite, options);
  } catch (error) {
    logger.error('Failed to run batch rewrite:', error);
    process.exit(1);
  }
}

async function loadPromptsFromFile(filePath: string): Promise<string[]> {
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf8');
  return content.split('\n').filter((line: string) => line.trim() !== '');
}

async function runBatchRewrite(prompts: string[], options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const params = new URLSearchParams();
    params.append('style', options.style || 'concise');
    params.append('audience', options.audience || 'general');
    if (options.includeTokenAnalysis) params.append('includeTokenAnalysis', 'true');
    if (options.includeCostAnalysis) params.append('includeCostAnalysis', 'true');
    if (options.includeQualityAssessment) params.append('includeQualityAssessment', 'true');

    const response = await axios.post(`${baseUrl}/api/rewrite-prompt/batch?${params}`, {
      prompts: prompts,
      style: options.style || 'concise',
      audience: options.audience || 'general',
      options: {
        includeTokenAnalysis: options.includeTokenAnalysis,
        includeCostAnalysis: options.includeCostAnalysis,
        includeQualityAssessment: options.includeQualityAssessment
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

function displayBatchRewriteResults(rewrite: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(rewrite, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n✏️ Batch Rewrite Results'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Summary Statistics
  console.log(chalk.yellow.bold('\n📊 Summary Statistics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Total Prompts:'), chalk.cyan(rewrite.totalPrompts));
  console.log(chalk.white('Total Token Reduction:'), chalk.green(`${rewrite.totalTokenReduction.toLocaleString()} tokens`));
  console.log(chalk.white('Total Cost Savings:'), chalk.green(`$${rewrite.totalCostSavings.toFixed(4)}`));
  console.log(chalk.white('Average Token Reduction:'), chalk.cyan(`${rewrite.averageTokenReduction}%`));
  console.log(chalk.white('Average Cost Savings:'), chalk.cyan(`${rewrite.averageCostSavings}%`));

  // Individual Results
  console.log(chalk.yellow.bold('\n🔍 Individual Results'));
  console.log(chalk.gray('─'.repeat(50)));
  
  rewrite.results.forEach((result: any, index: number) => {
    const tokenColor = result.tokenDelta < 0 ? chalk.green : chalk.red;
    const costColor = result.costSavings > 0 ? chalk.green : chalk.red;
    
    console.log(chalk.white(`\n${index + 1}. Prompt ${index + 1}:`));
    console.log(chalk.gray('   ─'.repeat(40)));
    console.log(chalk.white('   Original:'), chalk.gray(result.original));
    console.log(chalk.white('   Rewritten:'), chalk.cyan(result.rewritten));
    console.log(chalk.white('   Token Delta:'), tokenColor(`${result.tokenDelta} tokens`));
    console.log(chalk.white('   Cost Savings:'), costColor(`$${result.costSavings.toFixed(4)}`));
    console.log(chalk.white('   Quality Score:'), chalk.cyan(`${result.qualityScore}%`));
  });

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleStyleRewrite(style: string, options: any) {
  logger.info(`✏️ Rewriting prompt with ${style} style...`);

  try {
    const rewrite = await rewritePromptWithStyle(style, options);
    displayStyleRewriteResults(rewrite, style, options);
  } catch (error) {
    logger.error('Failed to rewrite prompt with style:', error);
    process.exit(1);
  }
}

async function rewritePromptWithStyle(style: string, options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const params = new URLSearchParams();
    if (options.prompt) params.append('prompt', options.prompt);
    params.append('style', style);
    params.append('audience', options.audience || 'general');
    if (options.includeTokenAnalysis) params.append('includeTokenAnalysis', 'true');
    if (options.includeCostAnalysis) params.append('includeCostAnalysis', 'true');
    if (options.includeQualityAssessment) params.append('includeQualityAssessment', 'true');

    const response = await axios.post(`${baseUrl}/api/rewrite-prompt/style?${params}`, {
      prompt: options.prompt,
      style: style,
      audience: options.audience || 'general',
      options: {
        includeTokenAnalysis: options.includeTokenAnalysis,
        includeCostAnalysis: options.includeCostAnalysis,
        includeQualityAssessment: options.includeQualityAssessment
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

function displayStyleRewriteResults(rewrite: any, style: string, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(rewrite, null, 2));
    return;
  }

  console.log(chalk.cyan.bold(`\n✏️ ${style.charAt(0).toUpperCase() + style.slice(1)} Style Rewrite Results`));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Style-specific Analysis
  console.log(chalk.yellow.bold('\n🎨 Style Analysis'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Style Applied:'), chalk.cyan(style));
  console.log(chalk.white('Style Characteristics:'), chalk.gray(rewrite.styleCharacteristics));
  console.log(chalk.white('Style Effectiveness:'), chalk.cyan(`${rewrite.styleEffectiveness}%`));

  // Rewrite Results
  console.log(chalk.yellow.bold('\n📝 Rewrite Results'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Original:'), chalk.gray(rewrite.original));
  console.log(chalk.white('Rewritten:'), chalk.cyan(rewrite.rewritten));
  console.log(chalk.white('Token Reduction:'), chalk.green(`${rewrite.tokenReduction}%`));
  console.log(chalk.white('Cost Savings:'), chalk.green(`$${rewrite.costSavings.toFixed(4)}`));

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleAudienceRewrite(audience: string, options: any) {
  logger.info(`✏️ Rewriting prompt for ${audience} audience...`);

  try {
    const rewrite = await rewritePromptForAudience(audience, options);
    displayAudienceRewriteResults(rewrite, audience, options);
  } catch (error) {
    logger.error('Failed to rewrite prompt for audience:', error);
    process.exit(1);
  }
}

async function rewritePromptForAudience(audience: string, options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const params = new URLSearchParams();
    if (options.prompt) params.append('prompt', options.prompt);
    params.append('audience', audience);
    params.append('style', options.style || 'concise');
    if (options.includeTokenAnalysis) params.append('includeTokenAnalysis', 'true');
    if (options.includeCostAnalysis) params.append('includeCostAnalysis', 'true');
    if (options.includeQualityAssessment) params.append('includeQualityAssessment', 'true');

    const response = await axios.post(`${baseUrl}/api/rewrite-prompt/audience?${params}`, {
      prompt: options.prompt,
      audience: audience,
      style: options.style || 'concise',
      options: {
        includeTokenAnalysis: options.includeTokenAnalysis,
        includeCostAnalysis: options.includeCostAnalysis,
        includeQualityAssessment: options.includeQualityAssessment
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

function displayAudienceRewriteResults(rewrite: any, audience: string, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(rewrite, null, 2));
    return;
  }

  console.log(chalk.cyan.bold(`\n✏️ ${audience.charAt(0).toUpperCase() + audience.slice(1)} Audience Rewrite Results`));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Audience-specific Analysis
  console.log(chalk.yellow.bold('\n👥 Audience Analysis'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Target Audience:'), chalk.cyan(audience));
  console.log(chalk.white('Audience Characteristics:'), chalk.gray(rewrite.audienceCharacteristics));
  console.log(chalk.white('Audience Appropriateness:'), chalk.cyan(`${rewrite.audienceAppropriateness}%`));

  // Rewrite Results
  console.log(chalk.yellow.bold('\n📝 Rewrite Results'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Original:'), chalk.gray(rewrite.original));
  console.log(chalk.white('Rewritten:'), chalk.cyan(rewrite.rewritten));
  console.log(chalk.white('Token Reduction:'), chalk.green(`${rewrite.tokenReduction}%`));
  console.log(chalk.white('Cost Savings:'), chalk.green(`$${rewrite.costSavings.toFixed(4)}`));

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleStyleComparison(options: any) {
  logger.info('✏️ Comparing different rewrite styles...');

  try {
    const styles = options.styles ? options.styles.split(',') : ['short', 'concise', 'extractive'];
    const comparison = await compareStyles(options.prompt, styles, options);
    displayStyleComparison(comparison, options);
  } catch (error) {
    logger.error('Failed to compare styles:', error);
    process.exit(1);
  }
}

async function compareStyles(prompt: string, styles: string[], options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const params = new URLSearchParams();
    if (prompt) params.append('prompt', prompt);
    params.append('styles', styles.join(','));
    params.append('audience', options.audience || 'general');
    if (options.includeTokenAnalysis) params.append('includeTokenAnalysis', 'true');
    if (options.includeCostAnalysis) params.append('includeCostAnalysis', 'true');
    if (options.includeQualityAssessment) params.append('includeQualityAssessment', 'true');

    const response = await axios.post(`${baseUrl}/api/rewrite-prompt/compare?${params}`, {
      prompt: prompt,
      styles: styles,
      audience: options.audience || 'general',
      options: {
        includeTokenAnalysis: options.includeTokenAnalysis,
        includeCostAnalysis: options.includeCostAnalysis,
        includeQualityAssessment: options.includeQualityAssessment
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

function displayStyleComparison(comparison: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(comparison, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n✏️ Style Comparison Results'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Original Prompt
  console.log(chalk.yellow.bold('\n📝 Original Prompt'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Prompt:'), chalk.gray(comparison.originalPrompt));
  console.log(chalk.white('Original Tokens:'), chalk.cyan(comparison.originalTokens.toLocaleString()));
  console.log(chalk.white('Original Cost:'), chalk.cyan(`$${comparison.originalCost.toFixed(4)}`));

  // Style Comparison
  console.log(chalk.yellow.bold('\n📊 Style Comparison'));
  console.log(chalk.gray('─'.repeat(50)));
  
  comparison.styles.forEach((style: any) => {
    const tokenColor = style.tokenDelta < 0 ? chalk.green : chalk.red;
    const costColor = style.costSavings > 0 ? chalk.green : chalk.red;
    
    console.log(chalk.white(`\n${style.name.toUpperCase()}:`));
    console.log(chalk.gray('   ─'.repeat(40)));
    console.log(chalk.white('   Rewritten:'), chalk.cyan(style.rewritten));
    console.log(chalk.white('   Token Delta:'), tokenColor(`${style.tokenDelta} tokens`));
    console.log(chalk.white('   Cost Savings:'), costColor(`$${style.costSavings.toFixed(4)}`));
    console.log(chalk.white('   Quality Score:'), chalk.cyan(`${style.qualityScore}%`));
    console.log(chalk.white('   Effectiveness:'), chalk.cyan(`${style.effectiveness}%`));
  });

  // Best Style
  console.log(chalk.yellow.bold('\n🏆 Best Style'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Style:'), chalk.cyan(comparison.bestStyle.name));
  console.log(chalk.white('Rewritten:'), chalk.cyan(comparison.bestStyle.rewritten));
  console.log(chalk.white('Token Reduction:'), chalk.green(`${comparison.bestStyle.tokenReduction}%`));
  console.log(chalk.white('Cost Savings:'), chalk.green(`$${comparison.bestStyle.costSavings.toFixed(4)}`));
  console.log(chalk.white('Quality Score:'), chalk.cyan(`${comparison.bestStyle.qualityScore}%`));

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleModelOptimization(options: any) {
  logger.info('✏️ Optimizing prompt for specific model...');

  try {
    const optimization = await optimizeForModel(options);
    displayModelOptimization(optimization, options);
  } catch (error) {
    logger.error('Failed to optimize for model:', error);
    process.exit(1);
  }
}

async function optimizeForModel(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  try {
    const params = new URLSearchParams();
    if (options.prompt) params.append('prompt', options.prompt);
    if (options.model) params.append('model', options.model);
    params.append('style', options.style || 'concise');
    params.append('audience', options.audience || 'general');
    if (options.includeTokenAnalysis) params.append('includeTokenAnalysis', 'true');
    if (options.includeCostAnalysis) params.append('includeCostAnalysis', 'true');
    if (options.includeQualityAssessment) params.append('includeQualityAssessment', 'true');

    const response = await axios.post(`${baseUrl}/api/rewrite-prompt/optimize?${params}`, {
      prompt: options.prompt,
      model: options.model,
      style: options.style || 'concise',
      audience: options.audience || 'general',
      options: {
        includeTokenAnalysis: options.includeTokenAnalysis,
        includeCostAnalysis: options.includeCostAnalysis,
        includeQualityAssessment: options.includeQualityAssessment
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

function displayModelOptimization(optimization: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(optimization, null, 2));
    return;
  }

  console.log(chalk.cyan.bold('\n✏️ Model Optimization Results'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Model-specific Analysis
  console.log(chalk.yellow.bold('\n🤖 Model Analysis'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Target Model:'), chalk.cyan(optimization.model));
  console.log(chalk.white('Model Characteristics:'), chalk.gray(optimization.modelCharacteristics));
  console.log(chalk.white('Model Optimization Score:'), chalk.cyan(`${optimization.modelOptimizationScore}%`));

  // Optimization Results
  console.log(chalk.yellow.bold('\n📝 Optimization Results'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Original:'), chalk.gray(optimization.original));
  console.log(chalk.white('Optimized:'), chalk.cyan(optimization.optimized));
  console.log(chalk.white('Token Reduction:'), chalk.green(`${optimization.tokenReduction}%`));
  console.log(chalk.white('Cost Savings:'), chalk.green(`$${optimization.costSavings.toFixed(4)}`));
  console.log(chalk.white('Model Efficiency:'), chalk.cyan(`${optimization.modelEfficiency}%`));

  // Model-specific Recommendations
  if (optimization.recommendations) {
    console.log(chalk.yellow.bold('\n💡 Model-specific Recommendations'));
    console.log(chalk.gray('─'.repeat(50)));
    optimization.recommendations.forEach((rec: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${rec.type}:`));
      console.log(chalk.gray(`   ${rec.description}`));
      console.log(chalk.gray(`   Potential Savings: $${rec.potentialSavings.toFixed(4)}`));
      console.log(chalk.gray(`   Implementation: ${rec.implementation}`));
    });
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}
