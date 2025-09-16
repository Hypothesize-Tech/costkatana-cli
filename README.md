# Cost Katana CLI

A powerful command-line interface for AI Cost Optimizer - Track, analyze, and optimize AI API costs across multiple providers.

## 🚀 Features

- **🧠 Cortex Meta-Language** - Revolutionary 3-stage AI optimization (70-95% token reduction)
- **⚡ Interactive Chat Sessions** - Chat with AI models directly from the command line
- **📊 Advanced Cost Analysis** - Analyze usage patterns and identify optimization opportunities
- **🎯 Answer Generation** - Generate complete responses in optimized LISP format
- **🔄 Dynamic Instruction Generation** - AI-powered LISP instruction generator
- **🤖 Model Management** - List and compare available AI models with Cortex support
- **⚙️ Configuration Management** - Easy setup and configuration management
- **📋 Rich Output Formats** - Support for table, JSON, and CSV output formats
- **🔗 Multi-step Workflows** - Compose and evaluate complex AI workflows
- **💰 Cost Simulation** - Run "what-if" scenarios with Cortex optimization
- **📦 Bulk Optimization** - Optimize multiple queries with Cortex processing
- **✍️ Intelligent Rewriting** - Context-aware prompt and response optimization
- **💸 Budget Management** - Set budget caps with real-time alerts and notifications

## 📦 Installation

### Global Installation
```bash
npm install -g ai-cost-optimizer-cli
```

### Local Development
```bash
git clone <repository-url>
cd ai-cost-optimizer-cli
npm install
npm run build
```

## 🛠️ Setup

### 1. Initialize Configuration
```bash
cost-katana init
```

This enhanced setup will guide you through:

#### 🔐 Required Setup
- **Project Name** - Identify your project for cost tracking
- **API Key** - Secure authentication to Cost Katana backend
- **Default Model** - Choose your preferred AI model (GPT-4, Claude, Gemini, etc.)
- **Monthly Token Budget** - Set your monthly token consumption limit

#### ⚙️ Optional Configuration
- **Base URL** - Backend API endpoint
- **Advanced Settings** - Temperature, max tokens, cost limits, features

#### 📋 Interactive Experience
- Secure password input for API keys
- Model selection with popular options
- Budget configuration in millions of tokens
- Configuration summary display
- Next steps guidance

For detailed setup instructions, see [INIT_COMMAND.md](./INIT_COMMAND.md).

### 2. Test Configuration
```bash
cost-katana test
```

## 📖 Usage

### Basic Commands

#### Initialize Configuration
```bash
cost-katana init [options]
```
Options:
- `-f, --force` - Force overwrite existing configuration
- `-k, --api-key <key>` - Set API key directly
- `-u, --base-url <url>` - Set base URL directly
- `-m, --model <model>` - Set default model directly
- `-o, --output <path>` - Output configuration file path

#### Test Configuration
```bash
cost-katana test [options]
```
Options:
- `-c, --config <path>` - Path to configuration file
- `-v, --verbose` - Show detailed test results

#### Start Chat Session
```bash
cost-katana chat [options]
```
Options:
- `-m, --model <model>` - Specify AI model to use
- `-t, --temperature <temp>` - Set temperature (0.0-2.0)
- `-s, --system <prompt>` - Set system prompt
- `-f, --file <path>` - Load conversation from file
- `-o, --output <path>` - Save conversation to file
- `--no-history` - Disable conversation history

#### Analyze Costs
```bash
cost-katana analyze [options]
```
Options:
- `-d, --days <number>` - Number of days to analyze (default: 30)
- `-m, --model <model>` - Filter by specific model
- `-p, --provider <provider>` - Filter by provider
- `-f, --format <format>` - Output format (table, json, csv)
- `-v, --verbose` - Show detailed analysis
- `--export <path>` - Export analysis to file

#### Optimize with Cortex
```bash
cost-katana optimize [options]
```
Options:
- `-p, --prompt <text>` - Query to optimize with Cortex
- `-f, --file <path>` - File containing queries to optimize
- `-m, --model <model>` - Target model for optimization
- `--cortex` - Enable Cortex meta-language optimization (70-95% savings)
- `--cortex-mode <mode>` - Cortex mode: answer_generation, prompt_optimization
- `--encoding-model <model>` - Encoder model (default: claude-3-5-sonnet)
- `--core-model <model>` - Core processor model (default: claude-opus-4-1)
- `--decoding-model <model>` - Decoder model (default: claude-3-5-sonnet)
- `--dynamic-instructions` - Enable AI-powered LISP instruction generation
- `-t, --target-cost <cost>` - Target cost reduction percentage
- `-o, --output <path>` - Output file for optimized results
- `-v, --verbose` - Show detailed optimization steps and analytics

#### List Models
```bash
cost-katana list-models [options]
```
Options:
- `-p, --provider <provider>` - Filter by provider
- `-f, --format <format>` - Output format (table, json, csv)
- `-v, --verbose` - Show detailed model information

#### Manage Configuration
```bash
cost-katana config [options]
```
Options:
- `-s, --set <key=value>` - Set a configuration value
- `-g, --get <key>` - Get a configuration value
- `-d, --delete <key>` - Delete a configuration value
- `-l, --list` - List all configuration values
- `-e, --export <path>` - Export configuration to file
- `-i, --import <path>` - Import configuration from file
- `-r, --reset` - Reset configuration to defaults

#### Craft Multi-step Workflows
```bash
cost-katana craft-workflow [options]
```
Options:
- `--name <name>` - Workflow name
- `--interactive` - Start interactive workflow builder
- `--template <template>` - Use predefined template
- `--evaluate` - Evaluate workflow cost and performance
- `--export-json` - Export workflow as JSON
- `--export-yaml` - Export workflow as YAML
- `--templates` - List available templates

#### Simulate Cost Scenarios
```bash
cost-katana simulate-cost [options]
```
Options:
- `--prompt-id <id>` - Prompt ID to simulate
- `--what-if <scenario>` - JSON scenario to simulate
- `--batch` - Run batch simulations
- `--compare-models` - Compare different models
- `--optimize-retries` - Optimize retry strategies
- `--optimize-prompt` - Optimize prompt structure
- `--historical` - Historical simulation analysis

#### Bulk Optimize Prompts
```bash
cost-katana bulk-optimize [options]
```
Options:
- `--file <path>` - CSV file with prompts to optimize
- `--strategies` - Apply optimization strategies
- `--priority` - Priority-based optimization
- `--models` - Model-specific optimization
- `--frequency` - Frequency-based optimization
- `--cost` - Cost-based optimization

#### Rewrite Prompts Intelligently
```bash
cost-katana rewrite-prompt [options]
```
Options:
- `--prompt <text>` - Original prompt to rewrite
- `--style <style>` - Rewrite style (short, concise, extractive)
- `--audience <audience>` - Target audience (technical, business, general)
- `--batch` - Rewrite multiple prompts in batch
- `--compare` - Compare different rewrite styles
- `--optimize` - Optimize for specific model

#### Set Budget and Alerts
```bash
cost-katana set-budget [options]
```
Options:
- `--project <name>` - Project name for budget tracking
- `--tokens <number>` - Token budget limit
- `--cost <amount>` - Cost budget limit in USD
- `--notify <type>` - Notification type (slack, email, webhook)
- `--thresholds <thresholds>` - Alert thresholds (e.g., 80,95)
- `--enforce` - Enable hard cap enforcement
- `--list` - List all configured budgets
- `--update` - Update existing budget
- `--delete` - Delete budget configuration
- `--status` - Check budget status and usage
- `--alerts` - Configure budget alerts
- `--test` - Test budget notifications

## 💬 Chat Commands

When in a chat session, you can use these commands:

- `help` - Show available commands
- `clear` - Clear conversation history
- `history` - Show conversation history
- `stats` - Show session statistics
- `quit` / `exit` / `bye` - End the session

## 🔧 Configuration

### Configuration Keys

- `apiKey` - Your Cost Katana API key
- `baseUrl` - Base URL for the API
- `defaultModel` - Default AI model to use
- `defaultTemperature` - Default temperature setting
- `defaultMaxTokens` - Default maximum tokens
- `costLimitPerDay` - Daily cost limit
- `enableAnalytics` - Enable analytics features
- `enableOptimization` - Enable optimization features
- `enableFailover` - Enable failover features
- `theme` - UI theme (light, dark, auto)
- `outputFormat` - Default output format

### Advanced Features

#### Workflow Templates
Predefined templates for common AI workflows:
- `legal_analysis` - Legal document analysis workflow
- `content_generation` - Content creation workflow
- `data_analysis` - Data analysis workflow
- `code_review` - Code review workflow

#### Notification Channels
Multiple notification options for budget alerts:
- **Slack** - Direct channel notifications
- **Email** - Email alerts with detailed reports
- **Webhook** - Custom webhook endpoints
- **Multi-channel** - Combine multiple notification types

#### Optimization Strategies
Different approaches for bulk optimization:
- `aggressive` - Maximum cost reduction
- `balanced` - Balance cost and quality
- `conservative` - Minimal quality impact
- `quality_first` - Prioritize quality over cost

#### Rewrite Styles
Intelligent prompt rewriting styles:
- `short` - Minimal token usage
- `concise` - Balanced approach
- `extractive` - Information extraction focus

#### Target Audiences
Audience-specific prompt optimization:
- `technical` - Technical professionals
- `business` - Business stakeholders
- `general` - General audience

### Environment Variables

You can also set configuration via environment variables:

- `API_KEY` - API key
- `COST_KATANA_BASE_URL` - Base URL
- `COST_KATANA_DEFAULT_MODEL` - Default model
- `COST_KATANA_TEMPERATURE` - Default temperature
- `COST_KATANA_MAX_TOKENS` - Default max tokens
- `COST_KATANA_COST_LIMIT` - Daily cost limit

## 📊 Examples

### Basic Chat Session
```bash
# Start a chat session
cost-katana chat

# Chat with specific model
cost-katana chat --model gpt-4

# Chat with custom temperature
cost-katana chat --temperature 0.8
```

### Cost Analysis
```bash
# Analyze last 30 days
cost-katana analyze

# Analyze last 7 days with verbose output
cost-katana analyze --days 7 --verbose

# Export analysis to CSV
cost-katana analyze --format csv --export analysis.csv
```

### 🧠 Cortex Optimization
```bash
# Enable Cortex for massive token savings (70-95% reduction)
cost-katana optimize --prompt "Write a complete REST API in Node.js" --cortex

# Use answer generation mode for complete responses
cost-katana optimize --prompt "Implement binary search algorithm" --cortex --cortex-mode answer_generation

# Bulk optimization with Cortex
cost-katana optimize --file queries.txt --cortex --dynamic-instructions --output results.json

# Advanced Cortex configuration
cost-katana optimize \
  --prompt "Create a React authentication system" \
  --cortex \
  --core-model claude-opus-4-1 \
  --encoding-model claude-3-5-sonnet \
  --dynamic-instructions \
  --verbose

# Traditional optimization (legacy)
cost-katana optimize --prompt "Write an essay about climate change" --target-cost 30
```

### Model Management
```bash
# List all models
cost-katana list-models

# List models by provider
cost-katana list-models --provider openai

# Export model list to JSON
cost-katana list-models --format json --export models.json
```

### Multi-step Workflows
```bash
# Create workflow interactively
cost-katana craft-workflow interactive

# Use predefined template
cost-katana craft-workflow --template legal_analysis

# Evaluate workflow cost
cost-katana craft-workflow evaluate --workflow workflow.json

# Export workflow
cost-katana craft-workflow export --workflow workflow.json --export-json --export-yaml

# List available templates
cost-katana craft-workflow templates
```

### Cost Simulation
```bash
# Simulate cost scenario
cost-katana simulate-cost --prompt-id prompt-123 --what-if '{"model": "claude-3-haiku", "retry": 2}'

# Compare models
cost-katana simulate-cost compare-models --prompt-id prompt-123 --models "gpt-4,claude-3-sonnet,claude-3-haiku"

# Optimize retries
cost-katana simulate-cost optimize-retries --prompt-id prompt-123

# Batch simulation
cost-katana simulate-cost batch --file scenarios.csv
```

### Bulk Optimization
```bash
# Optimize prompts from CSV file
cost-katana bulk-optimize --file prompts.csv

# Apply optimization strategies
cost-katana bulk-optimize strategies --file prompts.csv --strategy aggressive

# Priority-based optimization
cost-katana bulk-optimize priority --file prompts.csv --priority high

# Model-specific optimization
cost-katana bulk-optimize models --file prompts.csv --models "gpt-4,claude-3-sonnet"
```

### Intelligent Prompt Rewriting
```bash
# Rewrite prompt with different styles
cost-katana rewrite-prompt --prompt "Explain quantum computing" --style concise

# Target specific audience
cost-katana rewrite-prompt --prompt "Explain quantum computing" --audience technical

# Compare rewrite styles
cost-katana rewrite-prompt compare --prompt "Explain quantum computing" --styles "short,concise,extractive"

# Optimize for specific model
cost-katana rewrite-prompt optimize --prompt "Explain quantum computing" --model gpt-4

# Batch rewrite
cost-katana rewrite-prompt batch --file prompts.txt --style concise
```

### Budget Management
```bash
# Set budget with webhook notifications
cost-katana set-budget --project my-project --tokens 500000 --notify webhook --webhook-url https://hooks.slack.com/test

# Set budget with Slack notifications
cost-katana set-budget --project my-project --cost 1000 --notify slack --slack-channel #alerts

# List all budgets
cost-katana set-budget list

# Check budget status
cost-katana set-budget status --project my-project

# Configure alerts
cost-katana set-budget alerts --project my-project --enable-slack --enable-email

# Test notifications
cost-katana set-budget test --project my-project --type slack
```

## 🛠️ Development

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Setup Development Environment
```bash
# Clone repository
git clone <repository-url>
cd ai-cost-optimizer-cli

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Testing New Commands
```bash
# Test all new commands
cost-katana craft-workflow --help
cost-katana simulate-cost --help
cost-katana bulk-optimize --help
cost-katana rewrite-prompt --help
cost-katana set-budget --help

# Test with sample data
echo "prompt_id,prompt_text,model
1,Explain quantum computing,claude-3-sonnet
2,Write a business plan,gpt-4" > test-prompts.csv

cost-katana bulk-optimize --file test-prompts.csv
cost-katana rewrite-prompt --prompt "Explain quantum computing" --style concise
```

### Available Scripts
- `npm run build` - Build the project
- `npm run dev` - Watch mode for development
- `npm test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: [docs.costkatana.com](https://docs.costkatana.com)
- **Issues**: [GitHub Issues](https://github.com/Hypothesize-Tech/costkatana-cli/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Hypothesize-Tech/costkatana-cli/discussions)

## 🔗 Related Projects

- [AI Cost Optimizer Core](https://github.com/Hypothesize-Tech/costkatana-core) - Core library
- [AI Cost Optimizer Backend](https://github.com/Hypothesize-Tech/costkatana-backend) - Backend API
- [AI Cost Optimizer Frontend](https://github.com/Hypothesize-Tech/costkatana-frontend) - Web interface
