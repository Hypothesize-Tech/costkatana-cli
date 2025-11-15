import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';
import axios from 'axios';
import * as readline from 'readline';

export function chatCommand(program: Command) {
  program
    .command('chat')
    .description('Start an interactive chat session with AI')
    .option('-m, --model <model>', 'Specify AI model to use')
    .option('-t, --temperature <temp>', 'Set temperature (0.0-2.0)', '0.7')
    .option('-s, --system <prompt>', 'Set system prompt')
    .option('-f, --file <path>', 'Load conversation from file')
    .option('-o, --output <path>', 'Save conversation to file')
    .option('--no-history', 'Disable conversation history')
    .action(async (options) => {
      try {
        await handleChat(options);
      } catch (error) {
        logger.error('Chat session failed:', error);
        process.exit(1);
      }
    });
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  cost?: number;
  tokens?: number;
}

class ChatSession {
  private messages: ChatMessage[] = [];
  private model: string;
  private temperature: number;
  private systemPrompt: string;
  private baseUrl: string;
  private apiKey: string;
  private historyEnabled: boolean;

  constructor(options: any) {
    this.model = options.model || configManager.get('defaultModel') || 'gpt-4';
    this.temperature = parseFloat(options.temperature) || 0.7;
    this.systemPrompt = options.system || 'You are a helpful AI assistant.';
    this.baseUrl = configManager.get('baseUrl');
    this.apiKey = configManager.get('apiKey');
    this.historyEnabled = options.history !== false;

    if (!this.baseUrl || !this.apiKey) {
      console.log(chalk.red.bold('\n❌ Configuration Missing'));
      console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      
      if (!this.apiKey) {
        console.log(chalk.yellow('• API Key is not set'));
      }
      if (!this.baseUrl) {
        console.log(chalk.yellow('• Base URL is not set'));
      }
      
      console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.cyan('To set up your configuration, run:'));
      console.log(chalk.white('  cost-katana init'));
      console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
      
      throw new Error('Configuration incomplete. Please run "cost-katana init" to set up your API key and base URL.');
    }

    // Add system message
    this.messages.push({
      role: 'system',
      content: this.systemPrompt,
      timestamp: new Date(),
    });
  }

  async start() {
    console.log(chalk.cyan.bold('\n💬 Cost Katana Chat Session'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.yellow(`Model: ${this.model}`));
    console.log(chalk.yellow(`Temperature: ${this.temperature}`));
    console.log(chalk.gray('Type "quit", "exit", or "bye" to end the session'));
    console.log(chalk.gray('Type "help" for available commands'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    while (true) {
      try {
        const input = await this.promptUser(rl);
        
        if (this.isExitCommand(input)) {
          break;
        }

        if (this.isHelpCommand(input)) {
          this.showHelp();
          continue;
        }

        if (this.isClearCommand(input)) {
          this.clearHistory();
          continue;
        }

        if (this.isHistoryCommand(input)) {
          this.showHistory();
          continue;
        }

        if (this.isStatsCommand(input)) {
          this.showStats();
          continue;
        }

        // Send message to AI
        await this.sendMessage(input);
        
      } catch (error) {
        logger.error('Error in chat session:', error);
        console.log(chalk.red('An error occurred. Please try again.'));
      }
    }

    rl.close();
    this.endSession();
  }

  private async promptUser(rl: readline.Interface): Promise<string> {
    return new Promise((resolve) => {
      rl.question(chalk.green('You: '), (input) => {
        resolve(input.trim());
      });
    });
  }

  private isExitCommand(input: string): boolean {
    return ['quit', 'exit', 'bye', 'q'].includes(input.toLowerCase());
  }

  private isHelpCommand(input: string): boolean {
    return input.toLowerCase() === 'help';
  }

  private isClearCommand(input: string): boolean {
    return input.toLowerCase() === 'clear';
  }

  private isHistoryCommand(input: string): boolean {
    return input.toLowerCase() === 'history';
  }

  private isStatsCommand(input: string): boolean {
    return input.toLowerCase() === 'stats';
  }

  private showHelp() {
    console.log(chalk.cyan.bold('\n📖 Available Commands:'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.yellow('help') + '     - Show this help message');
    console.log(chalk.yellow('clear') + '    - Clear conversation history');
    console.log(chalk.yellow('history') + '  - Show conversation history');
    console.log(chalk.yellow('stats') + '    - Show session statistics');
    console.log(chalk.yellow('quit/exit') + ' - End the session');
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  }

  private clearHistory() {
    this.messages = [this.messages[0]]; // Keep system message
    console.log(chalk.green('✓ Conversation history cleared\n'));
  }

  private showHistory() {
    if (this.messages.length <= 1) {
      console.log(chalk.yellow('No conversation history yet.\n'));
      return;
    }

    console.log(chalk.cyan.bold('\n📜 Conversation History:'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

    this.messages.slice(1).forEach((message) => {
      const role = message.role === 'user' ? chalk.green('You') : chalk.blue('AI');
      const time = message.timestamp.toLocaleTimeString();
      const cost = message.cost ? chalk.gray(`($${message.cost.toFixed(4)})`) : '';
      
      console.log(`${role} [${time}] ${cost}:`);
      console.log(chalk.white(message.content));
      console.log('');
    });

    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  }

  private showStats() {
    const userMessages = this.messages.filter(m => m.role === 'user').length;
    const aiMessages = this.messages.filter(m => m.role === 'assistant').length;
    const totalCost = this.messages.reduce((sum, m) => sum + (m.cost || 0), 0);
    const totalTokens = this.messages.reduce((sum, m) => sum + (m.tokens || 0), 0);

    console.log(chalk.cyan.bold('\n📊 Session Statistics:'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.yellow('Messages:') + ` ${userMessages} user, ${aiMessages} AI`);
    console.log(chalk.yellow('Total Cost:') + ` $${totalCost.toFixed(4)}`);
    console.log(chalk.yellow('Total Tokens:') + ` ${totalTokens.toLocaleString()}`);
    console.log(chalk.yellow('Model:') + ` ${this.model}`);
    console.log(chalk.yellow('Temperature:') + ` ${this.temperature}`);
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  }

  private async sendMessage(content: string) {
    // Add user message
    this.messages.push({
      role: 'user',
      content,
      timestamp: new Date(),
    });

    // Show typing indicator
    const spinner = ora('AI is thinking...').start();

    try {
      const response = await this.callAPI();
      
      spinner.succeed('Response received');

      // Add AI response
      this.messages.push({
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        cost: response.cost,
        tokens: response.tokens,
      });

      // Display response
      console.log(chalk.blue('AI:'), response.content);
      console.log('');

    } catch (error) {
      spinner.fail('Failed to get response');
      logger.error('API call failed:', error);
      console.log(chalk.red('Failed to get AI response. Please try again.'));
    }
  }

  private async callAPI() {
    const messages = this.historyEnabled 
      ? this.messages 
      : [this.messages[0], this.messages[this.messages.length - 1]];

    const requestData = {
      modelId: this.model,
      message: messages[messages.length - 1].content, 
      temperature: this.temperature,
      maxTokens: configManager.get('defaultMaxTokens') || 2000,
    };

    const response = await axios.post(`${this.baseUrl}/api/chat/message`, requestData, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    if (response.status !== 200) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = response.data;
    
    // Handle the backend's response format
    if (data.success && data.data) {
      return {
        content: data.data.response || 'No response received',
        cost: data.data.cost || 0,
        tokens: data.data.tokenCount || 0,
      };
    } else {
      throw new Error(data.message || 'Invalid response format');
    }
  }

  private endSession() {
    const totalMessages = this.messages.length - 1; // Exclude system message
    const totalCost = this.messages.reduce((sum, m) => sum + (m.cost || 0), 0);
    
    console.log(chalk.cyan.bold('\n👋 Chat session ended'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.yellow('Total messages:'), totalMessages);
    console.log(chalk.yellow('Total cost:'), `$${totalCost.toFixed(4)}`);
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  }
}

async function handleChat(options: any) {
  try {
    const session = new ChatSession(options);
    await session.start();
  } catch (error) {
    logger.error('Failed to start chat session:', error);
    process.exit(1);
  }
} 