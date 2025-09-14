"use client"

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ViewToggleProps {
  view: 'table' | 'kanban'
}

export function ViewToggle({ view }: ViewToggleProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function hrefFor(v: 'table' | 'kanban') {
    const sp = new URLSearchParams(searchParams?.toString())
    if (v === 'table') sp.delete('view')
    else sp.set('view', 'kanban')
    const qs = sp.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-md border bg-background p-1 text-sm">
      <Link href={hrefFor('table')} className={cn('rounded px-2 py-1', view === 'table' ? 'bg-muted font-medium' : 'text-muted-foreground')}>Tabela</Link>
      <Link href={hrefFor('kanban')} className={cn('rounded px-2 py-1', view === 'kanban' ? 'bg-muted font-medium' : 'text-muted-foreground')}>Kanban</Link>
    </div>
  )
}

