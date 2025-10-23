# Cost Katana CLI 🥷

**Chat with AI from your terminal. Track costs automatically.**

```bash
$ cost-katana chat

You: Hello!
AI: Hi! How can I help you today?
💰 Cost: $0.0001

You: Write me a Python function
AI: Here's a Python function...
💰 Session: $0.0023
```

Simple. Powerful. Cost-aware.

## Installation

```bash
npm install -g cost-katana-cli
```

## Quick Start

### 1. Setup (One-time)

```bash
cost-katana init
```

Answer 2 questions:
1. Your API key (from [costkatana.com](https://costkatana.com))
2. Your default AI model

Done! ✅

### 2. Start Chatting

```bash
cost-katana chat
```

That's it!

---

## 📚 **More Examples**

**Looking for more comprehensive examples?** Check out our complete examples repository

**🔗 [github.com/Hypothesize-Tech/costkatana-examples](https://github.com/Hypothesize-Tech/costkatana-examples)**

**What's included:**
- ✅ 44 feature sections covering every Cost Katana capability
- ✅ CLI examples and guides in [Section 9](https://github.com/Hypothesize-Tech/costkatana-examples/tree/main/9-cli)
- ✅ HTTP REST API examples (`.http` files)
- ✅ TypeScript/Node.js examples
- ✅ Python SDK examples
- ✅ Framework integrations (Express, Next.js, Fastify, NestJS, FastAPI)
- ✅ Real-world use cases with best practices

**Popular examples:**
- [CLI Examples](https://github.com/Hypothesize-Tech/costkatana-examples/tree/main/9-cli) - Complete CLI guides
- [Cost Tracking](https://github.com/Hypothesize-Tech/costkatana-examples/tree/main/1-cost-tracking) - Track costs across all providers
- [Webhooks](https://github.com/Hypothesize-Tech/costkatana-examples/tree/main/10-webhooks) - Real-time notifications
- [Workflows](https://github.com/Hypothesize-Tech/costkatana-examples/tree/main/13-workflows) - Multi-step AI orchestration
- [Semantic Caching](https://github.com/Hypothesize-Tech/costkatana-examples/tree/main/14-cache) - 30-40% cost reduction

---

## Essential Commands

### Chat with AI

```bash
# Start interactive chat
cost-katana chat

# Use specific model
cost-katana chat --model claude-3-sonnet

# With system prompt
cost-katana chat --system "You are a coding expert"
```

### Quick Question (No chat mode)

```bash
# Ask a single question
cost-katana ask "What is the capital of France?"

# Save answer to file
cost-katana ask "Explain Python" --output answer.txt

# Use different model
cost-katana ask "Write a poem" --model gpt-4
```

### Analyze Costs

```bash
# See your spending
cost-katana analyze

# Last 7 days
cost-katana analyze --days 7

# Export to CSV
cost-katana analyze --export costs.csv
```

### List Models

```bash
# See available models
cost-katana models

# Filter by provider
cost-katana models --provider openai

# Show with prices
cost-katana models --prices
```

## Chat Session Commands

While in a chat session, you can use:

- `help` - Show commands
- `cost` - Show session cost
- `models` - Switch model
- `clear` - Clear history
- `save` - Save conversation
- `quit` - Exit

## Advanced Features

### Cost Optimization

```bash
# Enable Cortex (70-95% savings)
cost-katana chat --cortex

# Enable caching
cost-katana chat --cache
```

### Compare Models

```bash
# Compare costs across models
cost-katana compare "Explain AI" --models gpt-4,claude-3-sonnet,gemini-pro
```

### Budget Tracking

```bash
# Set daily budget
cost-katana budget set --daily 10

# Check budget status
cost-katana budget status

# Get alerts
cost-katana budget alerts
```

## Configuration

### View Config

```bash
cost-katana config
```

### Update Settings

```bash
# Change default model
cost-katana config set model gpt-4

# Set temperature
cost-katana config set temperature 0.7

# Set daily limit
cost-katana config set daily-limit 5
```

### Environment Variables

```bash
# Alternative to init command
export COST_KATANA_API_KEY="dak_your_key"
export COST_KATANA_MODEL="gpt-4"
```

## Real-World Examples

### Code Assistant

```bash
$ cost-katana chat --system "You are a senior developer. Be concise."

You: Review this code: [paste code]
AI: Here are the issues...
💰 Cost: $0.0045

You: How do I fix issue #2?
AI: Here's how to fix it...
💰 Session: $0.0067
```

### Content Writer

```bash
$ cost-katana chat --model gpt-4 --cortex

You: Write a blog post about AI
AI: [Generates comprehensive post with 70% cost savings]
💰 Cost: $0.0123 (saved $0.041 with Cortex!)
```

### Quick Answers

```bash
# Get quick answers without entering chat mode
$ cost-katana ask "What's the weather API for Node.js?"
> Use the 'axios' library to call weather APIs like OpenWeatherMap...
💰 Cost: $0.0002

$ cost-katana ask "Python sort list by date" --output answer.md
✅ Saved to answer.md
💰 Cost: $0.0003
```

## Tips

### Save Money

```bash
# Use cheaper models for simple tasks
cost-katana chat --model gpt-3.5-turbo    # 10x cheaper

# Enable optimization for long content
cost-katana chat --cortex                  # 70-95% savings

# Cache repeated queries
cost-katana chat --cache                   # Free repeated answers
```

### Productivity

```bash
# Save conversations
cost-katana chat --output session.json

# Load previous conversation
cost-katana chat --file session.json

# Pipe output
cost-katana ask "List of AI models" | grep gpt
```

## Comparison

### Traditional AI CLIs

```bash
# Complex setup
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."

# Different commands for each provider
openai chat
anthropic messages create
```

### Cost Katana CLI

```bash
# Simple setup
cost-katana init

# One command for all providers
cost-katana chat

# Automatic cost tracking!
```

## Troubleshooting

### "API key not found"

```bash
# Run init again
cost-katana init

# Or set environment variable
export COST_KATANA_API_KEY="dak_your_key"
```

### "Model not available"

```bash
# See available models
cost-katana models

# Try a different model
cost-katana chat --model gpt-3.5-turbo
```

### "Rate limit exceeded"

```bash
# CLI automatically retries
# If persistent, try different model:
cost-katana chat --model claude-3-haiku
```

## Dashboard Integration

All your CLI usage is tracked at [costkatana.com/dashboard](https://costkatana.com/dashboard):

- Real-time cost tracking
- Usage by model
- Daily/weekly/monthly stats
- Budget alerts
- Optimization tips

```bash
# Every command is tracked
cost-katana chat
cost-katana ask "Hello"

# View at: https://costkatana.com/dashboard
```

## Why Cost Katana CLI?

✅ **Simple**: 2-step setup, then just `cost-katana chat`  
✅ **Universal**: Works with all AI providers  
✅ **Cost-Aware**: See costs in real-time  
✅ **Optimized**: Built-in 70-95% cost reduction  
✅ **Tracked**: Everything logged to dashboard  
✅ **Beautiful**: Clean, colorful terminal UI  

## Support

- **Documentation**: https://docs.costkatana.com/cli
- **Dashboard**: https://costkatana.com
- **GitHub**: https://github.com/Hypothesize-Tech/costkatana-cli
- **Discord**: https://discord.gg/Wcwzw8wM
- **Email**: support@costkatana.com

## License

MIT © Cost Katana

---

**Start chatting with AI in your terminal!**

```bash
npm install -g cost-katana-cli
cost-katana init
cost-katana chat
```