import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import type { User } from '@/types'

interface UserAvatarProps {
  user: User
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
}

const sizeClass = { sm: 'h-6 w-6 text-[10px]', md: 'h-8 w-8 text-xs', lg: 'h-10 w-10 text-sm' }

export function UserAvatar({ user, size = 'md', showName = false }: UserAvatarProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className={sizeClass[size]}>
        {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      {showName && <span className="text-sm text-foreground">{user.name}</span>}
    </div>
  )
}

export function AvatarGroup({ users, max = 3 }: { users: User[]; max?: number }) {
  const visible = users.slice(0, max)
  const rest = users.length - max
  return (
    <div className="flex items-center -space-x-2">
      {visible.map((u) => (
        <Avatar key={u.id} className="h-6 w-6 text-[10px] ring-2 ring-background">
          {u.avatar && <AvatarImage src={u.avatar} alt={u.name} />}
          <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
        </Avatar>
      ))}
      {rest > 0 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted ring-2 ring-background text-[10px] text-muted-foreground font-medium">
          +{rest}
        </div>
      )}
    </div>
  )
}
