# Antigravity Awesome Skills

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Anthropic-purple)](https://claude.ai)
[![Gemini CLI](https://img.shields.io/badge/Gemini%20CLI-Google-blue)](https://github.com/google-gemini/gemini-cli)
[![Cursor](https://img.shields.io/badge/Cursor-AI%20IDE-orange)](https://cursor.sh)
[![Copilot](https://img.shields.io/badge/GitHub%20Copilot-VSCode-lightblue)](https://github.com/features/copilot)

**Antigravity Awesome Skills** is a library of **567+ standardized agentic skills** designed for AI coding assistants.

These markdown-based skills provide specific context, protocols, and best practices to AI agents (Claude Code, Gemini CLI, Cursor, etc.), enabling them to perform specialized tasks accurately.

## Table of Contents

- [Overview](#overview)
- [New Features](#new-features)
- [Installation](#installation)
- [Usage](#usage)
- [Quality Standards](#quality-standards)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

AI models have broad general knowledge but lack specific context about specialized workflows or domain-specific standards. **Skills** bridge this gap by providing structured instructions (in `SKILL.md` format) that define:
- **When to use** a specific capability.
- **Step-by-step procedures** for execution.
- **Best practices** and anti-patterns.

This repository aggregates official skills from Anthropic, OpenAI, Google, and Vercel, alongside community-verified capabilities.

## New Features

### 🛡️ Strict Validation & Quality Control
We have introduced a rigorous CI/CD pipeline to ensure high reliability:
- **Automated Validation**: All skills are checked for structure, metadata consistency, and folder naming conventions.
- **Node.js-based CI**: Replaced legacy Python scripts with a faster, more reliable Node.js validation suite (`npm run validate:strict`).
- **Slop Reduction**: Automated scripts (`fix-when-to-use.js`) now proactively identify and fix repetitive "slop" text and inconsistent formatting.

### 🧹 Content Cleanup
To improve the signal-to-noise ratio, we have performed a major cleanup:
- **Removed Low-Quality Skills**: Deprecated skills with empty placeholders ("XXX"), broken links, or generic "fluff".
- **Standardized Formats**: Enforced the `SKILL.md` anatomy across the board.
- **Eliminated Duplicates**: Merged or removed redundant skills to prevent agent confusion.

## Installation

### Option A: npx (Recommended)

```bash
# Install to default universal path (~/.agent/skills)
npx antigravity-awesome-skills

# For specific tools
npx antigravity-awesome-skills --cursor
npx antigravity-awesome-skills --claude
```

### Option B: git clone

```bash
git clone https://github.com/sickn33/antigravity-awesome-skills.git .agent/skills
```

**Note for Windows Users**: This repository uses symlinks. If you encounter issues, ensure Developer Mode is enabled or run Git as Administrator:
```bash
git clone -c core.symlinks=true https://github.com/sickn33/antigravity-awesome-skills.git .agent/skills
```

## Usage

Once installed, invoke skills naturally in your AI assistant's prompt:

> "Use **@brainstorming** to plan a SaaS MVP."

> "Run **@lint-and-validate** on this file."

### Compatibility

| Tool | Path | Invocation |
| :--- | :--- | :--- |
| **Claude Code** | `.claude/skills/` | `>> /skill-name help me...` |
| **Gemini CLI** | `.gemini/skills/` | `Use skill-name...` |
| **Antigravity** | `.agent/skills/` | `Use skill...` |
| **Cursor** | `.cursor/skills/` | `@skill-name` (in Chat) |

## Quality Standards

We enforce a "No Slop" policy for all skills:
1.  **High Signal, Low Noise**: Skills must provide concrete, actionable steps, not generic advice.
2.  **Standard Structure**: Every skill follows the [SKILL Anatomy](docs/SKILL_ANATOMY.md).
3.  **Verified**: Skills must pass `npm run validate:strict` before merging.

## Contributing

1.  Fork the repository.
2.  Create a directory in `skills/` (must match skill name).
3.  Add `SKILL.md`.
4.  Run validation: `npm run validate`.
5.  Submit a Pull Request.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Credits

Special thanks to the open-source community, including [Anthropic](https://github.com/anthropics/skills), [OpenAI](https://github.com/openai/skills), and [Vercel Labs](https://github.com/vercel-labs/agent-skills) for their official contributions.
