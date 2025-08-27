import { useEffect, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface TaskOptions {
  usuarios: SelectOption[];
  associacoes: SelectOption[];
  tipos: SelectOption[];
  loading: boolean;
  error: string | null;
}

async function fetchJson(url: string) {
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
          fetchJson("/api/colaboradores/buscar?page=1&perPage=100"),
          fetchJson("/api/associacoes/buscar?page=1&perPage=100"),
          fetchJson("/api/tipos/buscar?page=1&perPage=100"),
        ]);

        if (ignore) return;

        setUsuarios(
          usuariosRes.colaboradores.map((u: any) => ({
            value: u.id,
            label: `${u.nome} - ${u.funcao.toLowerCase()}`,
          })),
        );
        setAssociacoes(
          associacoesRes.associacoes.map((a: any) => ({
            value: a.id,
            label: a.nome,
          })),
        );
        setTipos(
          tiposRes.tipos.map((t: any) => ({ value: t.id, label: t.nome })),
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
