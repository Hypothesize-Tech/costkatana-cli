# Cost Katana CLI - Quick Start

Get started in 3 simple steps!

## Step 1: Install

```bash
npm install -g cost-katana-cli
```

## Step 2: Initialize

```bash
cost-katana init
```

You'll be asked for:
1. **API Key** - Get from [costkatana.com/settings](https://costkatana.com/settings)
2. **Default Model** - Choose your preferred AI (we'll suggest popular ones)

That's it! ✅

## Step 3: Use It

### Start Chatting

```bash
cost-katana chat
```

```
You: Hello!
AI: Hi! How can I help you today?
💰 Cost: $0.0001

You: Explain quantum computing
AI: Quantum computing uses quantum mechanics principles...
💰 Session: $0.0023
```

### Ask Quick Questions

```bash
cost-katana ask "What is the capital of France?"
```

```
> Paris is the capital of France.
💰 Cost: $0.0001
```

### Check Your Spending

```bash
cost-katana analyze
```

```
📊 Cost Analysis (Last 30 Days)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Cost:      $12.45
Total Requests:  1,234
Average/Request: $0.0101

Top Models:
• gpt-4:         $8.20 (659 requests)
• gpt-3.5-turbo: $4.25 (575 requests)
```

## Common Commands

```bash
# Chat with AI
cost-katana chat

# Quick question
cost-katana ask "Your question"

# Analyze costs
cost-katana analyze

# List models
cost-katana models

# Check config
cost-katana config
```

## Tips

### Save Money

```bash
# Use cheaper model for simple tasks
cost-katana chat --model gpt-3.5-turbo

# Enable optimization
cost-katana chat --cortex

# Use caching
cost-katana chat --cache
```

### Productivity

```bash
# Use system prompts
cost-katana chat --system "You are a Python expert"

# Save conversations
cost-katana chat --output chat.json

# Load conversations
cost-katana chat --file chat.json
```

## Need Help?

```bash
# Show all commands
cost-katana --help

# Help for specific command
cost-katana chat --help

# Enable debug mode
cost-katana --debug chat
```

## What's Next?

1. **Read the full README**: More features and examples
2. **Visit your dashboard**: [costkatana.com/dashboard](https://costkatana.com/dashboard)
3. **Join Discord**: [discord.gg/Wcwzw8wM](https://discord.gg/Wcwzw8wM)

---

**You're ready to chat with AI!** 🚀

```bash
cost-katana chat
```