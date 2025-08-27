"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { labels, priorities, statuses } from "./data"

export type Task = {
  id: string
  createdAt: string
  title: string
  description: string
  status: string | null
  label: string | null
  priority: string | null
  endDate: string | null
  responsavelId: string | null
  associacaoId: string | null
  associacao: string | null
  tipoId: string | null
}
import { DataTableColumnHeader } from "./DataTableColumnHeader"
import { DataTableRowActions } from "./DataTableRowActions"

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar tudo"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Criação" className="w-fit" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string
      return <div className="w-fit">{new Date(date).toLocaleDateString("pt-BR")}</div>
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Título" className="w-full" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label)
      return (
        <div className="flex w-full gap-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="truncate font-medium w-full">{row.getValue("title")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "associacao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Associação" className="w-full" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("associacao") as string | null
      return <span className="w-full truncate">{value ?? "-"}</span>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" className="w-fit" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("status") as string | null
      const status = statuses.find((status) => status.value === value)
      if (!status) return <span>{value ?? "-"}</span>
      return (
        <div className="flex items-center gap-2 w-fit">
          {status.icon && <status.icon className="text-muted-foreground size-4" />}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioridade" className="w-fit" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find((priority) => priority.value === row.getValue("priority"))
      if (!priority) return null
      return (
        <div className="flex items-center gap-2 w-fit">
          {priority.icon && <priority.icon className="text-muted-foreground size-4" />}
          <span>{priority.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Final" className="w-fit" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("endDate") as string | null
      return (
        <div className="w-fit">
          {value ? new Date(value).toLocaleDateString("pt-BR") : "-"}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
