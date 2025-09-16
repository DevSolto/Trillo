'use client';

import * as React from 'react';
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataTableViewOptions } from '../../tarefas/components/DataTableViewOptions';
import { DataTableFacetedFilter } from '../../tarefas/components/DataTableFacetedFilter';
import { roles } from './data';
import { AddUserDialog } from './add-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { useNotification } from '@/components/NotificationProvider';
import { useRouter } from 'next/navigation';
import { deleteUser, updateUser } from '@/services/usuarios/users';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selected = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selected.map((r) => (r.original as { id: string }).id);
  const hasSelection = selectedIds.length > 0;
  const notify = useNotification();
  const router = useRouter();
  const [bulkLoading, setBulkLoading] = React.useState(false);

  async function handleBulkAction(value: string) {
    if (!value || !hasSelection) return;
    setBulkLoading(true);
    try {
      if (value === 'delete') {
        await Promise.all(selectedIds.map((id) => deleteUser(id)));
        notify({
          type: 'success',
          title: 'Usuários',
          message: 'Itens excluídos com sucesso.',
        });
      } else if (value.startsWith('role:')) {
        const role = value.split(':')[1] as 'admin' | 'editor';
        await Promise.all(selectedIds.map((id) => updateUser(id, { role })));
        notify({
          type: 'success',
          title: 'Usuários',
          message: 'Perfil atualizado.',
        });
      }
      router.refresh();
    } catch (e: unknown) {
      notify({
        type: 'error',
        title: 'Ação em massa',
        message: e instanceof Error ? e.message : 'Falha ao aplicar ação',
      });
    } finally {
      setBulkLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Filtrar usuários..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('role') && (
          <DataTableFacetedFilter
            column={table.getColumn('role')!}
            title="Perfil"
            options={roles}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            Limpar
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        {hasSelection && (
          <Select onValueChange={handleBulkAction} disabled={bulkLoading}>
            <SelectTrigger className="h-8 w-[240px]">
              <SelectValue
                placeholder={`Ações em massa (${selectedIds.length})`}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delete">Excluir selecionados</SelectItem>
              <SelectItem value="role:admin">Definir perfil Admin</SelectItem>
              <SelectItem value="role:editor">Definir perfil Editor</SelectItem>
            </SelectContent>
          </Select>
        )}
        <AddUserDialog />
      </div>
    </div>
  );
}
