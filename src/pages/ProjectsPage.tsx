import { useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent, closestCorners } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Users, Calendar, GripVertical, MoreHorizontal, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/context/AppContext'
import { AvatarGroup } from '@/components/shared/UserAvatar'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { formatDate } from '@/lib/utils'
import type { Task, TaskStatus, Project } from '@/types'
import { TaskFormDialog } from '@/components/tasks/TaskFormDialog'

const columns: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'pendente', label: 'Pendente', color: 'bg-slate-200' },
  { key: 'em_andamento', label: 'Em andamento', color: 'bg-blue-200' },
  { key: 'em_revisao', label: 'Em revisão', color: 'bg-amber-200' },
  { key: 'concluída', label: 'Concluída', color: 'bg-green-200' },
]

function TaskCard({ task, isDragging = false }: { task: Task; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border border-border bg-card p-3 space-y-2 cursor-grab active:cursor-grabbing select-none ${isDragging ? 'shadow-lg opacity-80 rotate-1' : 'hover:shadow-md'} transition-all`}
    >
      <div className="flex items-start justify-between gap-1">
        <p className="text-xs font-medium text-foreground leading-snug flex-1">{task.title}</p>
        <div className="flex items-center gap-0.5">
          <button
            {...attributes}
            {...listeners}
            className="p-0.5 text-muted-foreground hover:text-foreground rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={12} />
          </button>
          <TaskFormDialog task={task}>
            <button className="p-0.5 text-muted-foreground hover:text-foreground rounded">
              <MoreHorizontal size={12} />
            </button>
          </TaskFormDialog>
        </div>
      </div>
      {task.description && (
        <p className="text-[11px] text-muted-foreground line-clamp-2">{task.description}</p>
      )}
      <div className="flex flex-wrap gap-1">
        {task.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">{tag}</Badge>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <PriorityBadge priority={task.priority} />
        {task.assignees.length > 0 && <AvatarGroup users={task.assignees} max={2} />}
      </div>
      {task.dueDate && (
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Calendar size={10} />
          {formatDate(task.dueDate)}
        </div>
      )}
    </div>
  )
}

function KanbanBoard({ project }: { project: Project }) {
  const { tasks, setTasks } = useApp()
  const projectTasks = tasks.filter((t) => t.projectId === project.id)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const taskId = active.id as string
    const overId = over.id as string

    const targetStatus = columns.find((c) => c.key === overId)?.key
    if (targetStatus) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: targetStatus, updatedAt: new Date().toISOString() } : t
        )
      )
    }
  }

  const activeTask = projectTasks.find((t) => t.id === activeId)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-4 gap-3 min-h-[300px]">
        {columns.map(({ key, label, color }) => {
          const colTasks = projectTasks.filter((t) => t.status === key)
          return (
            <div key={key} id={key} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${color}`} />
                <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                <span className="ml-auto text-xs text-muted-foreground bg-muted rounded-full px-2">{colTasks.length}</span>
              </div>
              <SortableContext
                id={key}
                items={colTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2 flex-1 min-h-[60px] rounded-xl bg-muted/30 p-2">
                  {colTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  <TaskFormDialog>
                    <button className="w-full rounded-lg border-2 border-dashed border-border py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1">
                      <Plus size={12} /> Adicionar
                    </button>
                  </TaskFormDialog>
                </div>
              </SortableContext>
            </div>
          )
        })}
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

const statusLabel: Record<string, { label: string; variant: 'success' | 'default' | 'warning' | 'secondary' }> = {
  ativo: { label: 'Ativo', variant: 'success' },
  pausado: { label: 'Pausado', variant: 'warning' },
  concluído: { label: 'Concluído', variant: 'secondary' },
  arquivado: { label: 'Arquivado', variant: 'secondary' },
}

export function ProjectsPage() {
  const { projects } = useApp()
  const [selected, setSelected] = useState<string>(projects[0]?.id ?? '')

  const project = projects.find((p) => p.id === selected)

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Project list sidebar */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
              selected === p.id
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/20'
            }`}
          >
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
            {p.name}
          </button>
        ))}
        <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
          <Plus size={13} />
          Novo projeto
        </Button>
      </div>

      {project ? (
        <>
          {/* Project header */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: project.color }} />
                    <h2 className="text-base font-semibold text-foreground">{project.name}</h2>
                    <Badge variant={statusLabel[project.status].variant}>
                      {statusLabel[project.status].label}
                    </Badge>
                  </div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mt-1 max-w-lg">{project.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <span>{project.tasks.filter((t) => t.status === 'concluída').length}/{project.tasks.length} tarefas</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users size={14} />
                    <AvatarGroup users={project.members} max={4} />
                  </div>
                  {project.dueDate && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar size={14} />
                      <span>{formatDate(project.dueDate)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Progresso geral</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} />
              </div>
            </CardContent>
          </Card>

          {/* Kanban board */}
          <KanbanBoard project={project} />
        </>
      ) : (
        <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
          Nenhum projeto selecionado.
        </div>
      )}
    </div>
  )
}
