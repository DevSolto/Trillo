"use client"

import * as React from 'react'
import { statuses } from '@/lib/enums'
import type { Task } from './columns'
import { Badge } from '@/components/ui/Badge'

interface KanbanProps {
  tasks: Task[]
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="rounded-md border bg-background p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-medium leading-tight truncate" title={task.title}>{task.title}</h4>
        {task.priority && <Badge variant="outline">{task.priority}</Badge>}
      </div>
      {task.associacao && (
        <div className="text-muted-foreground mt-1 truncate text-xs">{task.associacao}</div>
      )}
      <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
        <span>{new Date(task.createdAt).toLocaleDateString('pt-BR')}</span>
        <span>{task.endDate ? new Date(task.endDate).toLocaleDateString('pt-BR') : '-'}</span>
      </div>
    </div>
  )
}

export function Kanban({ tasks }: KanbanProps) {
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
                  Nenhuma tarefa
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
