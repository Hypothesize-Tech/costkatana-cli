import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function projectCommand(program: Command) {
  const projectGroup = program
    .command('project')
    .description('📁 Manage projects for cost tracking');

  // Main project command
  projectGroup
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export project data to file')
    .action(async (options) => {
      try {
        await handleProject(options);
      } catch (error) {
        logger.error('Project command failed:', error);
        process.exit(1);
      }
    });

  // Create project subcommand
  projectGroup
    .command('create <name>')
    .description('📁 Create a new project')
    .option('-d, --description <description>', 'Project description')
    .option('-b, --budget <amount>', 'Monthly budget amount')
    .option(
      '-p, --period <period>',
      'Budget period (monthly, quarterly, yearly)',
      'monthly'
    )
    .option('-c, --currency <currency>', 'Currency (USD, EUR, etc.)', 'USD')
    .option('-t, --tags <tags>', 'Comma-separated tags')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export project data to file')
    .action(async (name, options) => {
      try {
        await handleCreateProject(name, options);
      } catch (error) {
        logger.error('Create project failed:', error);
        process.exit(1);
      }
    });

  // List projects subcommand
  projectGroup
    .command('list')
    .description('📋 List all projects')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export project list to file')
    .option('-v, --verbose', 'Show detailed project information')
    .action(async (options) => {
      try {
        await handleListProjects(options);
      } catch (error) {
        logger.error('List projects failed:', error);
        process.exit(1);
      }
    });

  // Switch project subcommand
  projectGroup
    .command('switch <name>')
    .description('🔄 Switch to a different project')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .action(async (name, options) => {
      try {
        await handleSwitchProject(name, options);
      } catch (error) {
        logger.error('Switch project failed:', error);
        process.exit(1);
      }
    });
}

async function handleProject(_options: any) {
  console.log(chalk.cyan.bold('\n📁 Project Management'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  console.log(chalk.yellow('Available commands:'));
  console.log(
    chalk.white('  costkatana project create <name>     Create a new project')
  );
  console.log(
    chalk.white('  costkatana project list              List all projects')
  );
  console.log(
    chalk.white('  costkatana project switch <name>     Switch to a project')
  );

  console.log(chalk.gray('\nExamples:'));
  console.log(chalk.white('  costkatana project create my-ai-project'));
  console.log(
    chalk.white('  costkatana project create impact.p3m --budget 1000')
  );
  console.log(chalk.white('  costkatana project list --format json'));
  console.log(chalk.white('  costkatana project switch impact.p3m'));

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
}

async function handleCreateProject(name: string, options: any) {
  logger.info('📁 Creating new project...');

  try {
    // Collect project data
    const projectData = await collectProjectData(name, options);

    // Create project via API
    const result = await createProject(projectData);

    // Display results
    displayCreateProjectResult(result, options);
  } catch (error) {
    logger.error('Failed to create project:', error);
    process.exit(1);
  }
}

async function collectProjectData(name: string, options: any) {
  const data: any = {
    name: name,
  };

  // Description
  if (options.description) {
    data.description = options.description;
  } else {
    const { description } = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: 'Enter project description (optional):',
      },
    ]);
    if (description) data.description = description;
  }

  // Budget
  if (options.budget) {
    data.budget = {
      amount: parseFloat(options.budget),
      period: options.period || 'monthly',
      currency: options.currency || 'USD',
    };
  } else {
    const { useBudget } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useBudget',
        message: 'Do you want to set a budget for this project?',
        default: true,
      },
    ]);

    if (useBudget) {
      const { budgetAmount } = await inquirer.prompt([
        {
          type: 'number',
          name: 'budgetAmount',
          message: 'Enter monthly budget amount:',
          validate: (input: number) => {
            if (!input || input <= 0) {
              return 'Budget must be a positive number';
            }
            return true;
          },
        },
      ]);

      const { budgetPeriod } = await inquirer.prompt([
        {
          type: 'list',
          name: 'budgetPeriod',
          message: 'Select budget period:',
          choices: [
            { name: 'Monthly', value: 'monthly' },
            { name: 'Quarterly', value: 'quarterly' },
            { name: 'Yearly', value: 'yearly' },
            { name: 'One-time', value: 'one-time' },
          ],
        },
      ]);

      data.budget = {
        amount: budgetAmount,
        period: budgetPeriod,
        currency: 'USD',
      };
    }
  }

  // Tags
  if (options.tags) {
    data.tags = options.tags.split(',').map((tag: string) => tag.trim());
  } else {
    const { tags } = await inquirer.prompt([
      {
        type: 'input',
        name: 'tags',
        message: 'Enter tags (comma-separated, optional):',
      },
    ]);
    if (tags) {
      data.tags = tags.split(',').map((tag: string) => tag.trim());
    }
  }

  // Settings
  data.settings = {
    enablePromptLibrary: true,
    enableCostAllocation: true,
    notifications: {
      budgetAlerts: true,
      weeklyReports: true,
      monthlyReports: true,
      usageReports: true,
    },
  };

  return data;
}

async function createProject(projectData: any) {
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
    const response = await axios.post(`${baseUrl}/api/projects`, projectData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    if (response.status !== 201) {
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

function displayCreateProjectResult(result: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(result, null, 2));
    return;
  } else if (format === 'csv') {
    console.log(
      'Project ID,Name,Description,Budget,Period,Currency,Created At'
    );
    console.log(
      `"${result._id}","${result.name}","${result.description || ''}","${result.budget?.amount || 0}","${result.budget?.period || ''}","${result.budget?.currency || 'USD'}","${result.createdAt}"`
    );
    return;
  }

  console.log(chalk.cyan.bold('\n✅ Project Created Successfully'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  console.log(chalk.white('📝 Project ID:'), chalk.cyan(result._id));
  console.log(chalk.white('📁 Name:'), chalk.cyan(result.name));

  if (result.description) {
    console.log(chalk.white('📄 Description:'), chalk.cyan(result.description));
  }

  if (result.budget) {
    console.log(
      chalk.white('💰 Budget:'),
      chalk.green(
        `${result.budget.currency} ${result.budget.amount.toLocaleString()}`
      )
    );
    console.log(chalk.white('📅 Period:'), chalk.cyan(result.budget.period));
  }

  if (result.tags && result.tags.length > 0) {
    console.log(chalk.white('🏷️  Tags:'), chalk.cyan(result.tags.join(', ')));
  }

  console.log(
    chalk.white('📅 Created:'),
    chalk.cyan(new Date(result.createdAt).toLocaleString())
  );

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(chalk.yellow('💡 Next steps:'));
  console.log(
    chalk.white(
      '  • Switch to this project: costkatana project switch ' + result.name
    )
  );
  console.log(
    chalk.white('  • Track usage: costkatana track --project ' + result.name)
  );
  console.log(
    chalk.white(
      '  • View analytics: costkatana analytics --project ' + result.name
    )
  );
}

async function handleListProjects(options: any) {
  logger.info('📋 Fetching projects...');

  try {
    const projects = await getProjects();
    displayProjectsList(projects, options);
  } catch (error) {
    logger.error('Failed to fetch projects:', error);
    process.exit(1);
  }
}

async function getProjects() {
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
    const response = await axios.get(`${baseUrl}/api/projects`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
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

function displayProjectsList(projects: any[], options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(projects, null, 2));
    return;
  } else if (format === 'csv') {
    console.log(
      'Project ID,Name,Description,Budget,Spending,Usage %,Created At'
    );
    projects.forEach((project) => {
      const budget = project.budget?.amount || 0;
      const spending = project.spending?.current || 0;
      const usagePercent =
        budget > 0 ? ((spending / budget) * 100).toFixed(1) : '0.0';
      console.log(
        `"${project._id}","${project.name}","${project.description || ''}","${budget}","${spending}","${usagePercent}","${project.createdAt}"`
      );
    });
    return;
  }

  console.log(chalk.cyan.bold('\n📋 Your Projects'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  if (projects.length === 0) {
    console.log(chalk.yellow('No projects found.'));
    console.log(chalk.white('Create your first project:'));
    console.log(chalk.cyan('  costkatana project create my-project'));
    console.log(
      chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    return;
  }

  projects.forEach((project, index) => {
    const budget = project.budget?.amount || 0;
    const spending = project.spending?.current || 0;
    const usagePercent = budget > 0 ? (spending / budget) * 100 : 0;

    // Determine status color
    let statusColor = chalk.green;
    let statusIcon = '🟢';
    if (usagePercent >= 90) {
      statusColor = chalk.red;
      statusIcon = '🔴';
    } else if (usagePercent >= 75) {
      statusColor = chalk.yellow;
      statusIcon = '🟡';
    } else if (usagePercent >= 50) {
      statusColor = chalk.yellow;
      statusIcon = '🟠';
    }

    console.log(chalk.white(`\n${index + 1}. ${statusIcon} ${project.name}`));
    console.log(chalk.gray('   ─'.repeat(40)));

    if (project.description) {
      console.log(
        chalk.white('   📄 Description:'),
        chalk.cyan(project.description)
      );
    }

    console.log(
      chalk.white('   💰 Budget:'),
      chalk.green(
        `${project.budget?.currency || 'USD'} ${budget.toLocaleString()}`
      )
    );
    console.log(
      chalk.white('   📊 Spending:'),
      chalk.cyan(`$${spending.toFixed(2)}`)
    );
    console.log(
      chalk.white('   📈 Usage:'),
      statusColor(`${usagePercent.toFixed(1)}%`)
    );

    if (project.usage) {
      console.log(
        chalk.white('   🔢 Requests:'),
        chalk.cyan(project.usage.totalRequests?.toLocaleString() || '0')
      );
      console.log(
        chalk.white('   🧠 Tokens:'),
        chalk.cyan(project.usage.totalTokens?.toLocaleString() || '0')
      );
    }

    console.log(
      chalk.white('   📅 Created:'),
      chalk.cyan(new Date(project.createdAt).toLocaleDateString())
    );
  });

  console.log(
    chalk.gray('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(chalk.yellow('💡 Commands:'));
  console.log(
    chalk.white('  • Switch project: costkatana project switch <name>')
  );
  console.log(
    chalk.white('  • Create project: costkatana project create <name>')
  );
  console.log(
    chalk.white('  • View analytics: costkatana analytics --project <name>')
  );
}

async function handleSwitchProject(name: string, options: any) {
  logger.info('🔄 Switching to project...');

  try {
    // Get all projects to find the one by name
    const projects = await getProjects();
    const project = projects.find((p: any) => p.name === name);

    if (!project) {
      console.log(chalk.red.bold('\n❌ Project Not Found'));
      console.log(
        chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      );
      console.log(chalk.yellow(`Project "${name}" not found.`));
      console.log(chalk.white('Available projects:'));
      projects.forEach((p: any) => console.log(chalk.cyan(`  • ${p.name}`)));
      console.log(
        chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      );
      return;
    }

    // Store the current project in config
    configManager.set('currentProject', {
      id: project._id,
      name: project.name,
      switchedAt: new Date().toISOString(),
    });

    displaySwitchProjectResult(project, options);
  } catch (error) {
    logger.error('Failed to switch project:', error);
    process.exit(1);
  }
}

function displaySwitchProjectResult(project: any, options: any) {
  const format = options.format || 'table';

  if (format === 'json') {
    console.log(JSON.stringify(project, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Project ID,Name,Description,Budget,Spending,Usage %');
    const budget = project.budget?.amount || 0;
    const spending = project.spending?.current || 0;
    const usagePercent =
      budget > 0 ? ((spending / budget) * 100).toFixed(1) : '0.0';
    console.log(
      `"${project._id}","${project.name}","${project.description || ''}","${budget}","${spending}","${usagePercent}"`
    );
    return;
  }

  console.log(chalk.cyan.bold('\n✅ Switched to Project'));
  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );

  console.log(chalk.white('📁 Project:'), chalk.cyan(project.name));

  if (project.description) {
    console.log(
      chalk.white('📄 Description:'),
      chalk.cyan(project.description)
    );
  }

  const budget = project.budget?.amount || 0;
  const spending = project.spending?.current || 0;
  const usagePercent = budget > 0 ? (spending / budget) * 100 : 0;

  console.log(
    chalk.white('💰 Budget:'),
    chalk.green(
      `${project.budget?.currency || 'USD'} ${budget.toLocaleString()}`
    )
  );
  console.log(
    chalk.white('📊 Spending:'),
    chalk.cyan(`$${spending.toFixed(2)}`)
  );
  console.log(
    chalk.white('📈 Usage:'),
    chalk.yellow(`${usagePercent.toFixed(1)}%`)
  );

  if (project.usage) {
    console.log(
      chalk.white('🔢 Requests:'),
      chalk.cyan(project.usage.totalRequests?.toLocaleString() || '0')
    );
    console.log(
      chalk.white('🧠 Tokens:'),
      chalk.cyan(project.usage.totalTokens?.toLocaleString() || '0')
    );
  }

  console.log(
    chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  );
  console.log(chalk.yellow('💡 Next steps:'));
  console.log(
    chalk.white('  • Track usage: costkatana track --project ' + project.name)
  );
  console.log(
    chalk.white(
      '  • View analytics: costkatana analytics --project ' + project.name
    )
  );
  console.log(
    chalk.white('  • Check budget: costkatana budget --project ' + project.name)
  );
}
