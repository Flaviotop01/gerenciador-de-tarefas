import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { useApp } from '@/context/AppContext'
import { MessageCircle, Bell, Shield, User } from 'lucide-react'

export function SettingsPage() {
  const { user } = useApp()

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="text-base font-semibold">Configurações</h2>
        <p className="text-sm text-muted-foreground">Gerencie sua conta e preferências.</p>
      </div>

      {/* Perfil */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User size={16} className="text-muted-foreground" />
            <CardTitle className="text-sm">Perfil</CardTitle>
          </div>
          <CardDescription>Suas informações pessoais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <UserAvatar user={user} size="lg" />
            <Button variant="outline" size="sm">Alterar foto</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nome</Label>
              <Input defaultValue={user.name} />
            </div>
            <div className="space-y-1.5">
              <Label>E-mail</Label>
              <Input defaultValue={user.email} type="email" />
            </div>
          </div>
          <Button size="sm">Salvar alterações</Button>
        </CardContent>
      </Card>

      {/* WhatsApp */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-green-600" />
            <CardTitle className="text-sm">Integração WhatsApp</CardTitle>
          </div>
          <CardDescription>Receba notificações de tarefas via WhatsApp.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Número de WhatsApp</Label>
            <div className="flex gap-2">
              <Input placeholder="+55 (11) 99999-9999" />
              <Button variant="outline" size="sm" className="shrink-0">Verificar</Button>
            </div>
          </div>
          <div className="rounded-lg bg-green-50 border border-green-200 p-3">
            <p className="text-xs text-green-700">
              Após verificar o número, você receberá alertas de prazos, atribuições e comentários diretamente no WhatsApp.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-muted-foreground" />
            <CardTitle className="text-sm">Notificações</CardTitle>
          </div>
          <CardDescription>Escolha quais notificações receber.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            'Novas tarefas atribuídas a mim',
            'Comentários nas minhas tarefas',
            'Prazos próximos (1 dia antes)',
            'Mudanças de status de projetos',
            'Resumo semanal de produtividade',
          ].map((label) => (
            <label key={label} className="flex items-center justify-between py-1 cursor-pointer">
              <span className="text-sm">{label}</span>
              <div className="relative">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors" />
                <div className="absolute left-0.5 top-0.5 h-4 w-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
              </div>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-muted-foreground" />
            <CardTitle className="text-sm">Segurança</CardTitle>
          </div>
          <CardDescription>Gerencie sua senha e sessões.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Senha atual</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nova senha</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <Label>Confirmar senha</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <Button size="sm" variant="outline">Alterar senha</Button>
        </CardContent>
      </Card>
    </div>
  )
}
