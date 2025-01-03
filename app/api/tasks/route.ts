import { NextResponse } from 'next/server';

let tasks = [
  { id: 1, text: 'タスク1', completed: false, priority: 'medium', category: 'work', dueDate: '' },
  { id: 2, text: 'タスク2', completed: false, priority: 'low', category: 'personal', dueDate: '' },
];

export async function GET() {
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const newTask = await request.json();
  newTask.id = Date.now(); // IDを生成
  tasks.push(newTask);
  return NextResponse.json(newTask, { status: 201 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  console.log('Deleting task with id:', id); // デバッグ用ログ
  tasks = tasks.filter(task => task.id !== id);
  return NextResponse.json({ 
    message: 'Task deleted',
    tasks: tasks 
  }, { status: 200 });
}

export async function PUT(request: Request) {
  const updatedTask = await request.json();
  tasks = tasks.map(task => (task.id === updatedTask.id ? updatedTask : task));
  return NextResponse.json(updatedTask);
} 
