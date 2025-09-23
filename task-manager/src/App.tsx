import React from 'react';
import './App.css';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import { useTasks } from './hooks/useTasks';

function App() {
  const { tasks, addTask, toggleTask, deleteTask, completedCount, totalCount } = useTasks();

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">Task Manager</h1>
        <p className="app-subtitle">Stay organized and get things done</p>
      </header>
      
      <div className="task-stats">
        <p className="stats-text">
          {totalCount === 0 
            ? "No tasks yet" 
            : `${completedCount} of ${totalCount} tasks completed`
          }
        </p>
      </div>

      <AddTask onAddTask={addTask} />
      <TaskList 
        tasks={tasks} 
        onToggleTask={toggleTask} 
        onDeleteTask={deleteTask} 
      />
    </div>
  );
}

export default App;
