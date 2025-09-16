'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { createClient } from '@/lib/client';

const SESSION_ENDPOINT = '/auth/session';

const HANDLED_EVENTS = new Set<AuthChangeEvent>([
  'INITIAL_SESSION',
  'SIGNED_IN',
  'SIGNED_OUT',
  'TOKEN_REFRESHED',
  'USER_UPDATED',
]);

const EVENTS_REQUIRING_REFRESH = new Set<AuthChangeEvent>([
  'SIGNED_IN',
  'SIGNED_OUT',
  'TOKEN_REFRESHED',
  'USER_UPDATED',
]);

export function SupabaseListener(): null {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const syncSession = async (
      event: AuthChangeEvent,
      session: Session | null
    ): Promise<void> => {
      try {
        const response = await fetch(SESSION_ENDPOINT, {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          credentials: 'include',
          body: JSON.stringify({ event, session }),
        });

        if (!response.ok && process.env.NODE_ENV !== 'production') {
          console.warn(
            'Falha ao sincronizar sessão do Supabase',
            await response.text()
          );
        }
      } catch (error: unknown) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Falha ao sincronizar sessão do Supabase', error);
        }
        throw error;
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!HANDLED_EVENTS.has(event)) {
        return;
      }

      const synchronization = syncSession(event, session);

      if (EVENTS_REQUIRING_REFRESH.has(event)) {
        void synchronization
          .then(() => {
            router.refresh();
          })
          .catch(() => {
            // Error already logged in syncSession; avoid unhandled rejection.
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return null;
}
