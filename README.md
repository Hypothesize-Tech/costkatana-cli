# Cost Katana CLI

A powerful command-line interface for AI Cost Optimizer - Track, analyze, and optimize AI API costs across multiple providers.

## 🚀 Features

- **Interactive Chat Sessions** - Chat with AI models directly from the command line
- **Cost Analysis** - Analyze usage patterns and identify cost optimization opportunities
- **Prompt Optimization** - Automatically optimize prompts for cost reduction
- **Model Management** - List and compare available AI models
- **Configuration Management** - Easy setup and configuration management
- **Rich Output Formats** - Support for table, JSON, and CSV output formats

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

This will guide you through setting up:
- API key
- Base URL
- Default model
- Advanced settings (temperature, max tokens, etc.)

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

#### Optimize Prompts
```bash
cost-katana optimize [options]
```
Options:
- `-p, --prompt <text>` - Prompt to optimize
- `-f, --file <path>` - File containing prompt to optimize
- `-m, --model <model>` - Target model for optimization
- `-t, --target-cost <cost>` - Target cost reduction percentage
- `-o, --output <path>` - Output file for optimized prompt
- `-v, --verbose` - Show detailed optimization steps

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

### Prompt Optimization
```bash
# Optimize a prompt
cost-katana optimize --prompt "Write a detailed essay about climate change"

# Optimize from file
cost-katana optimize --file prompt.txt --output optimized.txt

# Target 30% cost reduction
cost-katana optimize --prompt "..." --target-cost 30
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

- **Documentation**: [Link to documentation]
- **Issues**: [GitHub Issues](https://github.com/Hypothesize-Tech/ai-cost-optimizer-cli/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Hypothesize-Tech/ai-cost-optimizer-cli/discussions)

## 🔗 Related Projects

- [AI Cost Optimizer Core](https://github.com/Hypothesize-Tech/ai-cost-optimizer-core) - Core library
- [AI Cost Optimizer Backend](https://github.com/Hypothesize-Tech/ai-cost-optimizer-backend) - Backend API
- [AI Cost Optimizer Frontend](https://github.com/Hypothesize-Tech/ai-cost-optimizer-frontend) - Web interface
