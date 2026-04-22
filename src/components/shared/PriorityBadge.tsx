import { Badge } from '@/components/ui/badge'
import type { Priority } from '@/types'

const priorityConfig: Record<Priority, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'warning' | 'success' | 'outline'; dot: string }> = {
  baixa: { label: 'Baixa', variant: 'secondary', dot: 'bg-slate-400' },
  média: { label: 'Média', variant: 'default', dot: 'bg-blue-500' },
  alta: { label: 'Alta', variant: 'warning', dot: 'bg-amber-500' },
  urgente: { label: 'Urgente', variant: 'destructive', dot: 'bg-red-500' },
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = priorityConfig[priority]
  return (
    <Badge variant={config.variant}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </Badge>
  )
}
