# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript task management application built with Create React App. The app allows users to create, complete, and delete tasks with localStorage persistence.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm start

# Run tests in interactive watch mode
npm test

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test -- --testNamePattern="integration"

# Build for production
npm run build
```

## Architecture

### Core Structure
- **App Component** (`src/App.tsx`): Main container that orchestrates the task management UI and displays task statistics
- **useTasks Hook** (`src/hooks/useTasks.ts`): Central state management for all task operations with localStorage persistence
- **Task Interface** (`src/types/Task.ts`): TypeScript definitions for Task and TaskFormData

### Component Hierarchy
```
App
├── AddTask (task creation form)
├── TaskList (container for task items)
│   └── TaskItem (individual task with checkbox and delete)
```

### State Management
The `useTasks` hook manages all task state and provides:
- `tasks`: Array of all tasks
- `addTask(taskData)`: Creates new task with generated ID
- `toggleTask(id)`: Toggles completion status
- `deleteTask(id)`: Removes task
- `completedCount`, `totalCount`: Computed statistics

### Data Flow
1. Tasks are loaded from localStorage on app initialization
2. All task mutations automatically save to localStorage via useEffect
3. Task IDs are generated using `Date.now() + Math.random()`
4. Form validation prevents empty/whitespace-only tasks

### Testing Strategy
- **Integration tests**: `src/__tests__/App.integration.test.tsx` - Full app behavior
- **Unit tests**: `src/hooks/__tests__/useTasks.simple.test.ts` - Hook logic
- Uses React Testing Library with Jest
- Mocks localStorage for persistence testing
- Covers happy path, edge cases, and error conditions

### Key Patterns
- Functional components with TypeScript interfaces
- Custom hooks for business logic separation
- CSS modules for component styling
- Prop drilling for simple state management (no external state library)
- Error handling for localStorage failures with console warnings