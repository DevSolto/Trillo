"use client"

import * as React from "react"
import { Check, PlusCircle, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/Command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Separator } from "@/components/ui/Separator"

export interface Option {
  label: string
  value: string
}

interface MultiUserSelectProps {
  options: Option[]
  value: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiUserSelect({ options, value, onChange, placeholder = "Selecione usuários", className }: MultiUserSelectProps) {
  const selectedValues = new Set(value)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className={cn("h-9 w-full justify-between", className)}>
          <span className="inline-flex items-center gap-2 truncate">
            <Users className="size-4" />
            {selectedValues.size === 0 && <span className="text-muted-foreground truncate">{placeholder}</span>}
            {selectedValues.size > 0 && (
              <div className="flex min-w-0 items-center gap-1">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} selecionados
                  </Badge>
                ) : (
                  options
                    .filter((o) => selectedValues.has(o.value))
                    .map((o) => (
                      <Badge key={o.value} variant="secondary" className="rounded-sm px-1 font-normal">
                        {o.label}
                      </Badge>
                    ))
                )}
              </div>
            )}
          </span>
          <PlusCircle className="size-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar usuário" />
          <CommandList>
            <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const next = new Set(selectedValues)
                      if (isSelected) next.delete(option.value)
                      else next.add(option.value)
                      onChange(Array.from(next))
                    }}
                  >
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-[4px] border mr-2",
                        isSelected ? "bg-primary border-primary text-primary-foreground" : "border-input [&_svg]:invisible"
                      )}
                    >
                      <Check className="text-primary-foreground size-3.5" />
                    </div>
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => onChange([])} className="justify-center text-center">
                    Limpar seleção
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

