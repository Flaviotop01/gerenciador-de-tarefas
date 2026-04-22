import { Badge } from '@/components/ui/badge'
import type { TaskStatus } from '@/types'

const statusConfig: Record<TaskStatus, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'outline' | 'destructive' }> = {
  pendente: { label: 'Pendente', variant: 'secondary' },
  em_andamento: { label: 'Em andamento', variant: 'default' },
  em_revisao: { label: 'Em revisão', variant: 'warning' },
  concluída: { label: 'Concluída', variant: 'success' },
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
