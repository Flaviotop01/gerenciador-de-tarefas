import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckSquare, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'login' | 'cadastro'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/')
    }, 1200)
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-sidebar p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <CheckSquare size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">TaskFlow</span>
        </div>

        <div>
          <blockquote className="text-white/80 text-lg leading-relaxed max-w-md">
            "Organize tarefas, acompanhe projetos e colabore com sua equipe — tudo em um só lugar."
          </blockquote>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { value: '2.4k+', label: 'Equipes ativas' },
              { value: '98%', label: 'Satisfação' },
              { value: '50k+', label: 'Tarefas concluídas' },
            ].map(({ value, label }) => (
              <div key={label} className="rounded-xl bg-white/10 px-4 py-3 text-center">
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-white/60 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/40">© 2026 TaskFlow. Todos os direitos reservados.</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <CheckSquare size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">TaskFlow</span>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">
                {tab === 'login' ? 'Bem-vindo de volta!' : 'Criar conta'}
              </CardTitle>
              <CardDescription>
                {tab === 'login'
                  ? 'Entre na sua conta para continuar'
                  : 'Preencha os dados para começar'}
              </CardDescription>

              {/* Tab switcher */}
              <div className="flex mt-3 bg-muted rounded-lg p-1 gap-1">
                {(['login', 'cadastro'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-all ${
                      tab === t
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t === 'login' ? 'Entrar' : 'Cadastrar'}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 mt-1">
                {tab === 'cadastro' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    {tab === 'login' && (
                      <button type="button" className="text-xs text-primary hover:underline">
                        Esqueceu a senha?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      required
                      className="pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {tab === 'login' ? 'Entrar' : 'Criar conta'}
                </Button>

                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">ou continue com</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" type="button" className="text-xs">
                    Google
                  </Button>
                  <Button variant="outline" type="button" className="text-xs">
                    GitHub
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Ao continuar, você concorda com nossos{' '}
            <span className="text-primary cursor-pointer hover:underline">Termos de Uso</span> e{' '}
            <span className="text-primary cursor-pointer hover:underline">Política de Privacidade</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
