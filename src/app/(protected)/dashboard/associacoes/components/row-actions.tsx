"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { useNotification } from "@/components/NotificationProvider";
import { useRouter } from "next/navigation";
import { deleteAssociation } from "@/services/associations";
import { AssociationRow } from "./columns";
import { EditAssociationDialog } from "./edit-dialog";

interface Props<TData extends AssociationRow> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends AssociationRow>({ row }: Props<TData>) {
  const association = row.original;
  const notify = useNotification();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteAssociation(association.id);
      notify({ type: "success", title: "Associação", message: "Associação excluída com sucesso." });
      router.refresh();
    } catch (error) {
      notify({
        type: "error",
        title: "Associação",
        message: error instanceof Error ? error.message : "Erro ao excluir associação",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted size-8">
          <MoreHorizontal />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <EditAssociationDialog association={association}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Editar
          </DropdownMenuItem>
        </EditAssociationDialog>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
              Excluir
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir associação</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Tem certeza que deseja excluir esta associação?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
