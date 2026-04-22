import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Task, Project, Notification, User } from '@/types'
import { mockTasks, mockProjects, mockNotifications, currentUser } from '@/data/mock'

interface AppContextValue {
  user: User
  tasks: Task[]
  projects: Project[]
  notifications: Notification[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
  markNotificationRead: (id: string) => void
  unreadCount: number
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  function markNotificationRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <AppContext.Provider
      value={{ user: currentUser, tasks, projects, notifications, setTasks, setProjects, markNotificationRead, unreadCount }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
