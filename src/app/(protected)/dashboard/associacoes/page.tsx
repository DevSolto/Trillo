import { columns, type AssociationRow } from './components/columns'
import { DataTable } from './components/DataTable'
import { listAssociationsServer } from '@/services/associations.server'

export default async function AssociacoesPage() {
  let associations: { id: string; name: string; cnpj: string; status: boolean }[] = []
  try {
    const data = await listAssociationsServer({ page: 1, limit: 100 })
    associations = Array.isArray(data?.items) ? data.items : []
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falha ao buscar associações (usando lista vazia).', error)
    }
  }

  const rows: AssociationRow[] = associations.map((a) => ({ id: a.id, name: a.name, cnpj: a.cnpj, status: !!a.status }))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Associações</h1>
      <DataTable columns={columns} data={rows} />
    </div>
  )
}
