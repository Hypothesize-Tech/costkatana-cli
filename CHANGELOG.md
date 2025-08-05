# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-05

### Added
- Initial release of Cost Katana CLI
- **7 Core Commands**:
  - `init` - Initialize CLI configuration
  - `test` - Test API connectivity and configuration
  - `config` - Manage CLI settings
  - `list-models` - List available AI models
  - `chat` - Interactive chat sessions
  - `analyze` - Cost analysis and reporting
  - `optimize` - Prompt optimization
- **36 AI Models** from 9 providers:
  - OpenAI: GPT-4o, GPT-4o Mini, GPT-4.1, GPT-4 Turbo, GPT-3.5 Turbo
  - Anthropic: Claude Opus 4, Claude Sonnet 4, Claude 3.7, Claude 3.5 v2, Claude Haiku 3.5
  - Google AI: Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini 2.5 Flash-Lite, Gemini 2.0 Flash, Gemini 1.5 Pro
  - AWS Bedrock: Jamba 1.5 Large/Mini, Amazon Nova Micro/Lite, Claude models
  - Cohere: Command R+, Command R, Command Light
  - Mistral AI: Mistral Large, Medium, Small
  - DeepSeek: DeepSeek Chat, DeepSeek Coder
  - Groq: Llama 3.1 8B/70B, Mixtral 8x7B
  - XAI: X-1 Mini, X-1 Hybrid
- **Rich User Interface**:
  - Beautiful ASCII art banner with gradient colors
  - Colored output with chalk
  - Progress indicators with ora
  - Interactive prompts with inquirer
- **Multiple Output Formats**:
  - Table format (default)
  - JSON format for programmatic use
  - CSV format for data analysis
- **Configuration Management**:
  - Persistent configuration with conf
  - Environment variable support
  - Configuration validation
  - Import/export capabilities
- **Error Handling**:
  - Graceful error messages
  - Debug mode support
  - Comprehensive logging
- **TypeScript Support**:
  - Full TypeScript implementation
  - Type definitions included
  - Modern ES2020+ features
- **Testing Infrastructure**:
  - Jest test framework
  - Unit tests for utilities
  - Integration tests for commands
  - Coverage reporting

### Features
- Real-time model pricing from core package
- Provider filtering and search
- Latest model indicators
- Detailed model information (capabilities, context lengths, pricing)
- Interactive configuration setup
- API connectivity testing
- Cost analysis and reporting
- Prompt optimization with export
- Multi-format output support

### Technical
- Built with TypeScript for type safety
- Modern Node.js (>=18.0.0) support
- Comprehensive error handling
- Professional logging system
- Modular architecture
- Clean code practices
- ESLint and Prettier configuration
- Jest testing framework
- NPM publishing ready

### Documentation
- Comprehensive README.md
- QuickStart guide
- API documentation
- Usage examples
- Configuration guide
- Troubleshooting section 