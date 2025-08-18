'use client'

import { useState, useEffect } from 'react'
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

const formSchema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório' }),
  description: z.string().min(1, { message: 'Descrição é obrigatória' }),
  priority: z.string(),
  responsavel: z.string(),
  associacao: z.string(),
  tipo: z.string(),
  dataFim: z.date().optional(),
})

export function AddTaskDialog() {
  const [open, setOpen] = useState(false)
  const [usuarios, setUsuarios] = useState<{ value: string; label: string }[]>([])
  const [associacoes, setAssociacoes] = useState<{ value: string; label: string }[]>([])
  const [tipos, setTipos] = useState<{ value: string; label: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: priorities[1].value,
      responsavel: '',
      associacao: '',
      tipo: '',
      dataFim: undefined,
    },
    mode: 'onChange',
  })

  useEffect(() => {
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

      if (usuariosOptions[0]) form.setValue('responsavel', usuariosOptions[0].value)
      if (associacoesOptions[0]) form.setValue('associacao', associacoesOptions[0].value)
      if (tiposOptions[0]) form.setValue('tipo', tiposOptions[0].value)
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

      const res = await fetch('/api/tarefas/criar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: data.title,
          descricao: data.description,
          prioridade: data.priority,
          responsavelId: data.responsavel,
          associacaoId: data.associacao,
          tipoId: data.tipo,
          data_fim: data.dataFim,
          statusId: null,
          criadorId: user.id,
          data_inicio: new Date()
        })
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Erro ao criar tarefa')
      }
      setOpen(false)
      form.reset()
    } catch (e) {
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
              name="responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue />
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
            <FormField
              control={form.control}
              name="associacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associação</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
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
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
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

