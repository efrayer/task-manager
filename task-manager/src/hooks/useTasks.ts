import { useState, useCallback, useEffect } from 'react';
import { Task, TaskFormData } from '../types/Task';

const TASKS_STORAGE_KEY = 'taskManager_tasks';

const loadTasksFromStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
    }
  } catch (error) {
    console.warn('Failed to load tasks from localStorage:', error);
  }
  return [];
};

const saveTasksToStorage = (tasks: Task[]) => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.warn('Failed to save tasks to localStorage:', error);
  }
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(loadTasksFromStorage);

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  const addTask = useCallback((taskData: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: taskData.title,
      completed: false,
      createdAt: new Date(),
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    completedCount,
    totalCount,
  };
};