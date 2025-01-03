'use client'

import { useState, useEffect } from 'react'
import { Plus, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { TaskItem } from '@/components/TaskItem'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Task {
  id: number
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: 'work' | 'personal' | 'shopping' | 'other'
  dueDate: string
}

export default function TaskApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (newTask.trim() !== '') {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newTask,
          completed: false,
          priority: 'medium',
          category: 'work',
          dueDate: '',
        }),
      });

      if (response.ok) {
        const newTaskData = await response.json();
        setTasks([...tasks, newTaskData]);
        setNewTask('');
      }
    }
  };

  const toggleTask = async (id: number) => {
    const taskToToggle = tasks.find(task => task.id === id);
    if (taskToToggle) {
      const updatedTask = { ...taskToToggle, completed: !taskToToggle.completed };
      const response = await fetch(`/api/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
      }
    }
  }

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      } else {
        console.error('Failed to delete task:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  const updateTask = async (id: number, updates: Partial<Task>) => {
    const response = await fetch(`/api/tasks`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...updates }),
    });

    if (response.ok) {
      setTasks(tasks.map(task => (task.id === id ? { ...task, ...updates } : task)));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">タスク管理アプリ!</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="新しいタスクを入力..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={addTask}>
              <Plus className="h-4 w-4 mr-2" />
              追加
            </Button>
          </div>
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onUpdate={updateTask}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

