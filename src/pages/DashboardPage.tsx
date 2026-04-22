import { CheckCircle2, Clock, AlertCircle, FolderOpen, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/context/AppContext'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { AvatarGroup } from '@/components/shared/UserAvatar'
import { formatRelativeDate } from '@/lib/utils'
import { Link } from 'react-router-dom'

export function DashboardPage() {
  const { tasks, projects, user } = useApp()

  const stats = {
    total: tasks.length,
    pendentes: tasks.filter((t) => t.status === 'pendente').length,
    emAndamento: tasks.filter((t) => t.status === 'em_andamento').length,
    concluidas: tasks.filter((t) => t.status === 'concluída').length,
  }

  const urgentes = tasks.filter((t) => t.priority === 'urgente' && t.status !== 'concluída')
  const recentes = [...tasks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5)
  const proximasPrazos = tasks
    .filter((t) => t.dueDate && t.status !== 'concluída')
    .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!))
    .slice(0, 4)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Saudação */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          {greeting}, {user.name.split(' ')[0]}! 👋
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Você tem {stats.pendentes + stats.emAndamento} tarefas em aberto hoje.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total de tarefas', value: stats.total, icon: FolderOpen, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Pendentes', value: stats.pendentes, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Em andamento', value: stats.emAndamento, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Concluídas', value: stats.concluidas, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
                  <Icon size={20} className={color} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tarefas recentes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Atividade recente</CardTitle>
                <Link to="/tarefas" className="text-xs text-primary hover:underline">Ver todas</Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentes.map((task) => (
                  <div key={task.id} className="flex items-start gap-3 px-5 py-3 hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    {task.assignees.length > 0 && (
                      <AvatarGroup users={task.assignees} max={2} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side panels */}
        <div className="space-y-4">
          {/* Urgentes */}
          {urgentes.length > 0 && (
            <Card className="border-destructive/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-destructive" />
                  <CardTitle className="text-sm text-destructive">Urgente atenção</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {urgentes.slice(0, 3).map((t) => (
                  <div key={t.id} className="rounded-lg bg-destructive/5 border border-destructive/10 p-2.5">
                    <p className="text-xs font-medium text-foreground">{t.title}</p>
                    {t.dueDate && (
                      <p className="text-[11px] text-destructive mt-0.5">
                        Prazo: {formatRelativeDate(t.dueDate)}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Próximos prazos */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                <CardTitle className="text-sm">Próximos prazos</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {proximasPrazos.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhum prazo próximo.</p>
              ) : (
                proximasPrazos.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-2">
                    <p className="text-xs text-foreground truncate flex-1">{t.title}</p>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {formatRelativeDate(t.dueDate!)}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Projetos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Projetos ativos</h3>
          <Link to="/projetos" className="text-xs text-primary hover:underline">Ver todos</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.filter((p) => p.status === 'ativo').map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <CardTitle className="text-sm truncate">{project.name}</CardTitle>
                </div>
                {project.description && (
                  <CardDescription className="text-xs line-clamp-1">{project.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{project.progress}% concluído</span>
                  <span>{project.tasks.length} tarefas</span>
                </div>
                <Progress value={project.progress} />
                <div className="flex items-center justify-between mt-3">
                  <AvatarGroup users={project.members} max={3} />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users size={12} />
                    {project.members.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
