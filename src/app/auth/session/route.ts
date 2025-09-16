import { createClient } from '@/lib/server';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

const HANDLED_EVENTS = new Set<AuthChangeEvent>([
  'INITIAL_SESSION',
  'SIGNED_IN',
  'SIGNED_OUT',
  'TOKEN_REFRESHED',
  'USER_UPDATED',
]);

interface SupabaseWebhookPayload {
  event?: string;
  session?: Session | null;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  let payload: SupabaseWebhookPayload;
  try {
    payload = (await request.json()) as SupabaseWebhookPayload;
  } catch (error: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Corpo inválido recebido em /auth/session', error);
    }
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const event = payload.event as AuthChangeEvent | undefined;
  const session = payload.session ?? null;

  if (!event || !HANDLED_EVENTS.has(event)) {
    return NextResponse.json({ success: true });
  }

  try {
    if (session) {
      await supabase.auth.setSession(session);
    } else {
      await supabase.auth.signOut();
    }
  } catch (error: unknown) {
    console.error('Falha ao atualizar sessão do Supabase', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
