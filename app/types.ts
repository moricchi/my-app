export interface Task {
    id: number;
    text: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category: 'work' | 'personal' | 'shopping' | 'other'; // リテラル型を使用
    dueDate: string;
  }
