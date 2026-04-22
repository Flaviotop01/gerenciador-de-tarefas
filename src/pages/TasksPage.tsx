import { useState, useMemo } from 'react'
import { Plus, Filter, Search, Paperclip, MessageSquare, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useApp } from '@/context/AppContext'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { AvatarGroup } from '@/components/shared/UserAvatar'
import { TaskFormDialog } from '@/components/tasks/TaskFormDialog'
import { formatRelativeDate } from '@/lib/utils'
import type { TaskStatus } from '@/types'

const statusColumns: { key: TaskStatus; label: string }[] = [
  { key: 'pendente', label: 'Pendente' },
  { key: 'em_andamento', label: 'Em andamento' },
  { key: 'em_revisao', label: 'Em revisão' },
  { key: 'concluída', label: 'Concluída' },
]

export function TasksPage() {
  const { tasks, projects } = useApp()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('todos')
  const [filterPriority, setFilterPriority] = useState<string>('todas')
  const [filterProject, setFilterProject] = useState<string>('todos')
  const [view, setView] = useState<'lista' | 'kanban'>('lista')

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === 'todos' || t.status === filterStatus
      const matchPriority = filterPriority === 'todas' || t.priority === filterPriority
      const matchProject = filterProject === 'todos' || t.projectId === filterProject
      return matchSearch && matchStatus && matchPriority && matchProject
    })
  }, [tasks, search, filterStatus, filterPriority, filterProject])

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar tarefas..."
            className="pl-8 h-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="em_andamento">Em andamento</SelectItem>
            <SelectItem value="em_revisao">Em revisão</SelectItem>
            <SelectItem value="concluída">Concluída</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as prioridades</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
            <SelectItem value="média">Média</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="urgente">Urgente</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="h-8 w-40 text-xs">
            <SelectValue placeholder="Projeto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os projetos</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as 'lista' | 'kanban')}>
            <TabsList className="h-8">
              <TabsTrigger value="lista" className="text-xs px-3 py-1">Lista</TabsTrigger>
              <TabsTrigger value="kanban" className="text-xs px-3 py-1">Kanban</TabsTrigger>
            </TabsList>
          </Tabs>

          <TaskFormDialog>
            <Button size="sm" className="h-8 gap-1.5 text-xs">
              <Plus size={13} />
              Nova tarefa
            </Button>
          </TaskFormDialog>
        </div>
      </div>

      {/* Contagem */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? 'tarefa encontrada' : 'tarefas encontradas'}
      </p>

      {view === 'lista' ? (
        <Card>
          {filtered.length === 0 ? (
            <CardContent className="py-12 text-center">
              <Filter size={32} className="mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">Nenhuma tarefa encontrada.</p>
            </CardContent>
          ) : (
            <div className="divide-y divide-border">
              {/* Header */}
              <div className="grid grid-cols-[1fr_120px_100px_120px_100px_60px] gap-4 px-5 py-2.5 text-xs font-medium text-muted-foreground">
                <span>Tarefa</span>
                <span>Status</span>
                <span>Prioridade</span>
                <span>Prazo</span>
                <span>Responsável</span>
                <span>Info</span>
              </div>
              {filtered.map((task) => {
                const project = projects.find((p) => p.id === task.projectId)
                return (
                  <div
                    key={task.id}
                    className="grid grid-cols-[1fr_120px_100px_120px_100px_60px] gap-4 px-5 py-3 items-center hover:bg-muted/30 transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {project && (
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: project.color }}
                          />
                        )}
                        <span className="text-sm font-medium text-foreground truncate">{task.title}</span>
                      </div>
                      {task.description && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5 ml-4">{task.description}</p>
                      )}
                    </div>
                    <div><StatusBadge status={task.status} /></div>
                    <div><PriorityBadge priority={task.priority} /></div>
                    <div className="text-xs text-muted-foreground">
                      {task.dueDate ? (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {formatRelativeDate(task.dueDate)}
                        </span>
                      ) : '—'}
                    </div>
                    <div>
                      {task.assignees.length > 0
                        ? <AvatarGroup users={task.assignees} max={2} />
                        : <span className="text-xs text-muted-foreground">—</span>
                      }
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {task.attachments > 0 && (
                        <span className="flex items-center gap-0.5 text-xs">
                          <Paperclip size={11} />{task.attachments}
                        </span>
                      )}
                      {task.comments.length > 0 && (
                        <span className="flex items-center gap-0.5 text-xs">
                          <MessageSquare size={11} />{task.comments.length}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      ) : (
        /* Kanban view inline */
        <div className="grid grid-cols-4 gap-4 min-h-[400px]">
          {statusColumns.map(({ key, label }) => {
            const colTasks = filtered.filter((t) => t.status === key)
            return (
              <div key={key} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
                  <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">{colTasks.length}</span>
                </div>
                <div className="flex flex-col gap-2 flex-1 min-h-[100px] rounded-xl bg-muted/40 p-2">
                  {colTasks.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId)
                    return (
                      <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3 space-y-2">
                          {project && (
                            <div className="flex items-center gap-1.5">
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: project.color }}
                              />
                              <span className="text-[10px] text-muted-foreground">{project.name}</span>
                            </div>
                          )}
                          <p className="text-xs font-medium text-foreground leading-snug">{task.title}</p>
                          <div className="flex items-center justify-between">
                            <PriorityBadge priority={task.priority} />
                            {task.assignees.length > 0 && <AvatarGroup users={task.assignees} max={2} />}
                          </div>
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Calendar size={10} />
                              {formatRelativeDate(task.dueDate)}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                  <TaskFormDialog>
                    <button className="w-full rounded-lg border-2 border-dashed border-border py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1">
                      <Plus size={12} /> Adicionar
                    </button>
                  </TaskFormDialog>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
