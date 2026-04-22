import { useMemo } from 'react'
import { CheckCircle2, Clock, TrendingUp, AlertCircle, Users, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/context/AppContext'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { mockUsers } from '@/data/mock'

const priorityColors: Record<string, string> = {
  urgente: 'bg-destructive',
  alta: 'bg-amber-500',
  média: 'bg-primary',
  baixa: 'bg-slate-400',
}

const statusColors: Record<string, string> = {
  pendente: 'bg-slate-300',
  em_andamento: 'bg-primary',
  em_revisao: 'bg-amber-400',
  concluída: 'bg-green-500',
}

const statusLabels: Record<string, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  em_revisao: 'Em revisão',
  concluída: 'Concluída',
}

export function ReportsPage() {
  const { tasks, projects } = useApp()

  const stats = useMemo(() => {
    const total = tasks.length
    const concluidas = tasks.filter((t) => t.status === 'concluída').length
    const pendentes = tasks.filter((t) => t.status === 'pendente').length
    const emAndamento = tasks.filter((t) => t.status === 'em_andamento').length
    const emRevisao = tasks.filter((t) => t.status === 'em_revisao').length
    const urgentes = tasks.filter((t) => t.priority === 'urgente' && t.status !== 'concluída').length
    const taxa = total > 0 ? Math.round((concluidas / total) * 100) : 0

    const byPriority = ['urgente', 'alta', 'média', 'baixa'].map((p) => ({
      key: p,
      count: tasks.filter((t) => t.priority === p).length,
    }))

    const byStatus = ['pendente', 'em_andamento', 'em_revisao', 'concluída'].map((s) => ({
      key: s,
      count: tasks.filter((t) => t.status === s).length,
    }))

    const byMember = mockUsers.map((u) => ({
      user: u,
      total: tasks.filter((t) => t.assignees.some((a) => a.id === u.id)).length,
      concluidas: tasks.filter((t) => t.assignees.some((a) => a.id === u.id) && t.status === 'concluída').length,
    })).sort((a, b) => b.total - a.total)

    return { total, concluidas, pendentes, emAndamento, emRevisao, urgentes, taxa, byPriority, byStatus, byMember }
  }, [tasks])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-base font-semibold text-foreground">Relatórios e Insights</h2>
        <p className="text-sm text-muted-foreground">Análise de desempenho da equipe e progresso dos projetos.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Taxa de conclusão', value: `${stats.taxa}%`, icon: Target, desc: `${stats.concluidas} de ${stats.total} tarefas`, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Em andamento', value: stats.emAndamento, icon: TrendingUp, desc: 'tarefas ativas', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Urgentes em aberto', value: stats.urgentes, icon: AlertCircle, desc: 'precisam de atenção', color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Projetos ativos', value: projects.filter((p) => p.status === 'ativo').length, icon: Users, desc: 'projetos em progresso', color: 'text-primary', bg: 'bg-primary/10' },
        ].map(({ label, value, icon: Icon, desc, color, bg }) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
                  <Icon size={20} className={color} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Distribuição por Status</CardTitle>
            <CardDescription>Total de {stats.total} tarefas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.byStatus.map(({ key, count }) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${statusColors[key]}`} />
                      {statusLabels[key]}
                    </span>
                    <span className="text-muted-foreground">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${statusColors[key]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Por prioridade */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Distribuição por Prioridade</CardTitle>
            <CardDescription>Análise do nível de urgência</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.byPriority.map(({ key, count }) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
              const labels: Record<string, string> = { urgente: 'Urgente', alta: 'Alta', média: 'Média', baixa: 'Baixa' }
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${priorityColors[key]}`} />
                      {labels[key]}
                    </span>
                    <span className="text-muted-foreground">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${priorityColors[key]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Desempenho por projeto */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Progresso dos Projetos</CardTitle>
            <CardDescription>Andamento de cada projeto ativo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project) => {
              const done = project.tasks.filter((t) => t.status === 'concluída').length
              return (
                <div key={project.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: project.color }} />
                      <span className="text-xs font-medium">{project.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {done}/{project.tasks.length}
                      </span>
                      <Badge variant={project.status === 'ativo' ? 'success' : 'secondary'} className="text-[10px]">
                        {project.progress}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={project.progress} />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Desempenho por membro */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Desempenho da Equipe</CardTitle>
            <CardDescription>Tarefas por membro da equipe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.byMember.filter((m) => m.total > 0).map(({ user, total, concluidas: done }) => {
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <div key={user.id} className="flex items-center gap-3">
                  <UserAvatar user={user} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium truncate">{user.name}</span>
                      <span className="text-muted-foreground shrink-0 ml-2">
                        <CheckCircle2 size={11} className="inline mr-0.5 text-green-500" />
                        {done}/{total}
                      </span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 w-8 text-right">{pct}%</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Tarefas por prazo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Resumo Executivo</CardTitle>
          <CardDescription>Visão consolidada do desempenho da equipe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: CheckCircle2, label: 'Concluídas no prazo', value: stats.concluidas, color: 'text-green-600' },
              { icon: Clock, label: 'Pendentes', value: stats.pendentes, color: 'text-slate-500' },
              { icon: TrendingUp, label: 'Em progresso', value: stats.emAndamento + stats.emRevisao, color: 'text-blue-600' },
              { icon: AlertCircle, label: 'Urgência alta', value: stats.urgentes, color: 'text-red-600' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Icon size={20} className={color} />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-lg font-bold text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
