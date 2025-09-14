"use client"

import * as React from 'react'
import { DndContext, type DragEndEvent, type DragStartEvent, pointerWithin, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { useDroppable, useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { statuses, priorities as priorityDefs } from '@/lib/enums'
import type { Task } from './columns'
import { Badge } from '@/components/ui/Badge'
import { updateTask } from '@/services/tarefas'

interface KanbanProps {
  tasks: Task[]
}

function DraggableTaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id, data: { taskId: task.id } })
  const style = { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.5 : undefined }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <TaskCard task={task} />
    </div>
  )
}

function TaskCard({ task }: { task: Task }) {
  const pr = task.priority ? priorityDefs.find((p) => p.value === task.priority) : null
  const due = task.endDate ? new Date(task.endDate).toLocaleDateString('pt-BR') : '-'
  return (
    <div className="rounded-md border bg-background p-3 shadow-sm">
      {/* Título */}
      <h4 className="font-medium leading-tight whitespace-normal break-words" title={task.title}>
        {task.title}
      </h4>
      {/* Descrição */}
      {task.description && (
        <p
          className="text-muted-foreground mt-2 text-sm break-words"
          style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {task.description}
        </p>
      )}
      {/* Rodapé: prioridade e data limite */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {pr ? (
            <Badge variant="outline" className="gap-1">
              {pr.icon && <pr.icon className="size-3 text-muted-foreground" />}
              <span>{pr.label}</span>
            </Badge>
          ) : (
            <Badge variant="outline">-</Badge>
          )}
        </div>
        <span className="text-muted-foreground">{due}</span>
      </div>
    </div>
  )
}

function DroppableColumn({ id, className, children }: { id: string; className?: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={
        (className || '') +
        ' transition-shadow duration-150' +
        (isOver ? ' shadow-sm' : '')
      }
    >
      {children}
    </div>
  )
}

export function Kanban({ tasks }: KanbanProps) {
  const [items, setItems] = React.useState<Task[]>(tasks)
  const [mounted, setMounted] = React.useState(false)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  React.useEffect(() => {
    setItems(tasks)
  }, [tasks])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id))
  }

  async function handleDragEnd(e: DragEndEvent) {
    const taskId = String(e.active.id)
    const overId = e.over?.id ? String(e.over.id) : null
    setActiveId(null)
    if (!overId) return
    const targetStatus = statuses.find((s) => s.value === overId)?.value
    if (!targetStatus) return
    const current = items.find((t) => t.id === taskId)
    if (!current) return
    if ((current.status ?? 'open') === targetStatus) return

    // Optimistic update
    const prev = items
    const next = items.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    setItems(next)
    try {
      await updateTask({ id: taskId, status: targetStatus })
    } catch (err) {
      // Revert on failure
      setItems(prev)
      if (process.env.NODE_ENV !== 'production') {
        console.error('Falha ao atualizar status da tarefa', err)
      }
    }
  }

  const activeTask = activeId ? items.find((t) => t.id === activeId) || null : null

  if (!mounted) {
    // SSR/initial render without DnD attributes to avoid hydration mismatch
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 max-w-full overflow-x-hidden">
        {statuses.map((s) => {
          const list = tasks.filter((t) => (t.status ?? 'open') === s.value)
          return (
            <div key={s.value} className="flex flex-col gap-3 rounded-md border bg-muted/30 p-3">
              <div className="flex items-center gap-2">
                {s.icon && <s.icon className="text-muted-foreground size-4" />}
                <h3 className="text-sm font-semibold">{s.label}</h3>
                <Badge variant="secondary" className="ml-auto">{list.length}</Badge>
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
          )
        })}
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 max-w-full overflow-x-hidden">
        {statuses.map((s) => {
          const list = items.filter((t) => (t.status ?? 'open') === s.value)
          return (
            <DroppableColumn key={s.value} id={s.value} className="flex flex-col gap-3 rounded-md border bg-muted/30 p-3">
              <div className="flex items-center gap-2">
                {s.icon && <s.icon className="text-muted-foreground size-4" />}
                <h3 className="text-sm font-semibold">{s.label}</h3>
                <Badge variant="secondary" className="ml-auto">{list.length}</Badge>
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
          )
        })}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
