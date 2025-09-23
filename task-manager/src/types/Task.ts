export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface TaskFormData {
  title: string;
}