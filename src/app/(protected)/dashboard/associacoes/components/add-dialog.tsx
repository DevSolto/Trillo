"use client"

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog'
import { useNotification } from '@/components/NotificationProvider'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/Form'
import { createAssociation } from '@/services/associations'

const cnpjRegex = /^(\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/

const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  cnpj: z.string().regex(cnpjRegex, { message: 'CNPJ inválido' }),
  status: z.boolean().default(true),
})

export function AddAssociationDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const notify = useNotification()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', cnpj: '', status: true },
    mode: 'onChange',
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setError(null)
    try {
      await createAssociation({ name: data.name, cnpj: data.cnpj, status: data.status })
      notify({ type: 'success', title: 'Associação', message: 'Associação criada com sucesso.' })
      setOpen(false)
      form.reset({ name: '', cnpj: '', status: true })
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao criar associação')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Adicionar Associação</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Associação</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="00.000.000/0000-00 ou 14 dígitos" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                    <span>{field.value ? 'Ativa' : 'Inativa'}</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => { setOpen(false); form.reset() }}>Cancelar</Button>
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
