'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { DatePicker } from '@/components/ui/DatePicker'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/Select'
import { priorities, statuses as statusDefs } from '@/lib/enums'
import { MultiUserSelect } from './MultiUserSelect'
import { requestJson } from '@/services/http'
import { createClient } from '@/lib/client'
import { useNotification } from '@/components/NotificationProvider'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/Form'

const formSchema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório' }),
  description: z.string().min(1, { message: 'Descrição é obrigatória' }),
  priority: z.string(),
  team: z.array(z.string()),
  associacao: z.string(),
  status: z.string().optional(),
  dataFim: z.date().optional(),
})

interface Colaborador {
  id: string
  nome: string
  funcao: string
}

interface Associacao {
  id: string
  nome: string
}

interface Tipo {
  id: string
  nome: string
}

export function AddTaskDialog() {
  const [open, setOpen] = useState(false)
  const [usuarios, setUsuarios] = useState<{ value: string; label: string }[]>([])
  const [associacoes, setAssociacoes] = useState<{ value: string; label: string }[]>([])
  const [statusOptions, setStatusOptions] = useState<{ value: string; label: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const notify = useNotification()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: priorities[1].value,
      team: [],
      associacao: '',
      status: undefined,
      dataFim: undefined,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    async function fetchJson<T>(path: string): Promise<T> {
      return requestJson<T>(path)
    }

    async function fetchOptions() {
      try {
        const [usersRes, associationsRes] = await Promise.all([
          fetchJson<{ items?: any[] }>("/api/user?limit=100&page=1"),
          fetchJson<{ items?: any[] }>("/api/association?limit=100&page=1"),
        ])

        const users: any[] = Array.isArray(usersRes?.items) ? usersRes.items : []
        const associations: any[] = Array.isArray(associationsRes?.items) ? associationsRes.items : []

        const usuariosOptions = users.map((u: any) => ({
          value: u.id,
          label: `${u.name ?? u.email ?? 'Usuário'} - ${(u.role ?? '').toString().toLowerCase()}`,
        }))
        const associacoesOptions = associations.map((a: any) => ({ value: a.id, label: a.name ?? a.nome ?? 'Associação' }))
        const tiposOptions = statusDefs.map((s) => ({ value: s.value, label: s.label }))

        setUsuarios(usuariosOptions)
        setAssociacoes(associacoesOptions)
        setStatusOptions(tiposOptions)

        if (associacoesOptions[0]) form.setValue('associacao', associacoesOptions[0].value)
        if (tiposOptions[0]) form.setValue('status', tiposOptions[0].value)
      } catch (err: unknown) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Erro ao buscar dados', err)
        }
        setError('Erro ao carregar opções')
      }
    }

    fetchOptions()
  }, [form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      await requestJson<void>('/api/task', {
        method: 'POST',
        body: {
          title: data.title,
          description: data.description,
          dueDate: data.dataFim ? new Date(data.dataFim).toISOString() : undefined,
          creatorId: user.id,
          associationId: data.associacao,
          teamIds: Array.isArray(data.team) ? data.team : [],
          status: data.status,
          priority: data.priority,
        },
      })
      notify({ type: 'success', title: 'Tarefa', message: 'Tarefa criada com sucesso.' })
      setOpen(false)
      form.reset()
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao criar tarefa')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Adicionar Tarefa</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Tarefa</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 py-2">

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <MultiUserSelect
                      options={usuarios}
                      value={field.value || []}
                      onChange={(vals) => field.onChange(vals)}
                      placeholder='Selecione os participantes do time'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-4 justify-between'>

              <FormField
                control={form.control}
                name="associacao"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Associação</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {associacoes.map((a) => (
                          <SelectItem key={a.value} value={a.value}>
                            {a.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="dataFim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de término</FormLabel>
                  <FormControl>
                    <DatePicker date={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setOpen(false)
                  form.reset()
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!form.formState.isValid || isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
