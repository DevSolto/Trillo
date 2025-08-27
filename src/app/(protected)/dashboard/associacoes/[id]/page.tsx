interface AssociacaoPageProps {
  params: { id: string }
}

export default function AssociacaoPage({ params }: AssociacaoPageProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Detalhes da Associação</h1>
      <p>
        Esta página exibe informações e tarefas da associação com ID
        <strong className="ml-1">{params.id}</strong>.
      </p>
    </div>
  )
}
