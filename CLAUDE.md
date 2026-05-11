# Project Sentinel

## Project Overview
Project Sentinel is a monorepo containing a Next.js frontend, Node.js microservices, and chaos monkey scripts.

## Tech Stack
- Frontend: Next.js (TypeScript)
- Services: Node.js (TypeScript)
- Scripts: Node.js/Bash
- Integrations: SQLite MCP for persistent state and context management

## Multi-Agent Orchestration
The project utilizes a multi-agent system for complex task resolution:
- **Main Agent**: Coordinates overall strategy and high-level planning.
- **Subagent Alpha (Debugger)**: Specializes in root cause analysis and bug isolation.
- **Subagent Beta (QA)**: Focuses on verification, regression testing, and quality assurance.

## Development Guidelines

### TypeScript Rules
- **Strict Mode**: `strict: true` must be enabled in all `tsconfig.json` files.
- **No Any**: Avoid `any`. Use `unknown` if the type is truly unknown, or define a proper interface.
- **Null Safety**: Use optional chaining and nullish coalescing instead of non-null assertions (`!`).
- **Explicit Return Types**: All exported functions must have explicit return types.

### Resolution Protocol
When resolving bugs or implementing features, follow these steps:
1. **Investigation**: Use `grep` and `read` to identify the root cause and affected components.
2. **Planning**: Use `EnterPlanMode` for non-trivial changes to align on the approach.
3. **Implementation**: Implement changes using the smallest possible diff.
4. **Verification**: Run existing tests and create new test cases to verify the fix/feature.
5. **Review**: Ensure code adheres to the TypeScript rules and project architecture.
