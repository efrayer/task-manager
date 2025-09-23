import { renderHook, act } from '@testing-library/react';
import { useTasks } from '../useTasks';

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

describe('useTasks Hook - Core Functionality', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize with empty tasks', () => {
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.tasks).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.completedCount).toBe(0);
  });

  it('should add a new task', () => {
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.addTask({ title: 'Test Task' });
    });
    
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Test Task');
    expect(result.current.tasks[0].completed).toBe(false);
    expect(result.current.totalCount).toBe(1);
    expect(result.current.completedCount).toBe(0);
  });

  it('should toggle task completion', () => {
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.addTask({ title: 'Toggle Task' });
    });
    
    const taskId = result.current.tasks[0].id;
    
    act(() => {
      result.current.toggleTask(taskId);
    });
    
    expect(result.current.tasks[0].completed).toBe(true);
    expect(result.current.completedCount).toBe(1);
    
    act(() => {
      result.current.toggleTask(taskId);
    });
    
    expect(result.current.tasks[0].completed).toBe(false);
    expect(result.current.completedCount).toBe(0);
  });

  it('should delete a task', () => {
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.addTask({ title: 'Delete Me' });
    });
    
    const taskId = result.current.tasks[0].id;
    
    act(() => {
      result.current.deleteTask(taskId);
    });
    
    expect(result.current.tasks).toHaveLength(0);
    expect(result.current.totalCount).toBe(0);
  });

  it('should handle multiple tasks correctly', () => {
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.addTask({ title: 'Task 1' });
      result.current.addTask({ title: 'Task 2' });
      result.current.addTask({ title: 'Task 3' });
    });
    
    expect(result.current.totalCount).toBe(3);
    expect(result.current.completedCount).toBe(0);
    
    act(() => {
      result.current.toggleTask(result.current.tasks[0].id);
      result.current.toggleTask(result.current.tasks[2].id);
    });
    
    expect(result.current.completedCount).toBe(2);
    
    act(() => {
      result.current.deleteTask(result.current.tasks[1].id);
    });
    
    expect(result.current.totalCount).toBe(2);
    expect(result.current.completedCount).toBe(2);
  });

  it('should save tasks to localStorage', () => {
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.addTask({ title: 'Persistent Task' });
    });
    
    const storedData = localStorage.getItem('taskManager_tasks');
    expect(storedData).toBeTruthy();
    expect(storedData).toContain('Persistent Task');
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage.getItem to throw an error
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = jest.fn(() => {
      throw new Error('Storage error');
    });
    
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.tasks).toEqual([]);
    
    // Restore original function
    localStorage.getItem = originalGetItem;
  });
});