# Cost Katana CLI - Quick Start Guide

## 🚀 Getting Started

### 1. Installation
```bash
npm install -g ai-cost-optimizer-cli
```

### 2. Initialize Configuration
```bash
cost-katana init
```

Follow the prompts to set up:
- Your API key
- Base URL (default: https://cost-katana-backend.store)
- Default model
- Advanced settings (optional)

### 3. Test Your Setup
```bash
cost-katana test
```

This will verify your configuration and API connectivity.

### 4. Start Using the CLI

#### Chat with AI
```bash
cost-katana chat
```

#### Analyze Costs
```bash
cost-katana analyze
```

#### Optimize Prompts
```bash
cost-katana optimize --prompt "Your prompt here"
```

#### List Available Models
```bash
cost-katana list-models
```

## 🎯 Key Features

### Interactive Chat
- Real-time conversation with AI models
- Built-in commands: `help`, `clear`, `history`, `stats`
- Cost tracking and session statistics

### Cost Analysis
- Detailed cost breakdown by model and provider
- Usage trends and insights
- Export to CSV, JSON, or table format

### Prompt Optimization
- Automatic cost reduction suggestions
- Quality assessment
- Multiple optimization techniques

### Model Management
- Browse available models
- Compare pricing and capabilities
- Filter by provider

## 🔧 Configuration

### View Current Config
```bash
cost-katana config --list
```

### Set Configuration
```bash
cost-katana config --set apiKey=your_key_here
cost-katana config --set defaultModel=gpt-4
```

### Export/Import Config
```bash
cost-katana config --export config.json
cost-katana config --import config.json
```

## 📊 Examples

### Basic Usage
```bash
# Start a chat session
cost-katana chat

# Analyze last 7 days
cost-katana analyze --days 7

# Optimize a prompt for 30% cost reduction
cost-katana optimize --prompt "Write a detailed essay" --target-cost 30

# List OpenAI models
cost-katana list-models --provider openai
```

### Advanced Usage
```bash
# Chat with specific model and temperature
cost-katana chat --model gpt-4 --temperature 0.8

# Export analysis to CSV
cost-katana analyze --format csv --export analysis.csv

# Optimize from file
cost-katana optimize --file prompt.txt --output optimized.txt

# Verbose model listing
cost-katana list-models --verbose --format json
```

## 🆘 Troubleshooting

### Common Issues

1. **"Missing configuration" error**
   - Run `cost-katana init` to set up configuration

2. **API connectivity issues**
   - Check your API key and base URL
   - Run `cost-katana test` to diagnose

3. **Permission denied**
   - Make sure the CLI is executable: `chmod +x bin/cost-katana.js`

### Debug Mode
```bash
cost-katana --debug [command]
```

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore all available commands with `cost-katana --help`
- Check out the [API Documentation](https://github.com/Hypothesize-Tech/ai-cost-optimizer-backend) for backend details

## 🎉 You're Ready!

Your Cost Katana CLI is now set up and ready to help you optimize AI costs and improve your AI workflows! 