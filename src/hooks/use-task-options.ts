import { useEffect, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface Colaborador {
  id: string;
  nome: string;
  funcao: string;
}

interface Associacao {
  id: string;
  nome: string;
}

interface Tipo {
  id: string;
  nome: string;
}

interface TaskOptions {
  usuarios: SelectOption[];
  associacoes: SelectOption[];
  tipos: SelectOption[];
  loading: boolean;
  error: string | null;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Erro ao buscar dados");
  }
  return res.json();
}

export function useTaskOptions(enabled: boolean): TaskOptions {
  const [usuarios, setUsuarios] = useState<SelectOption[]>([]);
  const [associacoes, setAssociacoes] = useState<SelectOption[]>([]);
  const [tipos, setTipos] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let ignore = false;

    async function fetchOptions() {
      setLoading(true);
      setError(null);
      try {
        const [usuariosRes, associacoesRes, tiposRes] = await Promise.all([
          fetchJson<{ colaboradores: Colaborador[] }>(
            "/api/colaboradores/buscar?page=1&perPage=100",
          ),
          fetchJson<{ associacoes: Associacao[] }>(
            "/api/associacoes/buscar?page=1&perPage=100",
          ),
          fetchJson<{ tipos: Tipo[] }>(
            "/api/tipos/buscar?page=1&perPage=100",
          ),
        ]);

        if (ignore) return;

        setUsuarios(
          usuariosRes.colaboradores.map((u) => ({
            value: u.id,
            label: `${u.nome} - ${u.funcao.toLowerCase()}`,
          })),
        );
        setAssociacoes(
          associacoesRes.associacoes.map((a) => ({
            value: a.id,
            label: a.nome,
          })),
        );
        setTipos(
          tiposRes.tipos.map((t) => ({ value: t.id, label: t.nome })),
        );
      } catch (err) {
        if (!ignore) {
          setError("Erro ao carregar opções");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchOptions();

    return () => {
      ignore = true;
    };
  }, [enabled]);

  return { usuarios, associacoes, tipos, loading, error };
}
