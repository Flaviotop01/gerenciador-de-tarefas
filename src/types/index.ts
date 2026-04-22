export type Priority = 'baixa' | 'média' | 'alta' | 'urgente'
export type TaskStatus = 'pendente' | 'em_andamento' | 'em_revisao' | 'concluída'
export type ProjectStatus = 'ativo' | 'pausado' | 'concluído' | 'arquivado'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'membro' | 'visualizador'
}

export interface Comment {
  id: string
  taskId: string
  author: User
  content: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  projectId?: string
  assignees: User[]
  dueDate?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  comments: Comment[]
  attachments: number
}

export interface Project {
  id: string
  name: string
  description?: string
  status: ProjectStatus
  color: string
  members: User[]
  tasks: Task[]
  createdAt: string
  dueDate?: string
  progress: number
}

export interface Notification {
  id: string
  type: 'task_update' | 'comment' | 'deadline' | 'assignment'
  title: string
  message: string
  read: boolean
  createdAt: string
  taskId?: string
}
