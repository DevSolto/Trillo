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
    value: "Backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "A Fazer",
    label: "A Fazer",
    icon: Circle,
  },
  {
    value: "Em Andamento",
    label: "Em Andamento",
    icon: Timer,
  },
  {
    value: "Concluída",
    label: "Concluída",
    icon: CheckCircle,
  },
  {
    value: "Cancelada",
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
