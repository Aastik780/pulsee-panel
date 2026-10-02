import { demoStatus } from '@/lib/demo';
import type { StatusPayload } from '@/lib/types';

export const dynamic = 'force-dynamic';

function isStatusPayload(value: unknown): value is StatusPayload {
  const v = value as StatusPayload | null;
  return !!v && typeof v === 'object' && typeof v.bot === 'object' && v.bot !== null && Array.isArray(v.queue);
}

async function fetchUpstream(base: string): Promise<StatusPayload | null> {
  try {
    const res = await fetch(`${base}/api/status`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!isStatusPayload(data)) return null;
    return { ...data, source: 'live' };
  } catch {
    return null;
  }
}

export async function GET(): Promise<Response> {
  const upstream = process.env.PULSEE_BOT_API_URL?.replace(/\/+$/, '');
  const payload: StatusPayload = upstream
    ? (await fetchUpstream(upstream)) ?? demoStatus('offline')
    : demoStatus('demo');

  return Response.json(payload, {
    headers: { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' },
  });
}
