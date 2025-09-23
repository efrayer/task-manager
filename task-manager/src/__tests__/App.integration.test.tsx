import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Task Manager Integration Tests', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should render main components', () => {
      render(<App />);
      
      expect(screen.getByText('Task Manager')).toBeInTheDocument();
      expect(screen.getByText('Stay organized and get things done')).toBeInTheDocument();
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter a new task...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add Task' })).toBeInTheDocument();
    });

    it('should create a new task when form is submitted', () => {
      render(<App />);
      
      const input = screen.getByPlaceholderText('Enter a new task...');
      const addButton = screen.getByRole('button', { name: 'Add Task' });
      
      fireEvent.change(input, { target: { value: 'Test Task' } });
      fireEvent.click(addButton);
      
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('0 of 1 tasks completed')).toBeInTheDocument();
    });

    it('should toggle task completion', () => {
      render(<App />);
      
      const input = screen.getByPlaceholderText('Enter a new task...');
      fireEvent.change(input, { target: { value: 'Toggle Task' } });
      fireEvent.click(screen.getByRole('button', { name: 'Add Task' }));
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      expect(screen.getByText('0 of 1 tasks completed')).toBeInTheDocument();
      
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      expect(screen.getByText('1 of 1 tasks completed')).toBeInTheDocument();
    });

    it('should delete a task', () => {
      render(<App />);
      
      const input = screen.getByPlaceholderText('Enter a new task...');
      fireEvent.change(input, { target: { value: 'Delete Me' } });
      fireEvent.click(screen.getByRole('button', { name: 'Add Task' }));
      
      expect(screen.getByText('Delete Me')).toBeInTheDocument();
      
      const deleteButton = screen.getByRole('button', { name: 'Delete task' });
      fireEvent.click(deleteButton);
      
      expect(screen.queryByText('Delete Me')).not.toBeInTheDocument();
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    });

    it('should handle multiple tasks', () => {
      render(<App />);
      
      const input = screen.getByPlaceholderText('Enter a new task...');
      
      // Add first task
      fireEvent.change(input, { target: { value: 'Task 1' } });
      fireEvent.click(screen.getByRole('button', { name: 'Add Task' }));
      
      // Add second task
      fireEvent.change(input, { target: { value: 'Task 2' } });
      fireEvent.click(screen.getByRole('button', { name: 'Add Task' }));
      
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('0 of 2 tasks completed')).toBeInTheDocument();
      
      // Complete first task
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      
      expect(screen.getByText('1 of 2 tasks completed')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should not create empty tasks', () => {
      render(<App />);
      
      const addButton = screen.getByRole('button', { name: 'Add Task' });
      fireEvent.click(addButton);
      
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should trim whitespace from tasks', () => {
      render(<App />);
      
      const input = screen.getByPlaceholderText('Enter a new task...');
      fireEvent.change(input, { target: { value: '  Trimmed Task  ' } });
      fireEvent.click(screen.getByRole('button', { name: 'Add Task' }));
      
      expect(screen.getByText('Trimmed Task')).toBeInTheDocument();
    });

    it('should clear input after task creation', () => {
      render(<App />);
      
      const input = screen.getByPlaceholderText('Enter a new task...') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Clear Test' } });
      fireEvent.click(screen.getByRole('button', { name: 'Add Task' }));
      
      expect(input.value).toBe('');
    });
  });

  describe('Data Persistence', () => {
    it('should save tasks to localStorage', () => {
      render(<App />);
      
      const input = screen.getByPlaceholderText('Enter a new task...');
      fireEvent.change(input, { target: { value: 'Persistent Task' } });
      fireEvent.click(screen.getByRole('button', { name: 'Add Task' }));
      
      const storedData = localStorage.getItem('taskManager_tasks');
      expect(storedData).toBeTruthy();
      expect(storedData).toContain('Persistent Task');
    });

    it('should load tasks from localStorage on mount', () => {
      const existingTasks = [
        {
          id: '1',
          title: 'Existing Task',
          completed: false,
          createdAt: new Date('2023-01-01').toISOString(),
        },
      ];
      
      localStorage.setItem('taskManager_tasks', JSON.stringify(existingTasks));
      
      render(<App />);
      
      expect(screen.getByText('Existing Task')).toBeInTheDocument();
      expect(screen.getByText('0 of 1 tasks completed')).toBeInTheDocument();
    });
  });
});