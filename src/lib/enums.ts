import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  Timer,
} from 'lucide-react'

// Task statuses aligned with backend enum
export const statuses = [
  { value: 'open', label: 'A Fazer', icon: Circle },
  { value: 'inProgress', label: 'Em Andamento', icon: Timer },
  { value: 'finished', label: 'Concluída', icon: CheckCircle },
  { value: 'canceled', label: 'Cancelada', icon: CircleOff },
]

export const priorities = [
  { label: 'Baixa', value: 'low', icon: ArrowDown },
  { label: 'Média', value: 'medium', icon: ArrowRight },
  { label: 'Alta', value: 'high', icon: ArrowUp },
]
export const labels = [
  { value: 'bug', label: 'Erro' },
  { value: 'feature', label: 'Funcionalidade' },
  { value: 'documentation', label: 'Documentação' },
]
