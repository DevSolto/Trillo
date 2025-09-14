"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/Checkbox"
import { DataTableColumnHeader } from "../../tarefas/components/DataTableColumnHeader"
import { DataTableRowActions } from "./row-actions"
import { roles } from "./data"

export interface UserRow {
  id: string
  name: string
  email: string
  role: string
}

export const columns: ColumnDef<UserRow>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" className="w-full" />
    ),
    cell: ({ row }) => <span className="truncate font-medium w-full">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="E-mail" className="w-full" />
    ),
    cell: ({ row }) => <span className="truncate w-full">{row.getValue("email")}</span>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Perfil" className="w-fit" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("role") as string
      const opt = roles.find((r) => r.value === value)
      if (!opt) return <span>{value}</span>
      const Icon = opt.icon
      return (
        <div className="flex items-center gap-2 w-fit">
          {Icon && <Icon className="text-muted-foreground size-4" />}
          <span>{opt.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  { id: "actions", cell: ({ row }) => <DataTableRowActions row={row} /> },
]

