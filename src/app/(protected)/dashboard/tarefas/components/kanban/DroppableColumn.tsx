'use client';

import * as React from 'react';
import { useDroppable } from '@dnd-kit/core';

export function DroppableColumn({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
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
  );
}
