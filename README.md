# Cost Katana CLI 🥷

> **AI in your terminal. Costs on your screen.**

Chat with GPT-4, Claude, Gemini—all from one command. See exactly what you spend, in real-time.

---

## 🚀 Get Started in 30 Seconds

### Step 1: Install

```bash
npm install -g cost-katana-cli
```

### Step 2: Initialize

```bash
cost-katana init
```

### Step 3: Chat

```bash
cost-katana chat
```

```
You: Hello!
AI: Hi! How can I help you today?
💰 Cost: $0.0001

You: Write me a Python function to sort a list
AI: Here's a Python function...
💰 Session: $0.0023
```

**That's it.** You're now chatting with AI and tracking every cent.

---

## 📖 Tutorial: Master the CLI

### Part 1: Interactive Chat

Start a conversation that remembers context:

```bash
cost-katana chat
```

**In-session commands:**
| Command | Action |
|---------|--------|
| `help` | Show all commands |
| `cost` | Display session cost |
| `models` | Switch AI model |
| `clear` | Clear chat history |
| `save` | Export conversation |
| `quit` | Exit chat |

### Part 2: Quick Questions

Skip chat mode for one-off questions:

```bash
# Get an instant answer
cost-katana ask "What is the capital of France?"

# Save output to file
cost-katana ask "Explain recursion" --output answer.md

# Use a specific model
cost-katana ask "Write a haiku" --model gpt-4
```

### Part 3: Choose Your Model

```bash
# Use Claude for creative writing
cost-katana chat --model claude-3-sonnet

# Use GPT-4 for complex reasoning
cost-katana chat --model gpt-4

# Use GPT-3.5 for simple tasks (10x cheaper)
cost-katana chat --model gpt-3.5-turbo
```

### Part 4: Add a System Prompt

Shape the AI's personality:

```bash
# Code reviewer
cost-katana chat --system "You are a senior developer. Be concise and critical."

# Writing assistant
cost-katana chat --system "You are a professional copywriter. Focus on clarity."

# Tutor
cost-katana chat --system "You are a patient teacher. Explain concepts step by step."
```

### Part 5: Enable Cost Optimization

```bash
# Cortex: 40-75% savings on long content
cost-katana chat --cortex

# Caching: 100% savings on repeated questions
cost-katana chat --cache

# Both together
cost-katana chat --cortex --cache
```

---

## 🎯 Essential Commands

### Chat

```bash
cost-katana chat                              # Start interactive chat
cost-katana chat --model claude-3-sonnet      # Use specific model
cost-katana chat --system "Be concise"        # Add system prompt
cost-katana chat --cortex                     # Enable optimization
```

### Ask

```bash
cost-katana ask "Your question"               # Quick answer
cost-katana ask "Question" --output file.md   # Save to file
cost-katana ask "Question" --model gpt-4      # Use specific model
```

### Analyze

```bash
cost-katana analyze                           # View spending summary
cost-katana analyze --days 7                  # Last 7 days
cost-katana analyze --export costs.csv        # Export to CSV
```

### Models

```bash
cost-katana models                            # List all models
cost-katana models --provider openai          # Filter by provider
cost-katana models --prices                   # Show pricing
```

### Compare

```bash
cost-katana compare "Your prompt" --models gpt-4,claude-3-sonnet,gemini-pro
```

### Budget

```bash
cost-katana budget set --daily 10             # Set $10/day limit
cost-katana budget status                     # Check remaining budget
cost-katana budget alerts                     # View alerts
```

### Config

```bash
cost-katana config                            # View current config
cost-katana config set model gpt-4            # Change default model
cost-katana config set temperature 0.7        # Set creativity level
cost-katana config set daily-limit 5          # Set spending limit
```

---

## 🤖 Supported Models

| Provider | Models |
|----------|--------|
| **OpenAI** | GPT-5, GPT-4, GPT-4 Turbo, GPT-4o, GPT-3.5 Turbo, O1, O3 |
| **Anthropic** | Claude Sonnet 4.5, Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus |
| **Google** | Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash |
| **AWS Bedrock** | Claude, Titan, Mistral, Nova models |
| **Others** | xAI Grok, DeepSeek, Mistral AI, Cohere, Meta Llama |

Run `cost-katana models` for the complete list with pricing.

---

## ⚙️ Configuration

### Environment Variables

```bash
# Option 1: Cost Katana API Key (Recommended)
export COST_KATANA_API_KEY="dak_your_key"
export COST_KATANA_MODEL="gpt-4"

# Option 2: Direct Provider Keys (self-hosted)
export OPENAI_API_KEY="sk-..."          # Required for GPT models
export GEMINI_API_KEY="..."             # Required for Gemini models
export AWS_ACCESS_KEY_ID="..."          # For AWS Bedrock
export AWS_SECRET_ACCESS_KEY="..."
```

> ⚠️ **Self-hosted users**: You must provide your own OpenAI/Gemini API keys.

---

## 💡 Real-World Examples

### Code Review Assistant

```bash
$ cost-katana chat --system "You are a senior developer. Be concise."

You: Review this code: [paste code]
AI: Issues found:
    1. Missing error handling on line 15
    2. Inefficient loop—use map() instead
    3. Variable 'x' should be descriptive
💰 Cost: $0.0045

You: How do I fix issue #2?
AI: Replace the for loop with: const results = items.map(item => transform(item));
💰 Session: $0.0067
```

### Content Writer with Optimization

```bash
$ cost-katana chat --model gpt-4 --cortex

You: Write a blog post about machine learning trends in 2024
AI: [Generates comprehensive 1500-word post]
💰 Cost: $0.0123 (saved $0.041 with Cortex!)
```

### Quick Research

```bash
$ cost-katana ask "Best Node.js weather API libraries"
> Popular options: axios + OpenWeatherMap, node-fetch + WeatherAPI...
💰 Cost: $0.0002

$ cost-katana ask "Python datetime format examples" --output cheatsheet.md
✅ Saved to cheatsheet.md
💰 Cost: $0.0003
```

### Model Cost Comparison

```bash
$ cost-katana compare "Explain quantum computing" --models gpt-4,gpt-3.5-turbo,gemini-pro

📊 Cost Comparison

Model              Cost        Tokens    Latency
─────────────────────────────────────────────────
gpt-4              $0.0120     450       2.3s
gpt-3.5-turbo      $0.0012     420       0.8s
gemini-pro         $0.0003     435       1.1s

💡 Recommendation: gemini-pro (40x cheaper than gpt-4)
```

---

## 💰 Cost Optimization Tips

| Strategy | Savings | Command |
|----------|---------|---------|
| Use GPT-3.5 for simple tasks | 90% | `--model gpt-3.5-turbo` |
| Enable Cortex for long content | 40-75% | `--cortex` |
| Cache repeated queries | 100% | `--cache` |
| Use Gemini for high-volume | 95% | `--model gemini-pro` |

```bash
# ❌ Expensive
cost-katana chat --model gpt-4

# ✅ Smart: Match model to task
cost-katana chat --model gpt-3.5-turbo

# ✅ Smarter: Add optimization
cost-katana chat --model gpt-3.5-turbo --cortex --cache
```

---

## 🔧 Troubleshooting

### "API key not found"

```bash
cost-katana init
# or
export COST_KATANA_API_KEY="dak_your_key"
```

### "Model not available"

```bash
cost-katana models                    # See available models
cost-katana chat --model gpt-3.5-turbo  # Try alternative
```

### "Rate limit exceeded"

```bash
# CLI auto-retries. If persistent:
cost-katana chat --model claude-3-haiku  # Switch provider
```

---

## 📊 Dashboard Integration

All CLI usage syncs to [costkatana.com/dashboard](https://costkatana.com/dashboard):

- Real-time cost tracking
- Usage breakdown by model
- Daily/weekly/monthly stats
- Budget alerts
- Optimization recommendations

---

## 📚 More Examples

Explore 45+ complete examples:

**🔗 [github.com/Hypothesize-Tech/costkatana-examples](https://github.com/Hypothesize-Tech/costkatana-examples)**

| Section | Description |
|---------|-------------|
| [CLI Examples](https://github.com/Hypothesize-Tech/costkatana-examples/tree/master/9-cli) | Complete CLI guides |
| [Cost Tracking](https://github.com/Hypothesize-Tech/costkatana-examples/tree/master/1-cost-tracking) | Track costs across providers |
| [Semantic Caching](https://github.com/Hypothesize-Tech/costkatana-examples/tree/master/14-cache) | 30-40% cost reduction |
| [Workflows](https://github.com/Hypothesize-Tech/costkatana-examples/tree/master/13-workflows) | Multi-step AI orchestration |

---

## 🆚 Why Cost Katana CLI?

| Feature | Traditional CLIs | Cost Katana CLI |
|---------|------------------|-----------------|
| Setup | Multiple API keys | One command: `cost-katana init` |
| Providers | One per tool | All providers, one command |
| Cost tracking | ❌ | ✅ Real-time |
| Optimization | ❌ | ✅ 40-75% savings |
| Dashboard | ❌ | ✅ Full analytics |

---

## 📞 Support

| Channel | Link |
|---------|------|
| **Documentation** | [docs.costkatana.com/cli](https://docs.costkatana.com/cli) |
| **Dashboard** | [costkatana.com](https://costkatana.com) |
| **GitHub** | [github.com/Hypothesize-Tech/costkatana-cli](https://github.com/Hypothesize-Tech/costkatana-cli) |
| **Discord** | [discord.gg/D8nDArmKbY](https://discord.gg/D8nDArmKbY) |
| **Email** | support@costkatana.com |

---

## 📄 License

MIT © Cost Katana

---

<div align="center">

**Start chatting with AI in your terminal** 🥷

```bash
npm install -g cost-katana-cli
cost-katana init
cost-katana chat
```

</div>
