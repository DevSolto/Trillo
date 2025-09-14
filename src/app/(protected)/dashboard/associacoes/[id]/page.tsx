export default async function AssociacaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Detalhes da Associação</h1>
      <p>
        Esta página exibe informações e tarefas da associação com ID
        <strong className="ml-1">{id}</strong>.
      </p>
    </div>
  )
}
