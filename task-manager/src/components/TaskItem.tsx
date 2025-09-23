import React from 'react';
import { Task } from '../types/Task';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
          className="task-checkbox"
        />
        <span className="task-title">{task.title}</span>
      </div>
      <button
        onClick={onDelete}
        className="delete-button"
        aria-label="Delete task"
      >
        ✕
      </button>
    </div>
  );
};

export default TaskItem;