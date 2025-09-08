import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export function sastCommand(program: Command) {
  const sastCmd = program
    .command('sast')
    .description('🧬 SAST (Semantic Abstract Syntax Tree) operations for advanced semantic optimization');

  // Main SAST optimization command
  sastCmd
    .command('optimize')
    .description('🧠 Optimize prompts using SAST semantic primitives')
    .argument('[prompt]', 'Prompt to optimize with SAST')
    .option('-f, --file <path>', 'File containing prompt to optimize')
    .option('-l, --language <lang>', 'Language for cross-lingual processing', 'en')
    .option('-o, --output <path>', 'Output file for optimized prompt')
    .option('-v, --verbose', 'Show detailed SAST analysis')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--ambiguity-strategy <strategy>', 'Ambiguity resolution strategy: hybrid, strict, permissive', 'hybrid')
    .option('--preserve-ambiguity', 'Keep ambiguous structures for analysis')
    .option('--cross-lingual', 'Enable cross-lingual semantic mapping')
    .action(async (prompt, options) => {
      try {
        await handleSastOptimize(prompt, options);
      } catch (error) {
        logger.error('SAST optimization failed:', error);
        process.exit(1);
      }
    });

  // SAST vocabulary operations
  sastCmd
    .command('vocabulary')
    .description('📚 Explore SAST semantic primitives vocabulary')
    .option('-s, --search <term>', 'Search for specific semantic primitives')
    .option('-c, --category <cat>', 'Filter by category: concept, action, property, relation, etc.')
    .option('-l, --language <lang>', 'Filter by language support')
    .option('--limit <num>', 'Limit number of results', '10')
    .option('--format <format>', 'Output format (table, json)', 'table')
    .action(async (options) => {
      try {
        await handleVocabulary(options);
      } catch (error) {
        logger.error('Vocabulary operation failed:', error);
        process.exit(1);
      }
    });

  // SAST comparison analysis
  sastCmd
    .command('compare')
    .description('⚖️ Compare traditional Cortex vs SAST optimization')
    .argument('[prompt]', 'Prompt to compare')
    .option('-f, --file <path>', 'File containing prompt to compare')
    .option('-l, --language <lang>', 'Language for analysis', 'en')
    .option('--format <format>', 'Output format (table, json)', 'table')
    .action(async (prompt, options) => {
      try {
        await handleSastCompare(prompt, options);
      } catch (error) {
        logger.error('SAST comparison failed:', error);
        process.exit(1);
      }
    });

  // SAST ambiguity demo
  sastCmd
    .command('telescope-demo')
    .description('🔭 Demonstrate telescope ambiguity resolution')
    .action(async () => {
      try {
        await handleTelescopeDemo();
      } catch (error) {
        logger.error('Telescope demo failed:', error);
        process.exit(1);
      }
    });

  // Universal semantics test
  sastCmd
    .command('universal-test')
    .description('🌍 Test universal semantic representation across languages')
    .argument('[concept]', 'Concept to test universally')
    .option('-l, --languages <langs>', 'Comma-separated language codes', 'en,es,fr')
    .option('--format <format>', 'Output format (table, json)', 'table')
    .action(async (concept, options) => {
      try {
        await handleUniversalTest(concept, options);
      } catch (error) {
        logger.error('Universal test failed:', error);
        process.exit(1);
      }
    });

  // SAST stats
  sastCmd
    .command('stats')
    .description('📊 Show SAST performance statistics')
    .option('--format <format>', 'Output format (table, json)', 'table')
    .action(async (options) => {
      try {
        await handleSastStats(options);
      } catch (error) {
        logger.error('SAST stats failed:', error);
        process.exit(1);
      }
    });
}

async function handleSastOptimize(promptArg: string | undefined, options: any) {
  console.log(chalk.blue.bold('\n🧬 SAST Semantic Optimization'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  const prompt = await getPrompt(promptArg, options);
  if (!prompt) {
    logger.error('No prompt provided. Use a prompt argument or --file option.');
    return;
  }

  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
  }

  const spinner = ora('Processing with SAST semantic primitives...').start();

  try {
    const requestData = {
      prompt,
      service: 'openai',
      model: 'gpt-4o-mini',
      enableCortex: true,
      cortexOperation: 'sast',
      cortexStyle: 'conversational',
      cortexFormat: 'plain',
      cortexSemanticCache: true,
      cortexPreserveSemantics: true,
      cortexIntelligentRouting: true,
      cortexSastProcessing: true,
      cortexAmbiguityResolution: !options.preserveAmbiguity,
      cortexCrossLingualMode: options.crossLingual,
    };

    const response = await axios.post(`${baseUrl}/api/optimizations`, requestData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'CostKatana-Cortex-Operation': 'sast',
      },
      timeout: 90000, // Extended timeout for SAST processing
    });

    spinner.succeed('SAST optimization completed');
    
    const result = response.data.success ? response.data.data : response.data;
    displaySastResults(result, options);

    if (options.output) {
      fs.writeFileSync(options.output, result.optimizedPrompt);
      console.log(chalk.green(`✅ Optimized prompt saved to: ${options.output}`));
    }
  } catch (error: any) {
    spinner.fail('SAST optimization failed');
    throw error;
  }
}

async function handleVocabulary(options: any) {
  console.log(chalk.blue.bold('\n📚 SAST Semantic Vocabulary'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete.');
  }

  const spinner = ora('Fetching semantic primitives...').start();

  try {
    let url = `${baseUrl}/api/optimizations/sast/vocabulary`;
    
    // Add search parameters if provided
    if (options.search || options.category || options.language) {
      const searchParams = new URLSearchParams();
      if (options.search) searchParams.append('term', options.search);
      if (options.category) searchParams.append('category', options.category);
      if (options.language) searchParams.append('language', options.language);
      searchParams.append('limit', options.limit);
      
      url = `${baseUrl}/api/optimizations/sast/search`;
      
      const response = await axios.post(url, {
        term: options.search,
        category: options.category,
        language: options.language,
        limit: parseInt(options.limit)
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      spinner.succeed('Semantic primitives retrieved');
      displayVocabularyResults(response.data.data, options);
    } else {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      spinner.succeed('Vocabulary statistics retrieved');
      displayVocabularyStats(response.data.data, options);
    }
  } catch (error: any) {
    spinner.fail('Failed to fetch vocabulary');
    throw error;
  }
}

async function handleSastCompare(promptArg: string | undefined, options: any) {
  console.log(chalk.blue.bold('\n⚖️ SAST vs Traditional Comparison'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  const prompt = await getPrompt(promptArg, options);
  if (!prompt) {
    logger.error('No prompt provided.');
    return;
  }

  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete.');
  }

  const spinner = ora('Comparing optimization approaches...').start();

  try {
    const response = await axios.post(`${baseUrl}/api/optimizations/sast/compare`, {
      text: prompt,
      language: options.language || 'en'
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    spinner.succeed('Comparison completed');
    displayComparisonResults(response.data.data, options);
  } catch (error: any) {
    spinner.fail('Comparison failed');
    throw error;
  }
}

async function handleTelescopeDemo() {
  console.log(chalk.blue.bold('\n🔭 Telescope Ambiguity Demo'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete.');
  }

  const spinner = ora('Running telescope ambiguity demonstration...').start();

  try {
    const response = await axios.get(`${baseUrl}/api/optimizations/sast/telescope-demo`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    spinner.succeed('Telescope demo completed');
    displayTelescopeDemo(response.data.data);
  } catch (error: any) {
    spinner.fail('Telescope demo failed');
    throw error;
  }
}

async function handleUniversalTest(conceptArg: string | undefined, options: any) {
  console.log(chalk.blue.bold('\n🌍 Universal Semantic Test'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  let concept = conceptArg;
  if (!concept) {
    const { userConcept } = await inquirer.prompt([
      {
        type: 'input',
        name: 'userConcept',
        message: 'Enter a concept to test universally:',
        validate: (input: string) => input.trim() ? true : 'Concept cannot be empty',
      },
    ]);
    concept = userConcept;
  }

  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete.');
  }

  const languages = options.languages.split(',').map((l: string) => l.trim());
  const spinner = ora(`Testing concept "${concept}" across ${languages.length} languages...`).start();

  try {
    const response = await axios.post(`${baseUrl}/api/optimizations/sast/universal-test`, {
      concept,
      languages
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    spinner.succeed('Universal test completed');
    displayUniversalTestResults(response.data.data, options);
  } catch (error: any) {
    spinner.fail('Universal test failed');
    throw error;
  }
}

async function handleSastStats(options: any) {
  console.log(chalk.blue.bold('\n📊 SAST Performance Statistics'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    throw new Error('Configuration incomplete.');
  }

  const spinner = ora('Fetching SAST statistics...').start();

  try {
    const response = await axios.get(`${baseUrl}/api/optimizations/sast/stats`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    spinner.succeed('Statistics retrieved');
    displaySastStats(response.data.data, options);
  } catch (error: any) {
    spinner.fail('Failed to fetch statistics');
    throw error;
  }
}

// Utility functions
async function getPrompt(promptArg: string | undefined, options: any): Promise<string | null> {
  if (promptArg) {
    return promptArg;
  }

  if (options.file) {
    try {
      const fullPath = path.resolve(options.file);
      if (!fs.existsSync(fullPath)) {
        logger.error(`File not found: ${fullPath}`);
        return null;
      }
      return fs.readFileSync(fullPath, 'utf8');
    } catch (error) {
      logger.error('Failed to read file:', error);
      return null;
    }
  }

  const { prompt } = await inquirer.prompt([
    {
      type: 'editor',
      name: 'prompt',
      message: 'Enter the prompt for SAST processing:',
      validate: (input: string) => input.trim() ? true : 'Prompt cannot be empty',
    },
  ]);

  return prompt.trim();
}

// Display functions
function displaySastResults(result: any, options: any) {
  console.log(chalk.green.bold('\n✅ SAST Optimization Results'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  if (options.format === 'json') {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(chalk.cyan('Original Prompt:'));
  console.log(chalk.gray(result.originalPrompt || 'N/A'));
  
  console.log(chalk.cyan('\nOptimized Prompt:'));
  console.log(chalk.white(result.optimizedPrompt || 'N/A'));

  console.log(chalk.cyan('\n📈 Optimization Metrics:'));
  console.log(`  Token Reduction: ${chalk.green(result.improvementPercentage?.toFixed(1) || '0')}%`);
  console.log(`  Tokens Saved: ${chalk.blue(result.tokensSaved || '0')}`);
  console.log(`  Cost Saved: ${chalk.yellow('$' + (result.costSaved?.toFixed(4) || '0.0000'))}`);

  // Display SAST-specific metadata
  if (result.metadata?.sast) {
    const sast = result.metadata.sast;
    console.log(chalk.magenta('\n🧬 SAST Analysis:'));
    console.log(`  Semantic Primitives Used: ${chalk.blue(sast.semanticPrimitives?.totalVocabulary || '0')}`);
    console.log(`  Ambiguities Resolved: ${chalk.green(sast.ambiguitiesResolved || '0')}`);
    console.log(`  Semantic Depth: ${chalk.cyan(sast.semanticDepth || 'N/A')}`);
    console.log(`  Universal Compatible: ${sast.universalCompatibility ? chalk.green('✓') : chalk.red('✗')}`);
    
    if (sast.evolutionComparison) {
      console.log(chalk.magenta('\n📊 vs Traditional Cortex:'));
      console.log(`  Token Reduction: ${chalk.green((sast.evolutionComparison.tokenReduction > 0 ? '+' : '') + sast.evolutionComparison.tokenReduction?.toFixed(1))}%`);
      console.log(`  Ambiguity Reduction: ${chalk.blue((sast.evolutionComparison.ambiguityReduction > 0 ? '+' : '') + sast.evolutionComparison.ambiguityReduction?.toFixed(1))}%`);
      console.log(`  Semantic Clarity Gain: ${chalk.purple((sast.evolutionComparison.semanticClarityGain > 0 ? '+' : '') + (sast.evolutionComparison.semanticClarityGain * 100)?.toFixed(1))}%`);
      console.log(`  Recommended: ${chalk.cyan(sast.evolutionComparison.recommendedApproach.toUpperCase())}`);
    }
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

function displayVocabularyResults(data: any, options: any) {
  if (options.format === 'json') {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  console.log(chalk.green(`\n📚 Found ${data.results?.length || 0} semantic primitives`));
  
  if (data.results && data.results.length > 0) {
    data.results.forEach((result: any, index: number) => {
      const primitive = result.primitive;
      console.log(chalk.cyan(`\n${index + 1}. ${primitive.baseForm} (${primitive.id})`));
      console.log(chalk.gray(`   Category: ${primitive.category}`));
      console.log(chalk.gray(`   Definition: ${primitive.definition}`));
      console.log(chalk.gray(`   Relevance: ${(result.relevanceScore * 100).toFixed(1)}%`));
      
      if (primitive.synonyms && primitive.synonyms.length > 0) {
        console.log(chalk.gray(`   Synonyms: ${primitive.synonyms.slice(0, 3).join(', ')}${primitive.synonyms.length > 3 ? '...' : ''}`));
      }
    });
  }
}

function displayVocabularyStats(data: any, options: any) {
  if (options.format === 'json') {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  console.log(chalk.green(`\n📊 SAST Vocabulary Statistics`));
  console.log(`Total Primitives: ${chalk.blue(data.totalPrimitives || 0)}`);
  console.log(`Average Translations: ${chalk.cyan((data.averageTranslations || 0).toFixed(1))}`);
  
  if (data.primitivesByCategory) {
    console.log(chalk.yellow('\n📂 By Category:'));
    Object.entries(data.primitivesByCategory).forEach(([category, count]: [string, any]) => {
      console.log(`  ${category}: ${chalk.blue(count)}`);
    });
  }

  if (data.coverageByLanguage) {
    console.log(chalk.green('\n🌍 Language Coverage:'));
    Object.entries(data.coverageByLanguage).forEach(([lang, count]: [string, any]) => {
      console.log(`  ${lang.toUpperCase()}: ${chalk.blue(count)} terms`);
    });
  }
}

function displayComparisonResults(data: any, options: any) {
  if (options.format === 'json') {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  console.log(chalk.green('\n⚖️ Comparison Results'));
  console.log(chalk.cyan('\n📝 Input Text:'));
  console.log(chalk.gray(`"${data.inputText}"`));

  console.log(chalk.cyan('\n🔧 Traditional Cortex:'));
  console.log(`  Token Count: ${chalk.blue(data.traditionalCortex.tokenCount)}`);
  console.log(`  Ambiguity Level: ${chalk.yellow(data.traditionalCortex.ambiguityLevel)}`);
  console.log(`  Semantic Explicitness: ${chalk.green((data.traditionalCortex.semanticExplicitness * 100).toFixed(1))}%`);

  console.log(chalk.magenta('\n🧬 SAST Cortex:'));
  console.log(`  Primitive Count: ${chalk.blue(data.sastCortex.primitiveCount)}`);
  console.log(`  Ambiguities Resolved: ${chalk.green(data.sastCortex.ambiguitiesResolved)}`);
  console.log(`  Semantic Explicitness: ${chalk.green((data.sastCortex.semanticExplicitness * 100).toFixed(1))}%`);

  console.log(chalk.cyan('\n📈 Improvements:'));
  console.log(`  Token Reduction: ${chalk.green((data.improvements.tokenReduction > 0 ? '+' : '') + data.improvements.tokenReduction.toFixed(1))}%`);
  console.log(`  Ambiguity Reduction: ${chalk.blue((data.improvements.ambiguityReduction > 0 ? '+' : '') + data.improvements.ambiguityReduction.toFixed(1))}%`);
  console.log(`  Semantic Clarity: ${chalk.purple((data.improvements.semanticClarityGain > 0 ? '+' : '') + (data.improvements.semanticClarityGain * 100).toFixed(1))}%`);
  console.log(`  Cross-Lingual: ${data.improvements.crossLingualCompatibility ? chalk.green('✓') : chalk.red('✗')}`);

  console.log(chalk.yellow(`\n🎯 Recommended Approach: ${data.metadata.recommendedApproach.toUpperCase()}`));
}

function displayTelescopeDemo(data: any) {
  console.log(chalk.green('\n🔭 Telescope Ambiguity Demonstration'));
  
  console.log(chalk.cyan('\n📝 Original Sentence:'));
  console.log(chalk.gray(`"${data.explanation.sentence}"`));
  
  console.log(chalk.yellow('\n🤔 Ambiguity Type:'));
  console.log(chalk.gray(data.explanation.ambiguityType));

  console.log(chalk.cyan('\n💭 Possible Interpretations:'));
  data.explanation.interpretations.forEach((interpretation: string, index: number) => {
    console.log(chalk.gray(`  ${index + 1}. ${interpretation}`));
  });

  console.log(chalk.green('\n✅ SAST Resolution:'));
  console.log(chalk.white(data.explanation.resolution));

  console.log(chalk.magenta('\n📊 SAST Performance:'));
  console.log(`  Ambiguities Resolved: ${chalk.blue(data.sastStats.ambiguitiesResolved)}`);
  console.log(`  Semantic Accuracy: ${chalk.green((data.sastStats.semanticAccuracy * 100).toFixed(1))}%`);
  console.log(`  Processing Time: ${chalk.cyan(data.sastStats.averageProcessingTime.toFixed(1))}ms`);
}

function displayUniversalTestResults(data: any, options: any) {
  if (options.format === 'json') {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  console.log(chalk.green(`\n🌍 Universal Test Results for: "${data.concept}"`));
  console.log(`Unification Score: ${chalk.blue((data.unificationScore * 100).toFixed(1))}%`);
  console.log(`Universal Compatible: ${data.isUniversal ? chalk.green('✓') : chalk.orange('Partial')}`);

  console.log(chalk.cyan('\n🗣️ Translations:'));
  Object.entries(data.translations).forEach(([lang, translation]: [string, any]) => {
    console.log(`  ${lang.toUpperCase()}: "${translation}"`);
  });

  console.log(chalk.magenta('\n🧬 SAST Representations:'));
  Object.entries(data.sastRepresentations).forEach(([lang, repr]: [string, any]) => {
    console.log(`  ${lang.toUpperCase()}: ${repr.frameType} frame (${Object.keys(repr.primitives).length} primitives)`);
  });
}

function displaySastStats(data: any, options: any) {
  if (options.format === 'json') {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  console.log(chalk.green('\n📊 SAST Performance Statistics'));
  
  console.log(chalk.cyan('\n🧬 Encoding Performance:'));
  console.log(`  Total Encodings: ${chalk.blue(data.encoding.totalEncodings.toLocaleString())}`);
  console.log(`  Success Rate: ${chalk.green((data.encoding.successfulEncodings / data.encoding.totalEncodings * 100).toFixed(1))}%`);
  console.log(`  Ambiguities Resolved: ${chalk.purple(data.encoding.ambiguitiesResolved.toLocaleString())}`);
  console.log(`  Average Processing: ${chalk.cyan(data.encoding.averageProcessingTime.toFixed(2))}ms`);
  console.log(`  Semantic Accuracy: ${chalk.green((data.encoding.semanticAccuracy * 100).toFixed(1))}%`);

  console.log(chalk.magenta('\n⚖️ Comparison Performance:'));
  console.log(`  Total Comparisons: ${chalk.blue(data.comparison.totalComparisons.toLocaleString())}`);
  console.log(`  SAST Wins: ${chalk.green(data.comparison.sastWins)} (${data.comparison.sastWinRate.toFixed(1)}%)`);
  console.log(`  Traditional Wins: ${chalk.yellow(data.comparison.traditionalWins)}`);
  console.log(`  Average Improvement: ${chalk.blue(data.comparison.averageImprovement.toFixed(1))}%`);
  console.log(`  Ambiguity Resolution Rate: ${chalk.purple(data.comparison.ambiguityResolutionRate.toFixed(1))}%`);

  console.log(chalk.gray(`\nLast Updated: ${data.lastUpdated}`));
}
