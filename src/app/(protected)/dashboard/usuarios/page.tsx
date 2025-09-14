import { columns, type UserRow } from './components/columns'
import { DataTable } from './components/DataTable'
import { listUsersServer } from '@/services/users.server'

export default async function UsuariosPage() {
  let users: { id: string; name: string; email: string; role: string }[] = []
  try {
    const data = await listUsersServer({ page: 1, limit: 100 })
    users = Array.isArray(data?.items) ? data.items : []
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falha ao buscar usuários (usando lista vazia).', error)
    }
  }

  const rows: UserRow[] = users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role }))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Usuários</h1>
      <DataTable columns={columns} data={rows} />
    </div>
  )
}
