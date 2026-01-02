# CLAUDE.md - AI Assistant Guide

> **Last Updated:** 2026-01-02
> **Repository:** AI- (Built with AI Studio/Gemini)

This document provides guidance for AI assistants working with this codebase. It outlines the repository structure, development workflows, and key conventions to follow.

---

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Repository Structure](#repository-structure)
3. [Development Workflow](#development-workflow)
4. [Git Conventions](#git-conventions)
5. [Code Conventions](#code-conventions)
6. [Key Principles](#key-principles)
7. [Common Tasks](#common-tasks)
8. [File Organization](#file-organization)

---

## Repository Overview

This repository was initialized with AI Studio (Google Gemini). It is currently in early development stages.

**Current Status:**
- Fresh repository with initial commit
- Minimal structure (README.md only)
- Ready for project scaffolding and development

**Technology Stack:**
- To be determined based on project requirements
- Originally initialized with Gemini AI Studio tools

---

## Repository Structure

```
AI-/
├── .git/              # Git version control
├── README.md          # Project overview and documentation
└── CLAUDE.md          # This file - AI assistant guidance
```

### Expected Future Structure

As the project grows, expect the following structure:

```
AI-/
├── src/               # Source code
│   ├── components/    # Reusable components
│   ├── utils/         # Utility functions
│   ├── services/      # Business logic and API services
│   └── config/        # Configuration files
├── tests/             # Test files
├── docs/              # Additional documentation
├── scripts/           # Build and utility scripts
├── .gitignore         # Git ignore rules
├── package.json       # Dependencies (if Node.js/JavaScript)
├── README.md          # Project documentation
└── CLAUDE.md          # AI assistant guide (this file)
```

---

## Development Workflow

### Branch Strategy

**Main Branches:**
- `main` or `master`: Primary branch for production-ready code
- Feature branches: Use `claude/` prefix for AI-assisted development

**Branch Naming Convention:**
- Feature branches: `claude/descriptive-name-<session-id>`
- Bug fixes: `fix/issue-description`
- Enhancements: `enhance/feature-name`

### Current Development Branch

All current development should occur on:
```
claude/claude-md-mjx49acgx6e1q9f2-BZJUv
```

---

## Git Conventions

### Commit Messages

Follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): add user authentication system
fix(api): resolve timeout issue in data fetching
docs(readme): update installation instructions
refactor(utils): simplify date formatting logic
```

### Git Operations Best Practices

1. **Always check current branch before committing:**
   ```bash
   git status
   git branch
   ```

2. **Stage and commit related changes together:**
   ```bash
   git add <files>
   git commit -m "message"
   ```

3. **Push to remote with tracking:**
   ```bash
   git push -u origin <branch-name>
   ```

4. **Keep commits atomic and focused:**
   - One logical change per commit
   - Commit messages should be clear and descriptive
   - Avoid committing unrelated changes together

---

## Code Conventions

### General Principles

1. **Readability over Cleverness**
   - Write code that is easy to understand
   - Use descriptive variable and function names
   - Add comments only when logic isn't self-evident

2. **Consistency**
   - Follow existing patterns in the codebase
   - Match the style of surrounding code
   - Use consistent naming conventions

3. **Simplicity**
   - Avoid over-engineering
   - Don't add features beyond requirements
   - Keep abstractions minimal and purposeful

### Naming Conventions

**Files:**
- Use kebab-case for file names: `user-service.js`, `api-client.ts`
- Use PascalCase for component files: `UserProfile.jsx`, `LoginForm.tsx`
- Use lowercase for config files: `config.json`, `.env`

**Variables and Functions:**
- Use camelCase: `getUserData()`, `isAuthenticated`
- Use descriptive names: `userProfile` not `up`
- Boolean variables should be predicates: `isLoading`, `hasError`

**Constants:**
- Use UPPER_SNAKE_CASE: `API_BASE_URL`, `MAX_RETRY_COUNT`

**Classes:**
- Use PascalCase: `UserService`, `DataProcessor`

### Code Organization

1. **Imports:**
   - Group imports logically (external, internal, relative)
   - Sort alphabetically within groups
   - Remove unused imports

2. **Function Length:**
   - Keep functions focused on a single responsibility
   - Extract complex logic into helper functions
   - Aim for functions under 50 lines

3. **File Length:**
   - Keep files focused and cohesive
   - Split large files into smaller modules
   - Aim for files under 300 lines

---

## Key Principles

### For AI Assistants Working on This Codebase

1. **Read Before Writing**
   - Always read existing files before modifying
   - Understand the current patterns and conventions
   - Never propose changes to code you haven't examined

2. **Minimal Changes**
   - Only make changes directly requested
   - Avoid "improvements" beyond scope
   - Don't add features, refactor unnecessarily, or over-engineer

3. **Security First**
   - Watch for security vulnerabilities (XSS, SQL injection, etc.)
   - Validate user input at system boundaries
   - Don't add unnecessary error handling for impossible scenarios

4. **Test Your Changes**
   - Ensure code runs without errors
   - Test edge cases when relevant
   - Don't break existing functionality

5. **Clean Commits**
   - Stage related changes together
   - Write clear commit messages
   - Don't commit secrets or sensitive data

6. **Documentation**
   - Update documentation when changing behavior
   - Keep README.md and CLAUDE.md current
   - Document non-obvious design decisions

---

## Common Tasks

### Setting Up Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd AI-

# Check current branch
git status

# Create a new feature branch (if needed)
git checkout -b claude/feature-name-<session-id>
```

### Making Changes

```bash
# 1. Read the relevant files first
# Use Read tool to examine code

# 2. Make your changes
# Use Edit or Write tools

# 3. Check what changed
git status
git diff

# 4. Stage changes
git add <files>

# 5. Commit with descriptive message
git commit -m "feat(scope): description"

# 6. Push to remote
git push -u origin <branch-name>
```

### Creating Pull Requests

```bash
# Ensure branch is up to date
git fetch origin
git status

# Push changes
git push -u origin <branch-name>

# Create PR using GitHub CLI
gh pr create --title "Title" --body "Description"
```

---

## File Organization

### When Adding New Files

1. **Determine the Right Location**
   - Source code → `src/`
   - Tests → `tests/` or `__tests__/`
   - Documentation → `docs/`
   - Scripts → `scripts/`

2. **Follow Existing Patterns**
   - Match naming conventions
   - Use similar directory structure
   - Group related files together

3. **Update Related Documentation**
   - Update README.md if user-facing
   - Update CLAUDE.md if affects AI workflow
   - Add inline documentation as needed

### File Types and Their Locations

| Type | Location | Example |
|------|----------|---------|
| Source code | `src/` | `src/services/api.js` |
| Components | `src/components/` | `src/components/Header.jsx` |
| Utilities | `src/utils/` | `src/utils/format.js` |
| Tests | `tests/` or `__tests__/` | `tests/api.test.js` |
| Config | Root or `config/` | `config.json` |
| Documentation | `docs/` or root | `docs/api.md` |
| Scripts | `scripts/` | `scripts/build.sh` |

---

## Project Evolution

This repository is in early stages. As it evolves:

1. **Update This Document**
   - Keep structure diagrams current
   - Add new conventions as they emerge
   - Document architectural decisions

2. **Add Project-Specific Sections**
   - API documentation
   - Database schemas
   - Deployment procedures
   - Testing strategies

3. **Maintain Consistency**
   - Enforce conventions through code review
   - Use linters and formatters
   - Update tooling as needed

---

## Questions or Issues?

When working on this codebase:

1. **Uncertain about structure?** → Explore similar patterns in the codebase
2. **Need clarification?** → Ask the user before proceeding
3. **Found inconsistencies?** → Document and discuss with the team
4. **Security concerns?** → Raise immediately and fix proactively

---

## Appendix: Tool Usage

### Recommended Tools for AI Assistants

- **Read**: Always read files before editing
- **Glob**: Find files by pattern
- **Grep**: Search code for specific patterns
- **Edit**: Make surgical changes to existing files
- **Write**: Create new files (use sparingly)
- **Bash**: Run git commands, tests, builds
- **Task**: Delegate complex exploration or planning

### Exploration Strategy

When exploring unfamiliar parts of the codebase:

1. Start with high-level structure (directory listing)
2. Read relevant documentation (README, docs/)
3. Identify entry points (main files, index files)
4. Trace dependencies and imports
5. Use Task tool for comprehensive exploration

---

**Remember:** This document is a living guide. Update it as the project evolves to ensure it remains useful for AI assistants working on this codebase.
