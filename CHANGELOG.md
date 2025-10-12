# Changelog

All notable changes to Cost Katana CLI will be documented in this file.

## [2.0.0] - 2025-01-XX

### 🚀 Major Release: Complete Simplification

Complete redesign to make the CLI as simple as possible while keeping all power features.

### ✨ New Features

#### New Simple Commands
- **`ask`** - Ask quick questions without entering chat mode
  ```bash
  cost-katana ask "What is Python?"
  ```

- **`models`** - List available models with prices
  ```bash
  cost-katana models --prices
  ```

- **`compare`** - Compare costs across models
  ```bash
  cost-katana compare "Test question" --models gpt-4,claude-3-sonnet
  ```

#### Improved Commands
- **`chat`** - Simplified with better UX
- **`init`** - Streamlined 2-question setup
- **`analyze`** - Cleaner output and better insights

### 💥 Breaking Changes

#### Package Name
- **Old**: `ai-cost-optimizer-cli`
- **New**: `cost-katana-cli`

**Migration**:
```bash
npm uninstall -g ai-cost-optimizer-cli
npm install -g cost-katana-cli
```

#### Dependencies
- Updated to use `cost-katana@2.0.0` (was `ai-cost-tracker@1.x`)
- Simpler API integration

### 📚 Documentation

- **Completely rewritten README**: Focus on essential commands
- **Simplified QUICKSTART**: 3-step process
- **Better examples**: Real-world use cases

### 🎯 Command Structure

#### Essential Commands (Most Users)
1. `cost-katana init` - One-time setup
2. `cost-katana chat` - Interactive AI chat
3. `cost-katana ask` - Quick questions
4. `cost-katana models` - List models
5. `cost-katana compare` - Compare costs
6. `cost-katana analyze` - View spending
7. `cost-katana config` - Manage settings

#### Advanced Commands (Power Users)
- `budget`, `analytics`, `optimize`, `track`
- `craft-workflow`, `simulate-cost`, `bulk-optimize`
- All legacy commands still available

### 🗑️ What Changed

- Reorganized command imports (essential → advanced → legacy)
- Cleaner help output
- Better error messages
- Improved terminal UI

### 📦 Examples

```bash
# Before (v1.x)
npm install -g ai-cost-optimizer-cli
cost-katana init
# ... complex setup ...
cost-katana chat --model gpt-4 --temperature 0.7 --max-tokens 500

# After (v2.0)
npm install -g cost-katana-cli
cost-katana init
cost-katana chat
```

---

## [1.0.19] - 2024-XX-XX

### Added
- Cortex meta-language support
- Dynamic instruction generation
- Bulk optimization features

### Fixed
- Chat session stability
- Configuration file handling

---

## [1.0.0] - 2024-XX-XX

### Initial Release
- Interactive chat sessions
- Cost analysis
- Model management
- Configuration management