import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Task } from '../app/types';



interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, updates: Partial<Task>) => void
}

export function TaskItem({ task, onToggle, onDelete, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)

  const handleUpdate = () => {
    onUpdate(task.id, editedTask)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex flex-col space-y-2 bg-white dark:bg-gray-700 p-2 rounded-md shadow-sm">
      <Input
        value={editedTask.text}
        onChange={(e) => setEditedTask({ ...editedTask, text: e.target.value })}
        className="w-full"
        placeholder="タスク名"
      />
      <div className="flex items-center space-x-2">
        <Select
          value={editedTask.priority}
          onValueChange={(value) => setEditedTask({ ...editedTask, priority: value as 'low' | 'medium' | 'high' })}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="優先度" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">低</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="high">高</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={editedTask.category}
          onValueChange={(value) => setEditedTask({ ...editedTask, category: value as 'work' | 'personal' | 'shopping' | 'other' })}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="カテゴリ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="work">仕事</SelectItem>
            <SelectItem value="personal">個人</SelectItem>
            <SelectItem value="shopping">買い物</SelectItem>
            <SelectItem value="other">その他</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {editedTask.dueDate ? format(new Date(editedTask.dueDate), 'yyyy/MM/dd') : <span>期限を選択</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={editedTask.dueDate ? new Date(editedTask.dueDate) : undefined}
              onSelect={(date) => setEditedTask({ ...editedTask, dueDate: date ? date.toISOString().split('T')[0] : '' })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex justify-end space-x-2">
        <Button onClick={handleUpdate}>更新</Button>
        <Button variant="outline" onClick={() => setIsEditing(false)}>キャンセル</Button>
      </div>
    </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-2 rounded-md shadow-sm">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
      />
      <span className={`flex-grow ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}`}>
        {task.text}
      </span>
      <span className={`text-sm ${
        task.priority === 'high' ? 'text-red-500' :
        task.priority === 'medium' ? 'text-yellow-500' :
        'text-green-500'
      }`}>
        {task.priority}
      </span>
      <span className="text-sm text-gray-500">
        {task.category === 'work' ? '仕事' :
         task.category === 'personal' ? '個人' :
         task.category === 'shopping' ? '買い物' : 'その他'}
      </span>
      <span className="text-sm text-gray-500">
        {task.dueDate ? `期限: ${format(new Date(task.dueDate), 'yyyy/MM/dd')}` : '期限なし'}
      </span>
      <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>編集</Button>
      <Button variant="destructive" size="sm" onClick={() => onDelete(task.id)}>削除</Button>
    </div>
  )
}

