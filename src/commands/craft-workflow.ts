import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';
import * as fs from 'fs';

export function craftWorkflowCommand(program: Command) {
  const craftGroup = program
    .command('craft-workflow')
    .description(
      '🔧 Compose a multi-step agent workflow and evaluate cost impact per step'
    );

  // Main craft-workflow command
  craftGroup
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export workflow data to file')
    .option('-v, --verbose', 'Show detailed workflow analysis')
    .action(async (options) => {
      try {
        await handleCraftWorkflow(options);
      } catch (error) {
        logger.error('Craft workflow command failed:', error);
        process.exit(1);
      }
    });

  // Interactive workflow builder
  craftGroup
    .command('interactive')
    .description('🔧 Interactive workflow builder')
    .option('--name <name>', 'Workflow name', 'workflow')
    .option(
      '--template <template>',
      'Use predefined template (legal, marketing, research, custom)',
      'custom'
    )
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export workflow data to file')
    .option('-v, --verbose', 'Show detailed workflow analysis')
    .option('--include-cost-analysis', 'Include detailed cost analysis')
    .option('--include-optimization', 'Include optimization suggestions')
    .option('--include-testing', 'Include testing scenarios')
    .action(async (options) => {
      try {
        await handleInteractiveWorkflowBuilder(options);
      } catch (error) {
        logger.error('Interactive workflow builder failed:', error);
        process.exit(1);
      }
    });

  // Create workflow from template
  craftGroup
    .command('template <templateName>')
    .description('🔧 Create workflow from predefined template')
    .option('--name <name>', 'Workflow name', 'workflow')
    .option('--customize', 'Allow template customization')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export workflow data to file')
    .option('-v, --verbose', 'Show detailed workflow analysis')
    .option('--include-cost-analysis', 'Include detailed cost analysis')
    .option('--include-optimization', 'Include optimization suggestions')
    .action(async (templateName, options) => {
      try {
        await handleWorkflowFromTemplate(templateName, options);
      } catch (error) {
        logger.error('Workflow from template failed:', error);
        process.exit(1);
      }
    });

  // Evaluate workflow cost
  craftGroup
    .command('evaluate <workflowFile>')
    .description('🔧 Evaluate cost impact of existing workflow')
    .option('--sample-input <input>', 'Sample input for evaluation')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export evaluation data to file')
    .option('-v, --verbose', 'Show detailed evaluation')
    .option('--include-breakdown', 'Include detailed cost breakdown')
    .option('--include-optimization', 'Include optimization suggestions')
    .option(
      '--include-alternatives',
      'Include alternative workflow suggestions'
    )
    .action(async (workflowFile, options) => {
      try {
        await handleWorkflowEvaluation(workflowFile, options);
      } catch (error) {
        logger.error('Workflow evaluation failed:', error);
        process.exit(1);
      }
    });

  // Export workflow
  craftGroup
    .command('export <workflowFile>')
    .description('🔧 Export workflow in various formats')
    .option('--format <format>', 'Export format (json, yaml, yml)', 'json')
    .option('--output <path>', 'Output file path')
    .option('--include-docs', 'Include documentation')
    .option('--include-examples', 'Include usage examples')
    .option('--include-tests', 'Include test cases')
    .action(async (workflowFile, options) => {
      try {
        await handleWorkflowExport(workflowFile, options);
      } catch (error) {
        logger.error('Workflow export failed:', error);
        process.exit(1);
      }
    });

  // List available templates
  craftGroup
    .command('templates')
    .description('📋 List available workflow templates')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export templates data to file')
    .option('-v, --verbose', 'Show detailed template information')
    .action(async (options) => {
      try {
        await handleListTemplates(options);
      } catch (error) {
        logger.error('List templates failed:', error);
        process.exit(1);
      }
    });
}

async function handleCraftWorkflow(_options: any) {
  console.log(chalk.cyan.bold('\n🔧 Workflow Crafting & Cost Analysis'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  console.log(chalk.yellow('Available commands:'));
  console.log(
    chalk.white(
      '  costkatana craft-workflow interactive              Interactive workflow builder'
    )
  );
  console.log(
    chalk.white(
      '  costkatana craft-workflow template <name>         Create from template'
    )
  );
  console.log(
    chalk.white(
      '  costkatana craft-workflow evaluate <file>         Evaluate existing workflow'
    )
  );
  console.log(
    chalk.white(
      '  costkatana craft-workflow export <file>           Export workflow'
    )
  );
  console.log(
    chalk.white(
      '  costkatana craft-workflow templates               List available templates'
    )
  );

  console.log(chalk.gray('\nExamples:'));
  console.log(
    chalk.white(
      '  costkatana craft-workflow interactive --name legal_summary_flow'
    )
  );
  console.log(
    chalk.white('  costkatana craft-workflow template legal --customize')
  );
  console.log(
    chalk.white('  costkatana craft-workflow evaluate workflow.yaml')
  );
  console.log(
    chalk.white(
      '  costkatana craft-workflow export workflow.json --format yaml'
    )
  );
  console.log(chalk.white('  costkatana craft-workflow templates --verbose'));

  console.log(chalk.gray('\nWorkflow Steps:'));
  console.log(chalk.white('  • extract - Extract information from input'));
  console.log(chalk.white('  • rewrite - Rewrite or transform content'));
  console.log(chalk.white('  • summarize - Create summaries'));
  console.log(chalk.white('  • polish - Final refinement and formatting'));
  console.log(chalk.white('  • validate - Validate output quality'));
  console.log(chalk.white('  • classify - Categorize or tag content'));
  console.log(chalk.white('  • translate - Language translation'));
  console.log(chalk.white('  • analyze - Deep analysis and insights'));

  console.log(chalk.gray('\nAvailable Templates:'));
  console.log(chalk.white('  • legal - Legal document processing'));
  console.log(chalk.white('  • marketing - Marketing content creation'));
  console.log(chalk.white('  • research - Research and analysis'));
  console.log(
    chalk.white('  • customer-support - Customer support automation')
  );
  console.log(chalk.white('  • data-processing - Data processing workflows'));
  console.log(chalk.white('  • content-creation - Content creation pipeline'));

  console.log(chalk.gray('\nCost Analysis Features:'));
  console.log(chalk.white('  • Total token usage per step'));
  console.log(chalk.white('  • Expected latency and performance'));
  console.log(chalk.white('  • Cost breakdown by step'));
  console.log(chalk.white('  • Optimization suggestions'));
  console.log(chalk.white('  • Alternative workflow recommendations'));
  console.log(chalk.white('  • ROI analysis and cost projections'));

  console.log(chalk.gray('\nExport Options:'));
  console.log(chalk.white('  • JSON format for programmatic use'));
  console.log(chalk.white('  • YAML format for configuration'));
  console.log(chalk.white('  • Documentation and examples'));
  console.log(chalk.white('  • Test cases and validation'));

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleInteractiveWorkflowBuilder(options: any) {
  logger.info(`🔧 Starting interactive workflow builder for: ${options.name}`);

  try {
    const workflow = await buildWorkflowInteractively(options);
    displayWorkflowAnalysis(workflow, options);
  } catch (error) {
    logger.error('Failed to build workflow interactively:', error);
    process.exit(1);
  }
}

async function buildWorkflowInteractively(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    console.log(chalk.red.bold('\n❌ Configuration Missing'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );

    if (!apiKey) {
      console.log(chalk.yellow('• API Key is not set'));
    }
    if (!baseUrl) {
      console.log(chalk.yellow('• Base URL is not set'));
    }

    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    console.log(chalk.cyan('To set up your configuration, run:'));
    console.log(chalk.white('  cost-katana init'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    );

    throw new Error(
      'Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.'
    );
  }

  try {
    const params = new URLSearchParams();
    params.append('name', options.name);
    params.append('template', options.template || 'custom');
    if (options.includeCostAnalysis)
      params.append('includeCostAnalysis', 'true');
    if (options.includeOptimization)
      params.append('includeOptimization', 'true');
    if (options.includeTesting) params.append('includeTesting', 'true');

    const response = await axios.post(
      `${baseUrl}/api/craft-workflow/interactive?${params}`,
      {
        name: options.name,
        template: options.template || 'custom',
        options: {
          includeCostAnalysis: options.includeCostAnalysis,
          includeOptimization: options.includeOptimization,
          includeTesting: options.includeTesting,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

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
      throw new Error(
        `API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
      );
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayWorkflowAnalysis(workflow: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(workflow, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Step,Model,Tokens,Cost,Latency,Description');
    workflow.steps.forEach((step: any) => {
      console.log(
        `"${step.name}","${step.model}","${step.estimatedTokens}","${step.estimatedCost}","${step.estimatedLatency}","${step.description}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold(`\n🔧 Workflow Analysis: ${workflow.name}`));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Workflow Overview
  console.log(chalk.yellow.bold('\n📋 Workflow Overview'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Name:'), chalk.cyan(workflow.name));
  console.log(chalk.white('Description:'), chalk.gray(workflow.description));
  console.log(chalk.white('Total Steps:'), chalk.cyan(workflow.steps.length));
  console.log(
    chalk.white('Estimated Total Cost:'),
    chalk.red(`$${workflow.totalEstimatedCost.toFixed(4)}`)
  );
  console.log(
    chalk.white('Estimated Total Tokens:'),
    chalk.cyan(workflow.totalEstimatedTokens.toLocaleString())
  );
  console.log(
    chalk.white('Estimated Total Latency:'),
    chalk.yellow(`${workflow.totalEstimatedLatency}ms`)
  );

  // Step-by-Step Analysis
  console.log(chalk.yellow.bold('\n🔧 Step-by-Step Analysis'));
  console.log(chalk.gray('─'.repeat(50)));

  workflow.steps.forEach((step: any, index: number) => {
    const stepColor =
      step.estimatedCost > 0.1
        ? chalk.red
        : step.estimatedCost > 0.05
          ? chalk.yellow
          : chalk.green;

    console.log(chalk.white(`\n${index + 1}. ${step.name}`));
    console.log(chalk.gray('   ─'.repeat(40)));

    // Basic Info
    console.log(chalk.white('   Description:'), chalk.gray(step.description));
    console.log(chalk.white('   Model:'), chalk.cyan(step.model));
    console.log(chalk.white('   Provider:'), chalk.cyan(step.provider));

    // Cost Information
    console.log(
      chalk.white('   Estimated Cost:'),
      stepColor(`$${step.estimatedCost.toFixed(4)}`)
    );
    console.log(
      chalk.white('   Estimated Tokens:'),
      chalk.cyan(step.estimatedTokens.toLocaleString())
    );
    console.log(
      chalk.white('   Estimated Latency:'),
      chalk.yellow(`${step.estimatedLatency}ms`)
    );

    // Configuration
    if (step.configuration) {
      console.log(chalk.white('   Configuration:'));
      Object.entries(step.configuration).forEach(
        ([key, value]: [string, any]) => {
          console.log(chalk.gray(`     ${key}: ${value}`));
        }
      );
    }

    // Fallback Rules
    if (step.fallbackRules && step.fallbackRules.length > 0) {
      console.log(chalk.white('   Fallback Rules:'));
      step.fallbackRules.forEach((rule: any) => {
        console.log(chalk.gray(`     • ${rule.condition} → ${rule.action}`));
      });
    }

    // Retry Rules
    if (step.retryRules && step.retryRules.length > 0) {
      console.log(chalk.white('   Retry Rules:'));
      step.retryRules.forEach((rule: any) => {
        console.log(chalk.gray(`     • ${rule.condition} → ${rule.action}`));
      });
    }
  });

  // Cost Breakdown
  if (workflow.costBreakdown) {
    console.log(chalk.yellow.bold('\n💰 Cost Breakdown'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Input Processing:'),
      chalk.cyan(`$${workflow.costBreakdown.inputProcessing.toFixed(4)}`)
    );
    console.log(
      chalk.white('Content Generation:'),
      chalk.cyan(`$${workflow.costBreakdown.contentGeneration.toFixed(4)}`)
    );
    console.log(
      chalk.white('Validation & QA:'),
      chalk.cyan(`$${workflow.costBreakdown.validation.toFixed(4)}`)
    );
    console.log(
      chalk.white('Output Formatting:'),
      chalk.cyan(`$${workflow.costBreakdown.outputFormatting.toFixed(4)}`)
    );
    console.log(
      chalk.white('Total:'),
      chalk.red(`$${workflow.costBreakdown.total.toFixed(4)}`)
    );
  }

  // Performance Analysis
  if (workflow.performanceAnalysis) {
    console.log(chalk.yellow.bold('\n⚡ Performance Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(
      chalk.white('Sequential Execution:'),
      chalk.cyan(`${workflow.performanceAnalysis.sequential}ms`)
    );
    console.log(
      chalk.white('Parallel Execution:'),
      chalk.cyan(`${workflow.performanceAnalysis.parallel}ms`)
    );
    console.log(
      chalk.white('Optimization Potential:'),
      chalk.green(`${workflow.performanceAnalysis.optimizationPotential}%`)
    );
    console.log(
      chalk.white('Bottleneck Steps:'),
      chalk.yellow(workflow.performanceAnalysis.bottlenecks.join(', '))
    );
  }

  // Optimization Suggestions
  if (workflow.optimizations && workflow.optimizations.length > 0) {
    console.log(chalk.yellow.bold('\n💡 Optimization Suggestions'));
    console.log(chalk.gray('─'.repeat(50)));
    workflow.optimizations.forEach((opt: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${opt.type}:`));
      console.log(chalk.gray(`   ${opt.description}`));
      console.log(
        chalk.gray(`   Potential Savings: $${opt.potentialSavings.toFixed(4)}`)
      );
      console.log(chalk.gray(`   Implementation: ${opt.implementation}`));
      console.log(chalk.gray(`   Impact: ${opt.impact}`));
    });
  }

  // Alternative Workflows
  if (workflow.alternatives && workflow.alternatives.length > 0) {
    console.log(chalk.yellow.bold('\n🔄 Alternative Workflows'));
    console.log(chalk.gray('─'.repeat(50)));
    workflow.alternatives.forEach((alt: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${alt.name}:`));
      console.log(chalk.gray(`   ${alt.description}`));
      console.log(
        chalk.gray(`   Cost: $${alt.cost.toFixed(4)} (${alt.costDifference}%)`)
      );
      console.log(
        chalk.gray(`   Latency: ${alt.latency}ms (${alt.latencyDifference}%)`)
      );
      console.log(chalk.gray(`   Quality: ${alt.quality}`));
    });
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleWorkflowFromTemplate(templateName: string, options: any) {
  logger.info(`🔧 Creating workflow from template: ${templateName}`);

  try {
    const workflow = await createWorkflowFromTemplate(templateName, options);
    displayWorkflowAnalysis(workflow, options);
  } catch (error) {
    logger.error('Failed to create workflow from template:', error);
    process.exit(1);
  }
}

async function createWorkflowFromTemplate(templateName: string, options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    console.log(chalk.red.bold('\n❌ Configuration Missing'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );

    if (!apiKey) {
      console.log(chalk.yellow('• API Key is not set'));
    }
    if (!baseUrl) {
      console.log(chalk.yellow('• Base URL is not set'));
    }

    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    console.log(chalk.cyan('To set up your configuration, run:'));
    console.log(chalk.white('  cost-katana init'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    );

    throw new Error(
      'Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.'
    );
  }

  try {
    const params = new URLSearchParams();
    params.append('templateName', templateName);
    params.append('name', options.name || 'workflow');
    if (options.customize) params.append('customize', 'true');
    if (options.includeCostAnalysis)
      params.append('includeCostAnalysis', 'true');
    if (options.includeOptimization)
      params.append('includeOptimization', 'true');

    const response = await axios.post(
      `${baseUrl}/api/craft-workflow/template?${params}`,
      {
        templateName: templateName,
        name: options.name || 'workflow',
        customize: options.customize,
        options: {
          includeCostAnalysis: options.includeCostAnalysis,
          includeOptimization: options.includeOptimization,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

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
      throw new Error(
        `API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
      );
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

async function handleWorkflowEvaluation(workflowFile: string, options: any) {
  logger.info(`🔧 Evaluating workflow: ${workflowFile}`);

  try {
    const evaluation = await evaluateWorkflow(workflowFile, options);
    displayWorkflowEvaluation(evaluation, options);
  } catch (error) {
    logger.error('Failed to evaluate workflow:', error);
    process.exit(1);
  }
}

async function evaluateWorkflow(workflowFile: string, options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    console.log(chalk.red.bold('\n❌ Configuration Missing'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );

    if (!apiKey) {
      console.log(chalk.yellow('• API Key is not set'));
    }
    if (!baseUrl) {
      console.log(chalk.yellow('• Base URL is not set'));
    }

    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    console.log(chalk.cyan('To set up your configuration, run:'));
    console.log(chalk.white('  cost-katana init'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    );

    throw new Error(
      'Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.'
    );
  }

  try {
    // Read workflow file
    const workflowContent = fs.readFileSync(workflowFile, 'utf8');

    const params = new URLSearchParams();
    if (options.sampleInput) params.append('sampleInput', options.sampleInput);
    if (options.includeBreakdown) params.append('includeBreakdown', 'true');
    if (options.includeOptimization)
      params.append('includeOptimization', 'true');
    if (options.includeAlternatives)
      params.append('includeAlternatives', 'true');

    const response = await axios.post(
      `${baseUrl}/api/craft-workflow/evaluate?${params}`,
      {
        workflowContent: workflowContent,
        sampleInput: options.sampleInput,
        options: {
          includeBreakdown: options.includeBreakdown,
          includeOptimization: options.includeOptimization,
          includeAlternatives: options.includeAlternatives,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

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
      throw new Error(
        `API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
      );
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayWorkflowEvaluation(evaluation: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(evaluation, null, 2));
    return;
  } else if (format === 'csv') {
    console.log(
      'Step,Model,Actual Tokens,Actual Cost,Estimated Tokens,Estimated Cost,Difference'
    );
    evaluation.stepEvaluations.forEach((step: any) => {
      console.log(
        `"${step.name}","${step.model}","${step.actualTokens}","${step.actualCost}","${step.estimatedTokens}","${step.estimatedCost}","${step.difference}"`
      );
    });
    return;
  }

  console.log(
    chalk.cyan.bold(`\n🔧 Workflow Evaluation: ${evaluation.workflowName}`)
  );
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Overall Results
  console.log(chalk.yellow.bold('\n📊 Overall Results'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('Total Actual Cost:'),
    chalk.red(`$${evaluation.totalActualCost.toFixed(4)}`)
  );
  console.log(
    chalk.white('Total Estimated Cost:'),
    chalk.yellow(`$${evaluation.totalEstimatedCost.toFixed(4)}`)
  );
  console.log(
    chalk.white('Cost Accuracy:'),
    chalk.cyan(`${evaluation.costAccuracy}%`)
  );
  console.log(
    chalk.white('Total Actual Tokens:'),
    chalk.cyan(evaluation.totalActualTokens.toLocaleString())
  );
  console.log(
    chalk.white('Total Estimated Tokens:'),
    chalk.cyan(evaluation.totalEstimatedTokens.toLocaleString())
  );
  console.log(
    chalk.white('Token Accuracy:'),
    chalk.cyan(`${evaluation.tokenAccuracy}%`)
  );

  // Step-by-Step Evaluation
  console.log(chalk.yellow.bold('\n🔧 Step-by-Step Evaluation'));
  console.log(chalk.gray('─'.repeat(50)));

  evaluation.stepEvaluations.forEach((step: any, index: number) => {
    const costAccuracyColor =
      step.costAccuracy >= 90
        ? chalk.green
        : step.costAccuracy >= 70
          ? chalk.yellow
          : chalk.red;

    console.log(chalk.white(`\n${index + 1}. ${step.name}`));
    console.log(chalk.gray('   ─'.repeat(40)));

    // Model Info
    console.log(chalk.white('   Model:'), chalk.cyan(step.model));

    // Cost Comparison
    console.log(
      chalk.white('   Actual Cost:'),
      chalk.red(`$${step.actualCost.toFixed(4)}`)
    );
    console.log(
      chalk.white('   Estimated Cost:'),
      chalk.yellow(`$${step.estimatedCost.toFixed(4)}`)
    );
    console.log(
      chalk.white('   Cost Accuracy:'),
      costAccuracyColor(`${step.costAccuracy}%`)
    );

    // Token Comparison
    console.log(
      chalk.white('   Actual Tokens:'),
      chalk.cyan(step.actualTokens.toLocaleString())
    );
    console.log(
      chalk.white('   Estimated Tokens:'),
      chalk.cyan(step.estimatedTokens.toLocaleString())
    );
    console.log(
      chalk.white('   Token Accuracy:'),
      chalk.cyan(`${step.tokenAccuracy}%`)
    );

    // Performance
    console.log(
      chalk.white('   Actual Latency:'),
      chalk.yellow(`${step.actualLatency}ms`)
    );
    console.log(
      chalk.white('   Estimated Latency:'),
      chalk.yellow(`${step.estimatedLatency}ms`)
    );

    // Quality Assessment
    if (step.qualityAssessment) {
      console.log(
        chalk.white('   Quality Score:'),
        chalk.cyan(step.qualityAssessment.score)
      );
      console.log(
        chalk.white('   Quality Notes:'),
        chalk.gray(step.qualityAssessment.notes)
      );
    }
  });

  // Cost Breakdown
  if (evaluation.costBreakdown) {
    console.log(chalk.yellow.bold('\n💰 Detailed Cost Breakdown'));
    console.log(chalk.gray('─'.repeat(50)));
    Object.entries(evaluation.costBreakdown).forEach(
      ([category, data]: [string, any]) => {
        console.log(chalk.white(`\n${category}:`));
        console.log(chalk.gray(`  Actual: $${data.actual.toFixed(4)}`));
        console.log(chalk.gray(`  Estimated: $${data.estimated.toFixed(4)}`));
        console.log(chalk.gray(`  Difference: ${data.difference}%`));
      }
    );
  }

  // Optimization Recommendations
  if (evaluation.optimizations && evaluation.optimizations.length > 0) {
    console.log(chalk.yellow.bold('\n💡 Optimization Recommendations'));
    console.log(chalk.gray('─'.repeat(50)));
    evaluation.optimizations.forEach((opt: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${opt.type}:`));
      console.log(chalk.gray(`   ${opt.description}`));
      console.log(
        chalk.gray(`   Potential Savings: $${opt.potentialSavings.toFixed(4)}`)
      );
      console.log(chalk.gray(`   Implementation: ${opt.implementation}`));
    });
  }

  // Alternative Suggestions
  if (evaluation.alternatives && evaluation.alternatives.length > 0) {
    console.log(chalk.yellow.bold('\n🔄 Alternative Workflow Suggestions'));
    console.log(chalk.gray('─'.repeat(50)));
    evaluation.alternatives.forEach((alt: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${alt.name}:`));
      console.log(chalk.gray(`   ${alt.description}`));
      console.log(
        chalk.gray(`   Estimated Cost: $${alt.estimatedCost.toFixed(4)}`)
      );
      console.log(chalk.gray(`   Cost Savings: ${alt.costSavings}%`));
      console.log(chalk.gray(`   Quality Impact: ${alt.qualityImpact}`));
    });
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleWorkflowExport(workflowFile: string, options: any) {
  logger.info(`🔧 Exporting workflow: ${workflowFile}`);

  try {
    const exportData = await exportWorkflow(workflowFile, options);
    displayWorkflowExport(exportData, options);
  } catch (error) {
    logger.error('Failed to export workflow:', error);
    process.exit(1);
  }
}

async function exportWorkflow(workflowFile: string, options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    console.log(chalk.red.bold('\n❌ Configuration Missing'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );

    if (!apiKey) {
      console.log(chalk.yellow('• API Key is not set'));
    }
    if (!baseUrl) {
      console.log(chalk.yellow('• Base URL is not set'));
    }

    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    console.log(chalk.cyan('To set up your configuration, run:'));
    console.log(chalk.white('  cost-katana init'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    );

    throw new Error(
      'Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.'
    );
  }

  try {
    // Read workflow file
    const workflowContent = fs.readFileSync(workflowFile, 'utf8');

    const params = new URLSearchParams();
    params.append('format', options.format || 'json');
    if (options.includeDocs) params.append('includeDocs', 'true');
    if (options.includeExamples) params.append('includeExamples', 'true');
    if (options.includeTests) params.append('includeTests', 'true');

    const response = await axios.post(
      `${baseUrl}/api/craft-workflow/export?${params}`,
      {
        workflowContent: workflowContent,
        format: options.format || 'json',
        options: {
          includeDocs: options.includeDocs,
          includeExamples: options.includeExamples,
          includeTests: options.includeTests,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

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
      throw new Error(
        `API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
      );
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayWorkflowExport(exportData: any, options: any) {
  const format = options.format || 'json';
  const outputPath = options.output || `${exportData.workflowName}.${format}`;

  try {
    // Write to file
    fs.writeFileSync(outputPath, exportData.content);

    console.log(chalk.cyan.bold(`\n🔧 Workflow Export Successful`));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );

    console.log(
      chalk.white('Workflow Name:'),
      chalk.cyan(exportData.workflowName)
    );
    console.log(
      chalk.white('Export Format:'),
      chalk.cyan(format.toUpperCase())
    );
    console.log(chalk.white('Output File:'), chalk.green(outputPath));
    console.log(
      chalk.white('File Size:'),
      chalk.cyan(`${(exportData.content.length / 1024).toFixed(2)} KB`)
    );

    if (exportData.metadata) {
      console.log(chalk.yellow.bold('\n📋 Export Metadata'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(
        chalk.white('Created:'),
        chalk.cyan(exportData.metadata.created)
      );
      console.log(
        chalk.white('Version:'),
        chalk.cyan(exportData.metadata.version)
      );
      console.log(chalk.white('Steps:'), chalk.cyan(exportData.metadata.steps));
      console.log(
        chalk.white('Estimated Cost:'),
        chalk.red(`$${exportData.metadata.estimatedCost.toFixed(4)}`)
      );
    }

    if (exportData.includes) {
      console.log(chalk.yellow.bold('\n📚 Included Components'));
      console.log(chalk.gray('─'.repeat(50)));
      Object.entries(exportData.includes).forEach(
        ([component, included]: [string, unknown]) => {
          const status = included ? chalk.green('✓') : chalk.red('✗');
          console.log(chalk.white(`${component}:`), status);
        }
      );
    }

    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    console.log(chalk.green('✅ Workflow exported successfully!'));
  } catch (error) {
    console.log(chalk.red('❌ Failed to write export file:'), error);
    process.exit(1);
  }
}

async function handleListTemplates(options: any) {
  logger.info('📋 Listing available workflow templates...');

  try {
    const templates = await getAvailableTemplates(options);
    displayTemplates(templates, options);
  } catch (error) {
    logger.error('Failed to list templates:', error);
    process.exit(1);
  }
}

async function getAvailableTemplates(options: any) {
  const baseUrl = configManager.get('baseUrl');
  const apiKey = configManager.get('apiKey');

  if (!baseUrl || !apiKey) {
    console.log(chalk.red.bold('\n❌ Configuration Missing'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );

    if (!apiKey) {
      console.log(chalk.yellow('• API Key is not set'));
    }
    if (!baseUrl) {
      console.log(chalk.yellow('• Base URL is not set'));
    }

    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    console.log(chalk.cyan('To set up your configuration, run:'));
    console.log(chalk.white('  cost-katana init'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    );

    throw new Error(
      'Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.'
    );
  }

  try {
    const params = new URLSearchParams();
    if (options.verbose) params.append('verbose', 'true');

    const response = await axios.get(
      `${baseUrl}/api/craft-workflow/templates?${params}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

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
      throw new Error(
        `API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
      );
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

function displayTemplates(templates: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(templates, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Name,Category,Steps,Estimated Cost,Description');
    templates.templates.forEach((template: any) => {
      console.log(
        `"${template.name}","${template.category}","${template.steps}","${template.estimatedCost}","${template.description}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold('\n📋 Available Workflow Templates'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  // Template Categories
  Object.entries(templates.categories).forEach(
    ([category, categoryTemplates]: [string, any]) => {
      console.log(chalk.yellow.bold(`\n${category}`));
      console.log(chalk.gray('─'.repeat(50)));

      categoryTemplates.forEach((template: any) => {
        console.log(chalk.white(`\n• ${template.name}`));
        console.log(chalk.gray(`  ${template.description}`));
        console.log(chalk.gray(`  Steps: ${template.steps}`));
        console.log(
          chalk.gray(`  Estimated Cost: $${template.estimatedCost.toFixed(4)}`)
        );
        console.log(chalk.gray(`  Complexity: ${template.complexity}`));

        if (options.verbose && template.details) {
          console.log(
            chalk.gray(`  Use Cases: ${template.details.useCases.join(', ')}`)
          );
          console.log(
            chalk.gray(
              `  Key Features: ${template.details.keyFeatures.join(', ')}`
            )
          );
          console.log(
            chalk.gray(
              `  Requirements: ${template.details.requirements.join(', ')}`
            )
          );
        }
      });
    }
  );

  // Quick Start Guide
  console.log(chalk.yellow.bold('\n🚀 Quick Start Guide'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(
    chalk.white('1. Choose a template:'),
    chalk.cyan('costkatana craft-workflow template legal')
  );
  console.log(
    chalk.white('2. Customize if needed:'),
    chalk.cyan('costkatana craft-workflow template legal --customize')
  );
  console.log(
    chalk.white('3. Evaluate cost impact:'),
    chalk.cyan('costkatana craft-workflow evaluate workflow.yaml')
  );
  console.log(
    chalk.white('4. Export workflow:'),
    chalk.cyan('costkatana craft-workflow export workflow.json --format yaml')
  );

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}
