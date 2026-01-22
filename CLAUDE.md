# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Repository Structure

```
.
├── task-manager/    # React TypeScript task management app
└── CLAUDE.md        # This file
```

## Projects

### task-manager

A React TypeScript task management application with localStorage persistence.

**Location:** `task-manager/`

**Commands (run from task-manager directory):**
```bash
npm start              # Dev server at http://localhost:3000
npm test               # Run tests in watch mode
npm test -- --coverage # Run tests with coverage
npm run build          # Production build
```

**Key files:**
- `src/App.tsx` - Main container component
- `src/hooks/useTasks.ts` - State management and persistence
- `src/components/` - UI components (AddTask, TaskList, TaskItem)
- `src/types/Task.ts` - TypeScript interfaces

See `task-manager/CLAUDE.md` for detailed architecture documentation.

## General Conventions

- TypeScript with strict mode enabled
- React functional components with hooks
- Tests use React Testing Library + Jest
- CSS files colocated with components
