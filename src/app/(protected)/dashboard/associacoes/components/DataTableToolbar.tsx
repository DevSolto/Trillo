"use client"

import * as React from "react"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { DataTableViewOptions } from "../../tarefas/components/DataTableViewOptions"
import { DataTableFacetedFilter } from "../../tarefas/components/DataTableFacetedFilter"
import { associationStatuses } from "./data"
import { AddAssociationDialog } from "./add-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { useNotification } from "@/components/NotificationProvider"
import { useRouter } from "next/navigation"
import { deleteAssociation, updateAssociation } from "@/services/associations"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const selected = table.getFilteredSelectedRowModel().rows
  const selectedIds = selected.map((r) => (r.original as { id: string }).id)
  const hasSelection = selectedIds.length > 0
  const notify = useNotification()
  const router = useRouter()
  const [bulkLoading, setBulkLoading] = React.useState(false)

  async function handleBulkAction(value: string) {
    if (!value || !hasSelection) return
    setBulkLoading(true)
    try {
      if (value === 'delete') {
        await Promise.all(selectedIds.map((id) => deleteAssociation(id)))
        notify({ type: 'success', title: 'Associações', message: 'Itens excluídos com sucesso.' })
      } else if (value === 'status:true') {
        await Promise.all(selectedIds.map((id) => updateAssociation(id, { status: true })))
        notify({ type: 'success', title: 'Associações', message: 'Ativadas com sucesso.' })
      } else if (value === 'status:false') {
        await Promise.all(selectedIds.map((id) => updateAssociation(id, { status: false })))
        notify({ type: 'success', title: 'Associações', message: 'Desativadas com sucesso.' })
      }
      router.refresh()
    } catch (e: unknown) {
      notify({ type: 'error', title: 'Ação em massa', message: e instanceof Error ? e.message : 'Falha ao aplicar ação' })
    } finally {
      setBulkLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Filtrar associações..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter column={table.getColumn("status")!} title="Status" options={associationStatuses} />
        )}
        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={() => table.resetColumnFilters()}>
            Limpar
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        {hasSelection && (
          <Select onValueChange={handleBulkAction} disabled={bulkLoading}>
            <SelectTrigger className="h-8 w-[220px]">
              <SelectValue placeholder={`Ações em massa (${selectedIds.length})`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delete">Excluir selecionadas</SelectItem>
              <SelectItem value="status:true">Marcar como Ativa</SelectItem>
              <SelectItem value="status:false">Marcar como Inativa</SelectItem>
            </SelectContent>
          </Select>
        )}
        <AddAssociationDialog />
      </div>
    </div>
  )
}
