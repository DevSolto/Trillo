import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Timer,
} from "lucide-react"

export const labels = [
  {
    value: "bug",
    label: "Erro",
  },
  {
    value: "feature",
    label: "Funcionalidade",
  },
  {
    value: "documentation",
    label: "Documentação",
  },
]

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "todo",
    label: "A Fazer",
    icon: Circle,
  },
  {
    value: "in progress",
    label: "Em Andamento",
    icon: Timer,
  },
  {
    value: "done",
    label: "Concluída",
    icon: CheckCircle,
  },
  {
    value: "canceled",
    label: "Cancelada",
    icon: CircleOff,
  },
]

export const priorities = [
  {
    label: "Baixa",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Média",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "Alta",
    value: "high",
    icon: ArrowUp,
  },
]

export const usuarios = [
  {
    value: "usuario-1",
    label: "João Silva",
  },
  {
    value: "usuario-2",
    label: "Maria Souza",
  },
  {
    value: "usuario-3",
    label: "Carlos Oliveira",
  },
]

export const associacoes = [
  {
    value: "associacao-1",
    label: "Associação Alpha",
  },
  {
    value: "associacao-2",
    label: "Associação Beta",
  },
]

export const tipos = [
  {
    value: "financeiro",
    label: "Financeiro",
  },
  {
    value: "administrativo",
    label: "Administrativo",
  },
]
