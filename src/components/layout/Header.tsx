import { Bell, Search, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import { TaskFormDialog } from '@/components/tasks/TaskFormDialog'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { notifications, markNotificationRead, unreadCount } = useApp()
  const [open, setOpen] = useState(false)

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-border px-6 bg-background shrink-0">
      <h1 className="text-base font-semibold text-foreground">{title}</h1>

      <div className="flex items-center gap-2 flex-1 max-w-xs ml-auto mr-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar..." className="pl-8 h-8 text-xs" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notificações */}
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Nenhuma notificação</p>
            ) : (
              notifications.slice(0, 6).map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={cn('flex flex-col items-start gap-0.5 py-2.5', !n.read && 'bg-accent/40')}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs font-medium">{n.title}</span>
                    {!n.read && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                  </div>
                  <span className="text-xs text-muted-foreground">{n.message}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Nova tarefa */}
        <TaskFormDialog>
          <Button size="sm" className="gap-1.5">
            <Plus size={14} />
            Nova tarefa
          </Button>
        </TaskFormDialog>
      </div>
    </header>
  )
}
