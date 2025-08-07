import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';

export function auditFirewallCommand(program: Command) {
  const auditGroup = program
    .command('audit-firewall')
    .description('🛡️ Inspect security and firewall decisions per prompt');

  // Main audit-firewall command
  auditGroup
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export audit data to file')
    .option('-v, --verbose', 'Show detailed audit information')
    .action(async (options) => {
      try {
        await handleAuditFirewall(options);
      } catch (error) {
        logger.error('Audit firewall command failed:', error);
        process.exit(1);
      }
    });

  // Audit by prompt ID
  auditGroup
    .command('id <promptId>')
    .description('🛡️ Audit firewall decisions for a specific prompt')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export audit data to file')
    .option('-v, --verbose', 'Show detailed audit information')
    .option('--include-context', 'Include full prompt context')
    .option('--include-rules', 'Include detailed rule analysis')
    .option('--include-recommendations', 'Include security recommendations')
    .action(async (promptId, options) => {
      try {
        await handleAuditFirewallById(promptId, options);
      } catch (error) {
        logger.error('Audit firewall by ID failed:', error);
        process.exit(1);
      }
    });

  // Audit by time range
  auditGroup
    .command('range')
    .description('🛡️ Audit firewall decisions for a time range')
    .option('-r, --range <range>', 'Time range (1d, 7d, 30d, 90d)', '7d')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export audit data to file')
    .option('-v, --verbose', 'Show detailed audit information')
    .option('--include-blocked', 'Include blocked prompts')
    .option('--include-redacted', 'Include redacted prompts')
    .option('--include-allowed', 'Include allowed prompts')
    .action(async (options) => {
      try {
        await handleAuditFirewallByRange(options);
      } catch (error) {
        logger.error('Audit firewall by range failed:', error);
        process.exit(1);
      }
    });

  // Audit by action type
  auditGroup
    .command('action <actionType>')
    .description('🛡️ Audit firewall decisions by action type')
    .option('-r, --range <range>', 'Time range (1d, 7d, 30d, 90d)', '7d')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export audit data to file')
    .option('-v, --verbose', 'Show detailed audit information')
    .action(async (actionType, options) => {
      try {
        await handleAuditFirewallByAction(actionType, options);
      } catch (error) {
        logger.error('Audit firewall by action failed:', error);
        process.exit(1);
      }
    });

  // Audit by category
  auditGroup
    .command('category <category>')
    .description('🛡️ Audit firewall decisions by Llama Guard category')
    .option('-r, --range <range>', 'Time range (1d, 7d, 30d, 90d)', '7d')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export audit data to file')
    .option('-v, --verbose', 'Show detailed audit information')
    .action(async (category, options) => {
      try {
        await handleAuditFirewallByCategory(category, options);
      } catch (error) {
        logger.error('Audit firewall by category failed:', error);
        process.exit(1);
      }
    });

  // Audit statistics
  auditGroup
    .command('stats')
    .description('📊 Show firewall audit statistics')
    .option('-r, --range <range>', 'Time range (1d, 7d, 30d, 90d)', '7d')
    .option('--format <format>', 'Output format (table, json, csv)', 'table')
    .option('--export <path>', 'Export statistics data to file')
    .option('-v, --verbose', 'Show detailed statistics')
    .action(async (options) => {
      try {
        await handleAuditFirewallStats(options);
      } catch (error) {
        logger.error('Audit firewall stats failed:', error);
        process.exit(1);
      }
    });
}

async function handleAuditFirewall(options: any) {
  console.log(chalk.cyan.bold('\n🛡️ Firewall Audit & Security Analysis'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  
  console.log(chalk.yellow('Available commands:'));
  console.log(chalk.white('  costkatana audit-firewall id <promptId>        Audit specific prompt'));
  console.log(chalk.white('  costkatana audit-firewall range                Audit by time range'));
  console.log(chalk.white('  costkatana audit-firewall action <actionType>  Audit by action type'));
  console.log(chalk.white('  costkatana audit-firewall category <category>  Audit by Llama Guard category'));
  console.log(chalk.white('  costkatana audit-firewall stats                Show audit statistics'));
  
  console.log(chalk.gray('\nExamples:'));
  console.log(chalk.white('  costkatana audit-firewall id prompt-89234'));
  console.log(chalk.white('  costkatana audit-firewall range --range 7d'));
  console.log(chalk.white('  costkatana audit-firewall action blocked'));
  console.log(chalk.white('  costkatana audit-firewall category O1'));
  console.log(chalk.white('  costkatana audit-firewall stats --range 30d'));
  
  console.log(chalk.gray('\nAudit Information:'));
  console.log(chalk.white('  • Prompt Guard score'));
  console.log(chalk.white('  • Llama Guard category matches'));
  console.log(chalk.white('  • Custom rule triggers'));
  console.log(chalk.white('  • Action taken (allowed, redacted, blocked)'));
  console.log(chalk.white('  • Security risk assessment'));
  console.log(chalk.white('  • Compliance verification'));
  
  console.log(chalk.gray('\nAction Types:'));
  console.log(chalk.white('  • allowed - Prompts that passed all checks'));
  console.log(chalk.white('  • redacted - Prompts with sensitive content removed'));
  console.log(chalk.white('  • blocked - Prompts that were completely blocked'));
  console.log(chalk.white('  • flagged - Prompts that triggered warnings'));
  
  console.log(chalk.gray('\nLlama Guard Categories:'));
  console.log(chalk.white('  • O1 - Harmful content'));
  console.log(chalk.white('  • O2 - Hate speech and harassment'));
  console.log(chalk.white('  • O3 - Violence and harm'));
  console.log(chalk.white('  • O4 - Sexual content'));
  console.log(chalk.white('  • O5 - Criminal planning'));
  console.log(chalk.white('  • O6 - Guns and illegal weapons'));
  console.log(chalk.white('  • O7 - Regulated or controlled substances'));
  console.log(chalk.white('  • O8 - Self-harm'));
  console.log(chalk.white('  • I1 - Privacy'));
  console.log(chalk.white('  • I2 - Financial advice'));
  console.log(chalk.white('  • I3 - Health consultation'));
  console.log(chalk.white('  • I4 - Government decision'));
  
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleAuditFirewallById(promptId: string, options: any) {
  logger.info(`🛡️ Auditing firewall decisions for prompt: ${promptId}`);

  try {
    const auditData = await getAuditFirewallById(promptId, options);
    displayAuditFirewallDetail(auditData, options);
  } catch (error) {
    logger.error('Failed to audit firewall by ID:', error);
    process.exit(1);
  }
}

async function getAuditFirewallById(promptId: string, options: any) {
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
    if (options.includeContext) params.append('includeContext', 'true');
    if (options.includeRules) params.append('includeRules', 'true');
    if (options.includeRecommendations) params.append('includeRecommendations', 'true');

    const response = await axios.get(`${baseUrl}/api/audit-firewall/${promptId}?${params}`, {
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

function displayAuditFirewallDetail(audit: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(audit, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Prompt ID,Guard Score,Category,Action,Risk Level,Timestamp');
    console.log(`"${audit.promptId}","${audit.guardScore}","${audit.category}","${audit.action}","${audit.riskLevel}","${audit.timestamp}"`);
    return;
  }

  console.log(chalk.cyan.bold(`\n🛡️ Firewall Audit: ${audit.promptId}`));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Basic Information
  console.log(chalk.yellow.bold('\n📋 Basic Information'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Prompt ID:'), chalk.cyan(audit.promptId));
  console.log(chalk.white('Timestamp:'), chalk.cyan(new Date(audit.timestamp).toLocaleString()));
  console.log(chalk.white('Model:'), chalk.cyan(audit.model));
  console.log(chalk.white('Provider:'), chalk.cyan(audit.provider));

  // Security Assessment
  console.log(chalk.yellow.bold('\n🛡️ Security Assessment'));
  console.log(chalk.gray('─'.repeat(50)));
  
  // Prompt Guard Score
  const guardScoreColor = audit.guardScore >= 0.8 ? chalk.green : 
                         audit.guardScore >= 0.6 ? chalk.yellow : chalk.red;
  console.log(chalk.white('Prompt Guard Score:'), guardScoreColor(audit.guardScore.toFixed(3)));
  
  // Risk Level
  const riskColor = audit.riskLevel === 'low' ? chalk.green : 
                   audit.riskLevel === 'medium' ? chalk.yellow : chalk.red;
  console.log(chalk.white('Risk Level:'), riskColor(audit.riskLevel));
  
  // Action Taken
  const actionColor = audit.action === 'allowed' ? chalk.green : 
                     audit.action === 'redacted' ? chalk.yellow : chalk.red;
  console.log(chalk.white('Action Taken:'), actionColor(audit.action));

  // Llama Guard Categories
  if (audit.llamaGuardCategories && audit.llamaGuardCategories.length > 0) {
    console.log(chalk.yellow.bold('\n🦙 Llama Guard Categories'));
    console.log(chalk.gray('─'.repeat(50)));
    audit.llamaGuardCategories.forEach((category: any) => {
      const categoryColor = category.confidence > 0.7 ? chalk.red : 
                           category.confidence > 0.4 ? chalk.yellow : chalk.green;
      console.log(chalk.white(`${category.code}:`), categoryColor(`${category.name} (${(category.confidence * 100).toFixed(1)}%)`));
    });
  }

  // Custom Rules
  if (audit.customRules && audit.customRules.length > 0) {
    console.log(chalk.yellow.bold('\n🔧 Custom Rule Triggers'));
    console.log(chalk.gray('─'.repeat(50)));
    audit.customRules.forEach((rule: any) => {
      const ruleColor = rule.severity === 'high' ? chalk.red : 
                       rule.severity === 'medium' ? chalk.yellow : chalk.green;
      console.log(chalk.white(`${rule.name}:`), ruleColor(`${rule.description}`));
      if (rule.matches && rule.matches.length > 0) {
        rule.matches.forEach((match: any) => {
          console.log(chalk.gray(`  • ${match}`));
        });
      }
    });
  }

  // Prompt Context (if verbose)
  if (options.includeContext && audit.promptContext) {
    console.log(chalk.yellow.bold('\n📝 Prompt Context'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.gray(audit.promptContext));
  }

  // Detailed Rules Analysis
  if (options.includeRules && audit.rulesAnalysis) {
    console.log(chalk.yellow.bold('\n🔍 Rules Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    Object.entries(audit.rulesAnalysis).forEach(([ruleType, analysis]: [string, any]) => {
      console.log(chalk.white(`\n${ruleType}:`));
      console.log(chalk.gray(`  Triggered: ${analysis.triggered}`));
      console.log(chalk.gray(`  Confidence: ${(analysis.confidence * 100).toFixed(1)}%`));
      console.log(chalk.gray(`  Severity: ${analysis.severity}`));
      if (analysis.details) {
        console.log(chalk.gray(`  Details: ${analysis.details}`));
      }
    });
  }

  // Security Recommendations
  if (options.includeRecommendations && audit.recommendations) {
    console.log(chalk.yellow.bold('\n💡 Security Recommendations'));
    console.log(chalk.gray('─'.repeat(50)));
    audit.recommendations.forEach((rec: any, index: number) => {
      console.log(chalk.white(`${index + 1}. ${rec.type}:`));
      console.log(chalk.gray(`   ${rec.description}`));
      if (rec.priority) {
        console.log(chalk.gray(`   Priority: ${rec.priority}`));
      }
      if (rec.implementation) {
        console.log(chalk.gray(`   Implementation: ${rec.implementation}`));
      }
    });
  }

  // Compliance Information
  if (audit.compliance) {
    console.log(chalk.yellow.bold('\n📋 Compliance Information'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('GDPR Compliance:'), audit.compliance.gdpr ? chalk.green('✓') : chalk.red('✗'));
    console.log(chalk.white('HIPAA Compliance:'), audit.compliance.hipaa ? chalk.green('✓') : chalk.red('✗'));
    console.log(chalk.white('SOC2 Compliance:'), audit.compliance.soc2 ? chalk.green('✓') : chalk.red('✗'));
    if (audit.compliance.notes) {
      console.log(chalk.gray(`Notes: ${audit.compliance.notes}`));
    }
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleAuditFirewallByRange(options: any) {
  logger.info(`🛡️ Auditing firewall decisions for range: ${options.range || '7d'}`);

  try {
    const range = options.range || '7d';
    const auditData = await getAuditFirewallByRange(range, options);
    displayAuditFirewallList(auditData, options);
  } catch (error) {
    logger.error('Failed to audit firewall by range:', error);
    process.exit(1);
  }
}

async function getAuditFirewallByRange(range: string, options: any) {
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
    if (options.includeBlocked) params.append('includeBlocked', 'true');
    if (options.includeRedacted) params.append('includeRedacted', 'true');
    if (options.includeAllowed) params.append('includeAllowed', 'true');

    const response = await axios.get(`${baseUrl}/api/audit-firewall/range?${params}`, {
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

function displayAuditFirewallList(auditList: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(auditList, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Prompt ID,Guard Score,Category,Action,Risk Level,Timestamp');
    auditList.audits.forEach((audit: any) => {
      console.log(`"${audit.promptId}","${audit.guardScore}","${audit.category}","${audit.action}","${audit.riskLevel}","${audit.timestamp}"`);
    });
    return;
  }

  console.log(chalk.cyan.bold('\n🛡️ Firewall Audit List'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Summary Statistics
  console.log(chalk.yellow.bold('\n📊 Summary Statistics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Total Audits:'), chalk.cyan(auditList.summary.totalAudits.toLocaleString()));
  console.log(chalk.white('Allowed:'), chalk.green(auditList.summary.allowed.toLocaleString()));
  console.log(chalk.white('Redacted:'), chalk.yellow(auditList.summary.redacted.toLocaleString()));
  console.log(chalk.white('Blocked:'), chalk.red(auditList.summary.blocked.toLocaleString()));
  console.log(chalk.white('Average Guard Score:'), chalk.cyan(auditList.summary.avgGuardScore.toFixed(3)));

  // Risk Distribution
  if (auditList.riskDistribution) {
    console.log(chalk.yellow.bold('\n⚠️  Risk Distribution'));
    console.log(chalk.gray('─'.repeat(50)));
    Object.entries(auditList.riskDistribution).forEach(([risk, count]: [string, any]) => {
      const color = risk === 'high' ? chalk.red : risk === 'medium' ? chalk.yellow : chalk.green;
      console.log(chalk.white(`${risk}:`), color(`${count.toLocaleString()}`));
    });
  }

  // Audit List
  if (auditList.audits && auditList.audits.length > 0) {
    console.log(chalk.yellow.bold('\n📋 Audit List'));
    console.log(chalk.gray('─'.repeat(50)));

    auditList.audits.forEach((audit: any, index: number) => {
      console.log(chalk.white(`\n${index + 1}. ${audit.promptId}`));
      console.log(chalk.gray('   ─'.repeat(40)));
      
      // Guard Score
      const guardScoreColor = audit.guardScore >= 0.8 ? chalk.green : 
                             audit.guardScore >= 0.6 ? chalk.yellow : chalk.red;
      console.log(chalk.white('   🛡️  Guard Score:'), guardScoreColor(audit.guardScore.toFixed(3)));
      
      // Action
      const actionColor = audit.action === 'allowed' ? chalk.green : 
                         audit.action === 'redacted' ? chalk.yellow : chalk.red;
      console.log(chalk.white('   📋 Action:'), actionColor(audit.action));
      
      // Risk Level
      const riskColor = audit.riskLevel === 'low' ? chalk.green : 
                       audit.riskLevel === 'medium' ? chalk.yellow : chalk.red;
      console.log(chalk.white('   ⚠️  Risk:'), riskColor(audit.riskLevel));
      
      // Category
      if (audit.category) {
        console.log(chalk.white('   🦙 Category:'), chalk.cyan(audit.category));
      }
      
      // Timestamp
      console.log(chalk.white('   ⏰ Time:'), chalk.cyan(new Date(audit.timestamp).toLocaleString()));
    });
  } else {
    console.log(chalk.yellow('\nNo firewall audits found for the specified range.'));
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}

async function handleAuditFirewallByAction(actionType: string, options: any) {
  logger.info(`🛡️ Auditing firewall decisions for action: ${actionType}`);

  try {
    const range = options.range || '7d';
    const auditData = await getAuditFirewallByAction(actionType, range, options);
    displayAuditFirewallList(auditData, options);
  } catch (error) {
    logger.error('Failed to audit firewall by action:', error);
    process.exit(1);
  }
}

async function getAuditFirewallByAction(actionType: string, range: string, options: any) {
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
    params.append('actionType', actionType);
    params.append('range', range);

    const response = await axios.get(`${baseUrl}/api/audit-firewall/action?${params}`, {
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

async function handleAuditFirewallByCategory(category: string, options: any) {
  logger.info(`🛡️ Auditing firewall decisions for category: ${category}`);

  try {
    const range = options.range || '7d';
    const auditData = await getAuditFirewallByCategory(category, range, options);
    displayAuditFirewallList(auditData, options);
  } catch (error) {
    logger.error('Failed to audit firewall by category:', error);
    process.exit(1);
  }
}

async function getAuditFirewallByCategory(category: string, range: string, options: any) {
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
    params.append('category', category);
    params.append('range', range);

    const response = await axios.get(`${baseUrl}/api/audit-firewall/category?${params}`, {
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

async function handleAuditFirewallStats(options: any) {
  logger.info('📊 Generating firewall audit statistics...');

  try {
    const range = options.range || '7d';
    const statsData = await getAuditFirewallStats(range, options);
    displayAuditFirewallStats(statsData, options);
  } catch (error) {
    logger.error('Failed to generate firewall audit statistics:', error);
    process.exit(1);
  }
}

async function getAuditFirewallStats(range: string, options: any) {
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

    const response = await axios.get(`${baseUrl}/api/audit-firewall/stats?${params}`, {
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

function displayAuditFirewallStats(stats: any, options: any) {
  const format = options.format || 'table';
  
  if (format === 'json') {
    console.log(JSON.stringify(stats, null, 2));
    return;
  } else if (format === 'csv') {
    console.log('Metric,Value,Unit,Change');
    Object.entries(stats.summary).forEach(([key, value]: [string, any]) => {
      console.log(`"${key}","${value.value}","${value.unit || ''}","${value.change || ''}"`);
    });
    return;
  }

  console.log(chalk.cyan.bold('\n📊 Firewall Audit Statistics'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Overall Statistics
  console.log(chalk.yellow.bold('\n📈 Overall Statistics'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.white('Total Audits:'), chalk.cyan(stats.summary.totalAudits.toLocaleString()));
  console.log(chalk.white('Allowed:'), chalk.green(stats.summary.allowed.toLocaleString()));
  console.log(chalk.white('Redacted:'), chalk.yellow(stats.summary.redacted.toLocaleString()));
  console.log(chalk.white('Blocked:'), chalk.red(stats.summary.blocked.toLocaleString()));
  console.log(chalk.white('Average Guard Score:'), chalk.cyan(stats.summary.avgGuardScore.toFixed(3)));

  // Action Distribution
  if (stats.actionDistribution) {
    console.log(chalk.yellow.bold('\n📊 Action Distribution'));
    console.log(chalk.gray('─'.repeat(50)));
    Object.entries(stats.actionDistribution).forEach(([action, data]: [string, any]) => {
      const color = action === 'allowed' ? chalk.green : 
                   action === 'redacted' ? chalk.yellow : chalk.red;
      console.log(chalk.white(`${action}:`), color(`${data.count.toLocaleString()} (${(data.percentage * 100).toFixed(1)}%)`));
    });
  }

  // Category Analysis
  if (stats.categoryAnalysis) {
    console.log(chalk.yellow.bold('\n🦙 Category Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    Object.entries(stats.categoryAnalysis).forEach(([category, data]: [string, any]) => {
      console.log(chalk.white(`\n${category}:`));
      console.log(chalk.gray(`  Count: ${data.count.toLocaleString()}`));
      console.log(chalk.gray(`  Percentage: ${(data.percentage * 100).toFixed(1)}%`));
      console.log(chalk.gray(`  Avg Guard Score: ${data.avgGuardScore.toFixed(3)}`));
      console.log(chalk.gray(`  Risk Level: ${data.riskLevel}`));
    });
  }

  // Risk Analysis
  if (stats.riskAnalysis) {
    console.log(chalk.yellow.bold('\n⚠️  Risk Analysis'));
    console.log(chalk.gray('─'.repeat(50)));
    Object.entries(stats.riskAnalysis).forEach(([risk, data]: [string, any]) => {
      const color = risk === 'high' ? chalk.red : 
                   risk === 'medium' ? chalk.yellow : chalk.green;
      console.log(chalk.white(`\n${risk}:`));
      console.log(chalk.gray(`  Count: ${data.count.toLocaleString()}`));
      console.log(chalk.gray(`  Percentage: ${(data.percentage * 100).toFixed(1)}%`));
      console.log(chalk.gray(`  Avg Guard Score: ${data.avgGuardScore.toFixed(3)}`));
    });
  }

  // Compliance Summary
  if (stats.complianceSummary) {
    console.log(chalk.yellow.bold('\n📋 Compliance Summary'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white('GDPR Compliant:'), stats.complianceSummary.gdpr ? chalk.green('✓') : chalk.red('✗'));
    console.log(chalk.white('HIPAA Compliant:'), stats.complianceSummary.hipaa ? chalk.green('✓') : chalk.red('✗'));
    console.log(chalk.white('SOC2 Compliant:'), stats.complianceSummary.soc2 ? chalk.green('✓') : chalk.red('✗'));
    console.log(chalk.white('Overall Compliance:'), chalk.cyan(`${(stats.complianceSummary.overall * 100).toFixed(1)}%`));
  }

  // Security Insights
  if (stats.securityInsights) {
    console.log(chalk.yellow.bold('\n💡 Security Insights'));
    console.log(chalk.gray('─'.repeat(50)));
    stats.securityInsights.forEach((insight: any, index: number) => {
      console.log(chalk.white(`${index + 1}. ${insight.type}:`));
      console.log(chalk.gray(`   ${insight.description}`));
      if (insight.impact) {
        console.log(chalk.gray(`   Impact: ${insight.impact}`));
      }
    });
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
}
