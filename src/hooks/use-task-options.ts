import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/endpoints";

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
  // Mantém nome 'tipos' por compatibilidade, mas representa status
  tipos: SelectOption[];
  loading: boolean;
  error: string | null;
}

async function fetchJson<T>(path: string): Promise<T> {
  const { getAccessToken } = await import("@/lib/auth-client");
  const token = await getAccessToken();
  const res = await fetch(apiUrl(path), {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    const raw = await res.text();
    const data = ct.includes("application/json")
      ? (() => {
          try {
            return JSON.parse(raw);
          } catch {
            return null;
          }
        })()
      : null;
    const message = (data?.message ?? data?.error ?? raw) as string;
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[use-task-options] ${path} -> HTTP ${res.status}: ${message}`);
    }
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
        const [usersRes, associationsRes] = await Promise.all([
          fetchJson<{ items?: any[] }>("/api/user?limit=100&page=1"),
          fetchJson<{ items?: any[] }>("/api/association?limit=100&page=1"),
        ]);

        if (ignore) return;

        const users: any[] = Array.isArray(usersRes?.items) ? usersRes.items : [];
        const associations: any[] = Array.isArray(associationsRes?.items)
          ? associationsRes.items
          : [];
        setUsuarios(
          users.map((u: any) => ({
            value: u.id,
            label: `${u.name ?? u.email ?? "Usuário"} - ${(u.role ?? "").toString().toLowerCase()}`,
          })),
        );
        setAssociacoes(
          associations.map((a: any) => ({
            value: a.id,
            label: a.name ?? a.nome ?? "Associação",
          })),
        );
        const { statuses } = await import("@/lib/enums");
        setTipos(statuses.map((s) => ({ value: s.value, label: s.label })));
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
