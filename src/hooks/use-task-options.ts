import { useEffect, useMemo, useState } from 'react';

import { statuses } from '@/lib/enums';
import { requestJson } from '@/services/http';
import type { AssociationsResponse, UsersResponse } from '@/types/api';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectOptionsState {
  options: SelectOption[];
  loading: boolean;
  error: string | null;
}

interface TaskOptions {
  usuarios: SelectOption[];
  associacoes: SelectOption[];
  // Mantém nome 'tipos' por compatibilidade, mas representa status
  tipos: SelectOption[];
  loading: boolean;
  error: string | null;
}

const USERS_ENDPOINT = '/api/user?limit=100&page=1';
const ASSOCIATIONS_ENDPOINT = '/api/association?limit=100&page=1';
const LOAD_OPTIONS_ERROR = 'Erro ao carregar opções';

type UserListItem = UsersResponse['items'][number];
type AssociationListItem = AssociationsResponse['items'][number];

function logDebugError(message: string, error: unknown) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(message, error);
  }
}

function toUserOption(user: UserListItem): SelectOption {
  const displayName =
    user.name && user.name.trim().length > 0 ? user.name : user.email;
  const roleLabel = user.role.toLowerCase();
  return {
    value: user.id,
    label: `${displayName} - ${roleLabel}`,
  };
}

function toAssociationOption(association: AssociationListItem): SelectOption {
  const label =
    association.name && association.name.trim().length > 0
      ? association.name
      : association.cnpj;
  return {
    value: association.id,
    label,
  };
}

export function useUsersOptions(enabled: boolean): SelectOptionsState {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let active = true;

    async function loadUsers() {
      setLoading(true);
      setError(null);

      try {
        const response = await requestJson<UsersResponse>(USERS_ENDPOINT);
        if (!active) return;

        setOptions(response.items.map(toUserOption));
      } catch (err: unknown) {
        if (!active) return;

        logDebugError('Erro ao carregar usuários', err);
        setOptions([]);
        setError(LOAD_OPTIONS_ERROR);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUsers();

    return () => {
      active = false;
    };
  }, [enabled]);

  return { options, loading, error };
}

export function useAssociationsOptions(enabled: boolean): SelectOptionsState {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let active = true;

    async function loadAssociations() {
      setLoading(true);
      setError(null);

      try {
        const response = await requestJson<AssociationsResponse>(
          ASSOCIATIONS_ENDPOINT
        );
        if (!active) return;

        setOptions(response.items.map(toAssociationOption));
      } catch (err: unknown) {
        if (!active) return;

        logDebugError('Erro ao carregar associações', err);
        setOptions([]);
        setError(LOAD_OPTIONS_ERROR);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadAssociations();

    return () => {
      active = false;
    };
  }, [enabled]);

  return { options, loading, error };
}

export function useTaskOptions(enabled: boolean): TaskOptions {
  const {
    options: usuarios,
    loading: usersLoading,
    error: usersError,
  } = useUsersOptions(enabled);
  const {
    options: associacoes,
    loading: associationsLoading,
    error: associationsError,
  } = useAssociationsOptions(enabled);

  const tipos = useMemo<SelectOption[]>(
    () =>
      statuses.map((status) => ({ value: status.value, label: status.label })),
    []
  );

  return {
    usuarios,
    associacoes,
    tipos,
    loading: usersLoading || associationsLoading,
    error: usersError ?? associationsError,
  };
}
