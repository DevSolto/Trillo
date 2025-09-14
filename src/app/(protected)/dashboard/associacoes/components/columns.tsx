"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/Badge"
import { Checkbox } from "@/components/ui/Checkbox"
import { DataTableColumnHeader } from "../../tarefas/components/DataTableColumnHeader"
import { DataTableRowActions } from "./row-actions"
import { associationStatuses } from "./data"

export interface AssociationRow {
  id: string
  name: string
  cnpj: string
  status: boolean
}

export const columns: ColumnDef<AssociationRow>[] = [
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
    cell: ({ row }) => {
      return <span className="truncate font-medium w-full">{row.getValue("name")}</span>
    },
  },
  {
    accessorKey: "cnpj",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CNPJ" className="w-fit" />
    ),
    cell: ({ row }) => {
      return <div className="w-fit font-mono text-xs">{row.getValue("cnpj")}</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" className="w-fit" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("status") as boolean
      const opt = associationStatuses.find((o) => String(value) === o.value)
      if (!opt) return <span>{String(value)}</span>
      return (
        <div className="flex items-center gap-2 w-fit">
          {opt.icon && <opt.icon className="text-muted-foreground size-4" />}
          <span>{opt.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(String(row.getValue(id)))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

