'use client';

import * as React from 'react';
import { priorities as priorityDefs } from '@/lib/enums';
import type { Task } from '../columns';
import { Badge } from '@/components/ui/Badge';

export function TaskCard({ task }: { task: Task }) {
  const pr = task.priority
    ? priorityDefs.find((p) => p.value === task.priority)
    : null;
  const due = task.endDate
    ? new Date(task.endDate).toLocaleDateString('pt-BR')
    : '-';
  return (
    <div className="rounded-md border bg-background p-3 shadow-sm">
      <h4
        className="font-medium leading-tight whitespace-normal break-words"
        title={task.title}
      >
        {task.title}
      </h4>
      {task.description && (
        <p
          className="text-muted-foreground mt-2 text-sm break-words"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {task.description}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {pr ? (
            <Badge
              variant="outline"
              className={`gap-1 ${
                pr.value === 'low'
                  ? 'border-green-500 text-green-700 bg-green-50'
                  : pr.value === 'medium'
                    ? 'border-yellow-500 text-yellow-700 bg-yellow-50'
                    : pr.value === 'high'
                      ? 'border-red-500 text-red-700 bg-red-50'
                      : ''
              }`}
            >
              {pr.icon && <pr.icon className="size-3" />}
              <span>{pr.label}</span>
            </Badge>
          ) : (
            <Badge variant="outline">-</Badge>
          )}
        </div>
        <span className="text-muted-foreground">{due}</span>
      </div>
    </div>
  );
}
