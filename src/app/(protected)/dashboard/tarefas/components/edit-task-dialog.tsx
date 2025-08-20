'use client'

import { useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { priorities } from './data'
import { createClient } from '@/lib/client'
import { useNotification } from '@/components/notification-provider'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Task } from './columns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter as AlertDialogFooterRoot,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const formSchema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório' }),
  description: z.string().min(1, { message: 'Descrição é obrigatória' }),
  priority: z.string(),
  responsavel: z.string(),
  associacao: z.string(),
  tipo: z.string(),
  dataFim: z.date().optional(),
})

interface EditTaskDialogProps {
  task: Task
  children: ReactNode
}

export function EditTaskDialog({ task, children }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [usuarios, setUsuarios] = useState<{ value: string; label: string }[]>([])
  const [associacoes, setAssociacoes] = useState<{ value: string; label: string }[]>([])
  const [tipos, setTipos] = useState<{ value: string; label: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const notify = useNotification()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      priority: task.priority ?? priorities[1].value,
      responsavel: task.responsavelId ?? '',
      associacao: task.associacaoId ?? '',
      tipo: task.tipoId ?? '',
      dataFim: task.endDate ? new Date(task.endDate) : undefined,
    },
    mode: 'onChange',
  })

  const {
    title: defaultTitle,
    description: defaultDescription,
    priority: defaultPriority,
    responsavelId,
    associacaoId,
    tipoId,
    endDate,
  } = task

  useEffect(() => {
    if (!open) return

    async function fetchOptions() {
      const [usuariosRes, associacoesRes, tiposRes] = await Promise.all([
        fetch('/api/colaboradores/buscar?page=1&perPage=100').then((r) => r.json()),
        fetch('/api/associacoes/buscar?page=1&perPage=100').then((r) => r.json()),
        fetch('/api/tipos/buscar?page=1&perPage=100').then((r) => r.json()),
      ])

      const usuariosOptions = usuariosRes.colaboradores.map((u: any) => ({
        value: u.id,
        label: `${u.nome} - ${u.funcao.toLowerCase()}`,
      }))
      const associacoesOptions = associacoesRes.associacoes.map((a: any) => ({ value: a.id, label: a.nome }))
      const tiposOptions = tiposRes.tipos.map((t: any) => ({ value: t.id, label: t.nome }))

      setUsuarios(usuariosOptions)
      setAssociacoes(associacoesOptions)
      setTipos(tiposOptions)

      form.setValue('responsavel', responsavelId ?? usuariosOptions[0]?.value ?? '')
      form.setValue('associacao', associacaoId ?? associacoesOptions[0]?.value ?? '')
      form.setValue('tipo', tipoId ?? tiposOptions[0]?.value ?? '')
    }

    fetchOptions()
  }, [open, form, responsavelId, associacaoId, tipoId])

  useEffect(() => {
    if (!open) return

    form.reset({
      title: defaultTitle,
      description: defaultDescription,
      priority: defaultPriority ?? priorities[1].value,
      responsavel: responsavelId ?? '',
      associacao: associacaoId ?? '',
      tipo: tipoId ?? '',
      dataFim: endDate ? new Date(endDate) : undefined,
    })
  }, [open, form, defaultTitle, defaultDescription, defaultPriority, responsavelId, associacaoId, tipoId, endDate])

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

      const res = await fetch('/api/tarefas/editar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: task.id,
          titulo: data.title,
          descricao: data.description,
          prioridade: data.priority,
          responsavelId: data.responsavel,
          associacaoId: data.associacao,
          tipoId: data.tipo,
          data_fim: data.dataFim,
          criadorId: user.id,
        })
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Erro ao editar tarefa')
      }
      notify({ type: 'success', title: 'Tarefa', message: 'Tarefa editada com sucesso.' })
      setOpen(false)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao editar tarefa')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
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
              name="responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Escolha o responsável por essa tarefa' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {usuarios.map((u) => (
                        <SelectItem key={u.value} value={u.value}>
                          {u.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                name="tipo"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tipos.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" disabled={!form.formState.isValid || isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Salvando...' : 'Salvar'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar edição</AlertDialogTitle>
                    <AlertDialogDescription>
                      Deseja realmente salvar as alterações desta tarefa?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooterRoot>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooterRoot>
                </AlertDialogContent>
              </AlertDialog>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

