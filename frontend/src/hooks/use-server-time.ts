import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const RESYNC_INTERVAL_MS = 5 * 60 * 1000;
const TICK_INTERVAL_MS = 1000;

async function fetchOffset(): Promise<number> {
  const { serverTime } = await api<{ serverTime: string }>('/time');
  return new Date(serverTime).getTime() - Date.now();
}

export function useServerTime() {
  const [offset, setOffset] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      const nextOffset = await fetchOffset().catch(() => null);
      if (!cancelled && nextOffset !== null) {
        setOffset(nextOffset);
      }
    }

    sync();
    const resync = setInterval(sync, RESYNC_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(resync);
    };
  }, []);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), TICK_INTERVAL_MS);
    return () => clearInterval(tick);
  }, []);

  return offset === null ? null : new Date(now + offset);
}
