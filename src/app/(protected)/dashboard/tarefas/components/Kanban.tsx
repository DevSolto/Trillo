'use client';

import * as React from 'react';
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  pointerWithin,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { statuses } from '@/lib/enums';
import type { Task } from './columns';
import { Badge } from '@/components/ui/Badge';
import { updateTask } from '@/services/tarefas';
import { DroppableColumn, DraggableTaskCard, TaskCard } from './kanban/index';

interface KanbanProps {
  tasks: Task[];
}

// Subcomponents moved to './kanban'

export function Kanban({ tasks }: KanbanProps) {
  const [items, setItems] = React.useState<Task[]>(tasks);
  const [mounted, setMounted] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  React.useEffect(() => {
    setItems(tasks);
  }, [tasks]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  async function handleDragEnd(e: DragEndEvent) {
    const taskId = String(e.active.id);
    const overId = e.over?.id ? String(e.over.id) : null;
    setActiveId(null);
    if (!overId) return;
    const targetStatus = statuses.find((s) => s.value === overId)?.value;
    if (!targetStatus) return;
    const current = items.find((t) => t.id === taskId);
    if (!current) return;
    if ((current.status ?? 'open') === targetStatus) return;

    // Optimistic update
    const prev = items;
    const next = items.map((t) =>
      t.id === taskId ? { ...t, status: targetStatus } : t
    );
    setItems(next);
    try {
      await updateTask({ id: taskId, status: targetStatus });
    } catch (err) {
      // Revert on failure
      setItems(prev);
      if (process.env.NODE_ENV !== 'production') {
        console.error('Falha ao atualizar status da tarefa', err);
      }
    }
  }

  const activeTask = activeId
    ? items.find((t) => t.id === activeId) || null
    : null;

  if (!mounted) {
    // SSR/initial render without DnD attributes to avoid hydration mismatch
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 max-w-full max-h-full overflow-x-hidden">
        {statuses.map((s) => {
          const list = tasks.filter((t) => (t.status ?? 'open') === s.value);
          return (
            <div
              key={s.value}
              className="flex flex-col gap-3 rounded-md border bg-muted/30 p-3"
            >
              <div className="flex items-center gap-2">
                {s.icon && <s.icon className="text-muted-foreground size-4" />}
                <h3 className="text-sm font-semibold">{s.label}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {list.length}
                </Badge>
              </div>
              <div className="flex flex-col gap-3 pr-1">
                {list.map((t) => (
                  <TaskCard key={t.id} task={t} />
                ))}
                {list.length === 0 && (
                  <div className="text-muted-foreground rounded-md border border-dashed p-3 text-center text-xs">
                    Arraste tarefas para cá
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 max-w-full max-h-full overflow-x-hidden">
        {statuses.map((s) => {
          const list = items.filter((t) => (t.status ?? 'open') === s.value);
          return (
            <DroppableColumn
              key={s.value}
              id={s.value}
              className="flex flex-col gap-3 rounded-md border bg-muted/30 p-3 max-h-full"
            >
              <div className="flex items-center gap-2">
                {s.icon && <s.icon className="text-muted-foreground size-4" />}
                <h3 className="text-sm font-semibold">{s.label}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {list.length}
                </Badge>
              </div>
              <div className="flex flex-col gap-3 pr-1">
                {list.map((t) => (
                  <DraggableTaskCard key={t.id} task={t} />
                ))}
                {list.length === 0 && (
                  <div className="text-muted-foreground rounded-md border border-dashed p-3 text-center text-xs">
                    Arraste tarefas para cá
                  </div>
                )}
              </div>
            </DroppableColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
